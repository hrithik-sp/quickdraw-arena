const socket = io();
const name = localStorage.getItem("playerName");
socket.emit("join", name);

function clickNow() {
  socket.emit("click");
}

socket.on("prepare", () => {
  document.getElementById("status").innerText = "Get Ready...";
});

socket.on("draw", () => {
  document.getElementById("status").innerText = "DRAW!";
});

socket.on("roundWinner", (winner) => {
  document.getElementById("status").innerText = winner.name + " wins!";
});

socket.on("disqualified", () => {
  document.getElementById("status").innerText = "Too Early! Disqualified!";
});

socket.on("updatePlayers", (players) => {
  let html = "<h3>Scoreboard</h3>";
  for (let id in players) {
    html += `<p>${players[id].name}: ${players[id].score}</p>`;
  }
  document.getElementById("players").innerHTML = html;
});