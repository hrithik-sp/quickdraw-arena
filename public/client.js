const socket = io();

const name = localStorage.getItem("playerName");
let room = "arena1";

socket.emit("joinRoom", { name, room });

function clickNow() {
  socket.emit("click", room);
}

socket.on("prepare", () => {
  document.getElementById("status").innerText = "Get Ready...";
});

socket.on("draw", () => {
  document.getElementById("status").innerText = "DRAW!";
});

socket.on("roundWinner", (winner) => {
  document.getElementById("status").innerText = winner.name + " wins the round!";
});

socket.on("gameWinner", (winner) => {
  document.getElementById("status").innerText = winner.name + " WINS THE GAME!";
});

socket.on("disqualified", () => {
  document.getElementById("status").innerText = "Too Early! Disqualified!";
});

socket.on("updatePlayers", (players) => {
  let html = "<h2>Scoreboard</h2>";
  for (let id in players) {
    html += `<p>${players[id].name}: ${players[id].score}</p>`;
  }
  document.getElementById("players").innerHTML = html;
});