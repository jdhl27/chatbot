import React, { useState, useRef, useEffect } from "react";
import Lottie from "lottie-react";
import { FaMicrophone } from "react-icons/fa";
import { MdSend } from "react-icons/md";

import waitAnimation from "../../animations/wait.json";
import robotAnimation from "../../animations/robot.json";
import loadAnimation from "../../animations/loading.json";
import "./styles.css";
import { Notify } from "../notify";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [valueInput, setValueInput] = useState("");
  const [loadMessageBot, setLoadMessageBot] = useState(false);

  const messagesEndRef = useRef(null);
  const inputMessage = useRef(null);
  // eslint-disable-next-line no-undef
  let recognition = new webkitSpeechRecognition();
  recognition.lang = "es-ES";

  recognition.onresult = (event) => {
    let valueRecording;
    setRecording(false);
    for (const result of event.results) {
      valueRecording = result[0].transcript;
    }

    if (valueRecording) {
      setValueInput((value) => value + " " + valueRecording);

      if (valueRecording?.includes("enviar")) {
        valueRecording = valueRecording?.replace("enviar", "");
      }
    }
  };

  recognition.onerror = (error) => {
    if (error.error === "not-allowed") {
      Notify("Recuerda dar el permiso del micrófono", "error");
    } else {
      setRecording(false);
      Notify("Ocurrió un error grabando, intenta escribiendo", "error");
    }
  };
      }
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        {messages.length !== 0 ? (
          <Lottie
            animationData={robotAnimation}
            style={{ width: "5.6%", margin: "0 auto" }}
          />
        ) : (
          <h3>¡Bienvenido!</h3>
        )}
      </div>
      <div className="chatbot-messages">
        {messages.length === 0 ? (
          <Lottie
            animationData={waitAnimation}
            style={{ width: "60%", margin: "0 auto" }}
          />
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.sender === "user" ? "user" : "bot"
              }`}
            >
              <p>{message.text}</p>
            </div>
          ))
        )}
        {loadMessageBot && (
          <div className="message bot">
            <Lottie animationData={loadAnimation} className="animation-load" />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="form">
        <div className="containerInput">
          <input
            autoFocus
            ref={inputMessage}
            disabled={loadMessageBot}
            type="text"
            name="chatInput"
            placeholder="Escribe tu mensaje..."
            value={valueInput}
            onChange={(text) => setValueInput(text.currentTarget.value)}
            autoComplete="off"
          />

          <FaMicrophone
            onClick={() => {
              if (!loadMessageBot) {
                setRecording(true);
                recognition.start();
              }
            }}
            style={{ cursor: "pointer" }}
            color={recording ? "red" : "#000"}
          />
        </div>
        <button
          disabled={loadMessageBot}
          style={{ cursor: "pointer" }}
        >
          <MdSend />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
