import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Chatbot from "./components/chatbot";

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Chatbot />
    </div>
  );
}

export default App;
