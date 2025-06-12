import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000');

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [currentMsg, setCurrentMsg] = useState('');
  const [chatStarted, setChatStarted] = useState(false);
  const [selectedService, setSelectedService] = useState('');

  useEffect(() => {
    socket.on('chat_message', (msg) => {
      setMessages(prev => [...prev, { sender: 'bot', text: msg }]);
    });

    return () => {
      socket.off('chat_message');
    };
  }, []);

  const startChat = () => {
    if (!selectedService) return alert("Select a service first!");
    socket.emit('start_service', selectedService);
    setMessages([{ sender: 'bot', text: `Starting ${selectedService} diagnosis...` }]);
    setChatStarted(true);
  };

  const sendMessage = () => {
    if (!currentMsg.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: currentMsg }]);
    socket.emit('user_response', currentMsg);
    setCurrentMsg('');
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', border: '1px solid #ccc', padding: 80, borderRadius: 10 }}>
      <h3>Service ChatBot</h3>

      {!chatStarted && (
        <>
          <select value={selectedService} onChange={(e) => setSelectedService(e.target.value)}>
            <option value="">Select Service</option>
            <option value="Plumbing">Plumbing</option>
            <option value="Electrician">Electrician</option>
            <option value="Gardening">Gardening</option>
            <option value="AC Repair">AC Repair</option>
          </select>
          <button onClick={startChat} style={{ marginLeft: 10 }}>Start Chat</button>
        </>
      )}

      <div style={{ marginTop: 20, maxHeight: 300, overflowY: 'auto', background: '#f9f9f9', padding: 10 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.sender === 'user' ? 'right' : 'left' }}>
            <p><strong>{m.sender === 'user' ? 'You' : 'Bot'}:</strong> {m.text}</p>
          </div>
        ))}
      </div>

      {chatStarted && (
        <>
          <input
            type="text"
            value={currentMsg}
            onChange={(e) => setCurrentMsg(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your answer..."
            style={{ width: '80%', padding: 8 }}
          />
          <button onClick={sendMessage} style={{ padding: '8px 10px' }}>Send</button>
        </>
      )}
    </div>
  );
};

export default ChatBot;
