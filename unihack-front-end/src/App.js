import React, { useState, useRef, useEffect } from 'react';
import './output.css'; 
import logo from './logoprimarie (2).png';

const App = () => {
  const [input, setInput] = useState('');  
  const [messages, setMessages] = useState([]);  
  const [loading, setLoading] = useState(false); 

  const textareaRef = useRef(null); 

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const sendMessage = async (message) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: 'user', text: message },
    ]);

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: message }),
      });

      console.log(response);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'backend', text: data.answer },
      ]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && input.trim()) {
      event.preventDefault(); // Prevent newline on Enter
      sendMessage(input);
      setInput(''); 
    }
  };

  const handleSendClick = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';  
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;  
    }
  }, [input]);

  return (
    <div className="flex flex-col h-screen bg-[#F9FAFB] p-0">
      {/* Header */}
      <header className="bg-[#F9FAFB] text-[#005BBC] p-4 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-8 w-8" />
          <span className="text-xl font-bold">Townlink</span>
        </div>
      </header>

      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto mt-4">
        <div className="space-y-4 px-4 py-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 max-w-xs rounded-xl break-words shadow-md ${
                msg.sender === 'user'
                  ? 'bg-[#DBEAFE] text-[#235BBC] ml-auto' 
                  : 'bg-[#F1F5F9] text-[#4B5563]' 
              }`}
              style={{
                wordWrap: 'break-word', 
                whiteSpace: 'pre-wrap', 
              }}
            >
              <p>{msg.text}</p>
            </div>
          ))}
          {loading && (
            <div className="p-3 max-w-xs rounded-lg bg-gray-200 text-gray-700 animate-pulse">
              <p>Loading...</p>
            </div>
          )}
        </div>
      </div>

      {/* Input field and send button */}
      <div className="flex space-x-2 mt-4 px-4">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#005BBC] focus:border-[#005BBC] resize-none"
          style={{
            minHeight: '3rem', 
            maxHeight: '10rem', 
          }}
        />
        <button
          onClick={handleSendClick}
          className="p-3 bg-[#005BBC] text-white rounded-lg hover:bg-[#004EA0] focus:outline-none focus:ring-2 focus:ring-[#005BBC]"
        >
          Send
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-[#F9FAFB] text-[#6B7280] p-4 text-center border-t border-gray-200">
        <p>Thanks for trying our demo!</p>
      </footer>
    </div>
  );
};

export default App;


