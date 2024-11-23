import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { RiSendPlaneFill } from "react-icons/ri";
import { BsPersonCircle } from "react-icons/bs";
import ChatGPTsvg from "./img/chatgpt-icon-svg.svg";

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
    <div className="flex flex-col min-h-screen px-4 bg-gray-800 text-white">
      <h1 className="text-center font-medium my-3">ChatGPT Clone</h1>
      <div className="flex-1 max-h-[80vh] overflow-y-auto w-full max-w-2xl mx-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        {conversation.length === 0 && (
          <div className="flex items-start my-5">
            <img src={ChatGPTsvg} alt="" className="w-6 h-6 mr-2" />
            <p>Ask Me Anything ....</p>
          </div>
        )}
        {conversation.map((obj, index) =>
          obj.type === "query" ? (
            <div key={index} className="flex items-start my-5">
              <BsPersonCircle className="mr-2 text-2xl" />
              <p>{obj.text}</p>
            </div>
          ) : (
            <div key={index} className="flex items-start my-5">
              <img src={ChatGPTsvg} alt="" className="w-6 h-6 mr-2" />
              <p>{obj.text}</p>
            </div>
          )
        )}
        {loading && (
          <div className="flex items-start my-5">
            <img src={ChatGPTsvg} alt="" className="w-6 h-6 mr-2" />
            <p>.........</p>
          </div>
        )}
      </div>
      <form
        className="flex items-center w-full max-w-2xl mx-auto bg-gray-700 rounded-lg pr-4 mb-8"
        onSubmit={handleQuerySubmit}
      >
        <input
          type="text"
          required
          value={prompt}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
          className="bg-transparent text-lg p-3 text-white flex-1 border-none outline-none"
        />
        <button
          type="submit"
          disabled={!prompt || loading}
          className="text-white flex items-center justify-center outline-none border-none"
        >
          <RiSendPlaneFill className="text-2xl cursor-pointer p-1 rounded hover:bg-gray-600" />
        </button>
      </form>
    </div>
  );
}

export default App;
