// ChatPopup.jsx

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';


function Chatbox() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        // also guard so clicking the toggle button doesn't close immediately
        !event.target.closest('.chat-popup-toggle-button')
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        messages: updated
      });
      const aiMsg = response.data.message;
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error fetching AI response', err);      
      const errorMessage = err.response?.data?.error || 'Oops, something went wrong. Please try again.';
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: errorMessage }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="chat-popup-toggle-button fixed bottom-4 right-4 z-50 rounded-full bg-blue-600 text-white p-3 shadow-lg focus:outline-none"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? '×' : 'Chat'}
      </button>

      {isOpen && (
        <div
          ref={popupRef}
          className="fixed bottom-20 right-4 z-50 w-80 max-h-[400px] flex flex-col bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={msg.role === 'user' ? 'text-right' : 'text-left'}
              >
                <strong>{msg.role === 'user' ? 'You: ' : 'AI: '}</strong>
                <span>{msg.content}</span>
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 italic">AI is typing...</div>
            )}
          </div>
          <div className="border-t p-2 flex space-x-2">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              rows={2}
              className="flex-1 resize-none border rounded-md p-1 focus:outline-none focus:ring"
              placeholder="Type your message..."
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="bg-blue-600 text-white rounded-md px-3 py-2 disabled:bg-gray-400"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}


export default Chatbox;
