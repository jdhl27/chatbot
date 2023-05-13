import React, { useState, useRef, useEffect } from "react";
const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [valueInput, setValueInput] = useState("");
  const [loadMessageBot, setLoadMessageBot] = useState(false);

  const messagesEndRef = useRef(null);
  const inputMessage = useRef(null);
};

export default Chatbot;
