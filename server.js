const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

let rooms = {};

io.on("connection", (socket) => {

  socket.on("joinRoom", ({ name, room }) => {

    socket.join(room);

    if (!rooms[room]) {
      rooms[room] = {
        players: {},
        canClick: false,
        roundActive: false
      };
    }

    rooms[room].players[socket.id] = {
      name: name,
      score: 0
    };

    io.to(room).emit("updatePlayers", rooms[room].players);

    if (Object.keys(rooms[room].players).length >= 2) {
      startRound(room);
    }
  });

  socket.on("click", (room) => {
    const game = rooms[room];
    if (!game || !game.roundActive) return;

    if (!game.canClick) {
      socket.emit("disqualified");
      return;
    }

    game.canClick = false;
    game.roundActive = false;

    game.players[socket.id].score++;

    const winner = game.players[socket.id];

    io.to(room).emit("roundWinner", winner);
    io.to(room).emit("updatePlayers", game.players);

    if (winner.score >= 5) {
      io.to(room).emit("gameWinner", winner);
      resetRoom(room);
    } else {
      setTimeout(() => startRound(room), 3000);
    }
  });

  socket.on("disconnect", () => {
    for (let room in rooms) {
      if (rooms[room].players[socket.id]) {
        delete rooms[room].players[socket.id];
        io.to(room).emit("updatePlayers", rooms[room].players);
      }
    }
  });
});

function startRound(room) {
  const game = rooms[room];
  if (!game) return;

  game.canClick = false;
  game.roundActive = true;

  io.to(room).emit("prepare");

  setTimeout(() => {
    game.canClick = true;
    io.to(room).emit("draw");
  }, Math.random() * 3000 + 2000);
}

function resetRoom(room) {
  const players = rooms[room].players;
  for (let id in players) {
    players[id].score = 0;
  }
}

http.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});