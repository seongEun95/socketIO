import { Server } from "socket.io";
import express from "express";
import { createServer } from "http";
import ViteExpress from "vite-express";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (client) => {
  // console.log("사용자가 들ㅓ왓다." + client);

  const connectedClientUsername = client.handshake.query.username;

  console.log(`사용자가 들어왔습니다. ${connectedClientUsername}`);

  client.broadcast.emit("new message", {
    username: "관리자",
    message: `${connectedClientUsername}님이 들어왔습니다.`,
  });

  client.on("new message", (msg) => {
    console.log(`보낸 사용자 :  ${connectedClientUsername}`);
    console.log(msg);
    // io.emit("new message", {
    //   username: connectedClientUsername,
    //   message: `${connectedClientUsername}님이 나갔습니다.`,
    // });

    io.emit("new message", {
      username: msg.username,
      message: msg.message,
    });
  });

  client.on("disconnect", () => {
    console.log(`사용자가 나갔습니다. ${connectedClientUsername}`);
    io.emit("new message", {
      username: "관리자",
      message: `${connectedClientUsername}님이 나갔습니다.`,
    });
  });
});

server.listen(3000, () => {
  console.log("3000 port");
});

app.get("/message", (_, res) => res.send("Hello from express!"));
app.get("/api", (_, res) => {
  res.send("api is ");
});

ViteExpress.bind(app, server);
