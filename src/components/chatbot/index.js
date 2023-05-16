import React, { useState, useRef, useEffect } from "react";
import Lottie from "lottie-react";
import { FaMicrophone } from "react-icons/fa";
import { MdSend } from "react-icons/md";
// import { FiArrowDown } from "react-icons/fi";

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
  // const divRef = useRef(null);
  const inputMessage = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      handleDown();
    }, 10);
  }, [messages]);

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
        handleMessageSubmit(valueInput + " " + valueRecording);
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

  const handleBotMessage = (response = {}) => {
    if (Object.entries(response).length > 0) {
      const newMessage = {
        text: response.message,
        sender: "bot",
      };
      setTimeout(() => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setLoadMessageBot(false);
        setTimeout(() => {
          inputMessage.current && inputMessage.current.focus();
        }, 10);
      }, 500);
    }
  };

  const handleMessageSubmit = (value) => {
    let valueSend = value || valueInput;
    if (valueSend) {
      valueSend = valueSend?.trim();
      if (!valueSend || valueSend === "") {
        return;
      }
      const newMessage = {
        text: valueSend,
        sender: "user",
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setValueInput("");
      setLoadMessageBot(true);

      fetch("http://127.0.0.1:5000/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: valueSend }),
      })
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
          Notify("Algo pasó, envia el mensaje de nuevo por favor", "error");
          setLoadMessageBot(false);
          setTimeout(() => {
            inputMessage.current && inputMessage.current.focus();
          }, 10);
          return {};
        })
        .then((data) => handleBotMessage(data))
        .catch(() => {
          Notify(
            "En este momento presentamos fallas en el servicio, discúlpanos",
            "error"
          );
          // setLoadMessageBot(false);
          setTimeout(() => {
            inputMessage.current && inputMessage.current.focus();
          }, 10);
        });
    }
  };

  const handleDown = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
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
            style={{ width: "74%", margin: "97px auto" }}
          />
        ) : (
          messages.map((message, index) => {
            const textParts = message.text.split(":");
            const introduction = textParts[0].trim();
            const items =
              textParts.length > 1
                ? textParts[1].split(";").map((item) => item.trim())
                : [];

            return (
              <div
                key={index}
                className={`message ${
                  message.sender === "user" ? "user" : "bot"
                }`}
              >
                {introduction && !items.length && (
                  <p>{capitalize(message.text)}</p>
                )}
                {introduction && items.length > 0 && (
                  <p>
                    {capitalize(introduction)}:
                    <ul>
                      {items.map((item, itemIndex) => (
                        <li style={{ listStyleType: "circle" }} key={itemIndex}>
                          {capitalize(item)}
                        </li>
                      ))}
                    </ul>
                  </p>
                )}
              </div>
            );
          })
        )}
        {loadMessageBot && (
          <div className="message bot">
            <Lottie animationData={loadAnimation} className="animation-load" />
          </div>
        )}
        {/* {messages.length > 5 && divRef.current.scrollTop < 10 ? (
          <div onClick={handleDown} className="container-button-down">
            <FiArrowDown />
          </div>
        ) : null} */}
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleMessageSubmit();
              }
            }}
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
          onClick={() => handleMessageSubmit()}
          style={{ cursor: "pointer" }}
        >
          <MdSend />
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
