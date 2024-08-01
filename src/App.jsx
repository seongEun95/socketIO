import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { io } from "socket.io-client";

function App() {
  const [count, setCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState("");
  const [userInput, setUserInput] = useState("");
  const [inputBool, setInputBool] = useState(false);

  function connectToChatServer() {
    console.log("connectToChatServer");
    const _socket = io("http://localhost:3000", {
      autoConnect: false,
      query: {
        username: username,
      },
    });
    _socket.connect();
    setSocket(_socket);
  }

  function disconnectToChatServer() {
    console.log("disconnectToChatServer");
    socket?.disconnect();
    setUsername("");
  }

  function onConnected() {
    console.log("프론트 onConnected");
    setIsConnected(true);
  }

  function onDisConnected() {
    console.log("프론트 disConnected");
    setIsConnected(false);
  }

  function sendMessageToChatServer() {
    console.log(`input : ${userInput}`);
    socket?.emit(
      "new message",
      { username: username, message: userInput },
      (res) => {
        console.log(res);
      }
    );
    setUserInput("");
  }

  function onMessageReceived(msg) {
    setMessages((prev) => [...prev, msg]);
  }

  useEffect(() => {
    console.log("use effect called");
    socket?.on("connect", onConnected);
    socket?.on("disconnect", onDisConnected);

    socket?.on("new message", onMessageReceived);

    return () => {
      socket?.off("connect", onConnected);
      socket?.off("disconnect", onDisConnected);
      socket?.off("new message", onMessageReceived);
      console.log("clean up"); // clean up function
    };
  }, [socket]);

  useEffect(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  }, [messages]);

  const messageList = messages.map((aMsg, index) => (
    <li key={index}>
      {aMsg.username} : {aMsg.message}
    </li>
  ));

  const inputOnHandler = (e) => {
    userInput !== "" ? setInputBool(true) : setInputBool(false);
    setUserInput(e.target.value);
  };

  return (
    <>
      <header></header>

      <div className="Main">
        <div>
          <h2>현재 접속상태 : {isConnected ? "접속중" : "미접속"}</h2>
        </div>
        <div>{isConnected && <h1>{username}님이 접속 중 입니다.</h1>}</div>
        <div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isConnected ? true : false}
          />

          {isConnected ? (
            <button onClick={() => disconnectToChatServer()}>접속종료</button>
          ) : (
            <button onClick={() => connectToChatServer()}>접속</button>
          )}
        </div>
      </div>

      <ul className="MessageList">{messageList}</ul>

      <div className="MessageInput">
        <input
          type="text"
          value={userInput}
          onChange={inputOnHandler}
          disabled={isConnected ? false : true}
        />
        <button
          onClick={() => {
            sendMessageToChatServer();
            setInputBool(false);
          }}
          disabled={isConnected && inputBool ? false : true}
        >
          보내기
        </button>
      </div>
    </>
  );
}

export default App;
