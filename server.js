const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let players = {};
let gameStarted = false;
let canClick = false;

io.on("connection", (socket) => {
  console.log("Player connected");

  socket.on("join", (name) => {
    players[socket.id] = { name: name, score: 0 };
    io.emit("updatePlayers", players);
  });

  socket.on("click", () => {
    if (!canClick) {
      socket.emit("disqualified");
      return;
    }

    if (canClick) {
      players[socket.id].score++;
      canClick = false;
      io.emit("roundWinner", players[socket.id]);
      io.emit("updatePlayers", players);
      setTimeout(startRound, 3000);
    }
  });

  socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });
});

function startRound() {
  canClick = false;
  io.emit("prepare");

  setTimeout(() => {
    canClick = true;
    io.emit("draw");
  }, Math.random() * 4000 + 1000);
}

setInterval(() => {
  if (!canClick) startRound();
}, 10000);

http.listen(3000, () => {
  console.log("Server running on port 3000");
});