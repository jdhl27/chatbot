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
};

export default Chatbot;
