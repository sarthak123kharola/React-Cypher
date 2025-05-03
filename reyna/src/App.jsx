import React, { useState, useRef, useEffect } from "react";
import ChatMessage from "./ChatMessage";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatLogRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botReply = { sender: "bot", text: data.reply || "No response received." };
      setMessages(prev => [...prev, botReply]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: "bot", text: "Error occurred." }]);
    }
  };

  useEffect(() => {
    chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="chat-header">
        CYPHER: Only I could see you hide. Don’t worry
      </div>
      <div className="chat-log" ref={chatLogRef}>
        {messages.map((msg, idx) => (
          <ChatMessage key={idx} sender={msg.sender} text={msg.text} />
        ))}
      </div>
      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
