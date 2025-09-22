// Chatbox.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Chatbox() {
  const [messages, setMessages] = useState([
    // initial system / assistant message if you want
    { role: 'assistant', content: 'Hello! How can I help you?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    // add user message
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
      // maybe add error message
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="w-full rounded-lg border bg-background p-2 text-black">
      <div style={{ height: '300px', overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ margin: '5px 0' }}>
            <strong>{msg.role === 'user' ? 'You: ' : 'AI: '}</strong>
            {msg.content}
          </div>
        ))}
        {loading && <div>AI is typing...</div>}
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
        rows={2}
        style={{ width: '100%', boxSizing: 'border-box', resize: 'none',
               marginBottom: '5px' , padding: '5px' 
        }}
      />
      <button onClick={sendMessage} disabled={loading || !input.trim()}>
        Send
      </button>
    </div>
  );
}

export default Chatbox;
