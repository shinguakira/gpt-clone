import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import './App.css'
import { RiSendPlaneFill } from "react-icons/ri";
import { BsPersonCircle } from "react-icons/bs";
import ChatGPTsvg from "../public/img/chatgpt-icon-svg.svg";

interface Conversation {
  type: 'query' | 'response';
  text: string;
}

function App() {
  const [prompt, setPrompt] = useState<string>("");
  const [conversation, setConversation] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log(conversation);
  }, [conversation]);

  const handleQuerySubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setLoading(true);
    setConversation((prevData) => [
      ...prevData, {
        type: "query",
        text: prompt,
      },
    ]);
    const temp: string = prompt;
    setPrompt("");
    // we get the response from the server here
    getResponseFromServer(temp);
  }

  const getResponseFromServer = async (temp: string): Promise<void> => {
    try {
      const response = await fetch("http://localhost:5000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: temp }),
      });
      const responseData = await response.json();
      setConversation((prevData) => [
        ...prevData,
        {
          type: "response",
          text: responseData.res,
        }
      ]);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setConversation((prevData) => [
        ...prevData, {
          type: "response",
          text: "Something Went Wrong!",
        }
      ]);
      setLoading(false);
    }
  }

  return (
    <div className="app-container">
      <h1>ChatGPT Clone</h1>
      <div className="conversation-container">
        {conversation.length === 0 ? (
          <div className="conversation-reponse query-container">
            <img src={ChatGPTsvg} alt="" />
            <p>Ask Me Anything ....</p>
          </div>
        ) : (
          <></>
        )}
        {conversation.map((obj, index) =>
          obj.type === "query" ? (
            <div key={index} className="conversation-query query-container">
              <BsPersonCircle />
              <p>{obj.text}</p>
            </div>
          ) : (
            <div key={index} className="conversation-reponse query-container">
              <img src={ChatGPTsvg} alt="" />
              <p>{obj.text}</p>
            </div>
          )
        )}
        {loading ? (
          <div className="conversation-reponse query-container">
            <img src={ChatGPTsvg} alt="" />
            <p>.........</p>
          </div>
        ) : (
          <></>
        )}
      </div>
      <form className="app-input-container" onSubmit={handleQuerySubmit}>
        <input
          type="text"
          required
          value={prompt}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
        />
        <button type="submit" disabled={!prompt || loading}>
          <RiSendPlaneFill />
        </button>
      </form>
    </div>
  );
  
};

export default App;
