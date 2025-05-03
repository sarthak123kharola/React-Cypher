import React from "react";

export default function ChatMessage({ sender, text }) {
  return (
    <div className={sender === "user" ? "user-message" : "bot-message"}>
      <strong>{sender === "user" ? "You" : "Bot"}:</strong> {text}
    </div>
  );
}
