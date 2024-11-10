import chromadb
from openai import OpenAI
import os
import pandas as pd

openai = OpenAI(api_key='')

def initialize_chroma_db():
    client = chromadb.PersistentClient(path="./chroma_db")
    
    collection = client.get_or_create_collection(name="services")

    df = pd.read_csv('processed_servicii.csv', encoding='utf-8')

    chunks = []
    for idx, row in df.iterrows():
        chunk = {
            "id": row['service_id'],
            "text": row['Description'],
            "metadata": {
                "service_name": row['name'],
                "category": row['category']
            }
        }
        chunks.append(chunk)

    for chunk in chunks:
        embedding = openai.embeddings.create(
            input=[chunk["text"]],
            model="text-embedding-ada-002"
        )

        embedding = embedding.data[0].embedding 
        
        collection.add(
            documents=[chunk["text"]],
            metadatas=[chunk["metadata"]],
            ids=[chunk["id"]],
            embeddings=[embedding]
        )

    print("All chunks have been added to the Chroma database.")

if __name__ == "__main__":
    initialize_chroma_db()
    print("ChromaDB has been initialized and persisted.")
