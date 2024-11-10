import chromadb
from openai import OpenAI
import os
import sys
import json

openai = OpenAI(api_key='')

def handle_query(user_query):
    client = chromadb.PersistentClient(path="./chroma_db")
    
    collection = client.get_collection(name="services")

    embedding_response = openai.embeddings.create(
        input=[user_query],
        model="text-embedding-ada-002"
    )
    query_embedding = embedding_response.data[0].embedding
    
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=1,
        include=['documents']
    )

    if results["documents"]:
        retrieved_texts = results["documents"][0]
    else:
        retrieved_texts = ["Nu am găsit informații relevante pentru întrebarea ta."]
    
    # Prepare the context and prompt
    context = " ".join(retrieved_texts)
    prompt = f"Răspunde la întrebare pe baza contextului de mai jos.\n\nContext: {context}\n\nÎntrebare: {user_query}\nRăspuns:"

    completion_response = openai.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Ești un asistent care interpretează contextul și oferă răspunsuri în baza acelui context."},
            {"role": "user", "content": prompt}
        ]
    )

    answer = completion_response.choices[0].message.content.strip()
    return answer

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Please provide a query.")
        sys.exit(1)
    user_query = sys.argv[1]
    answer = handle_query(user_query)
    print(json.dumps({"answer": answer}, ensure_ascii=False))

