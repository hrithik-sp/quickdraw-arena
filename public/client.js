const socket = io();

const name = localStorage.getItem("playerName");
let room = localStorage.getItem("roomCode") || "arena1";

socket.emit("joinRoom", { name, room });

const status = document.getElementById("status");
const button = document.getElementById("drawBtn");

function clickNow() {
  socket.emit("click", room);
}

socket.on("prepare", () => {
  button.disabled = true;
  status.innerText = "Get Ready...";
  document.body.classList.remove("drawMode");
});

socket.on("draw", () => {
  button.disabled = false;
  status.innerText = "DRAW!";
  document.body.classList.add("drawMode");
  randomizeButton();
});

socket.on("roundWinner", (winner) => {
  status.innerText = winner.name + " wins the round!";
  document.body.classList.remove("drawMode");
  button.disabled = true;
});

socket.on("gameWinner", (winner) => {
  status.innerText = "🏆 " + winner.name + " WINS THE GAME!";
  button.disabled = true;
});

socket.on("disqualified", () => {
  status.innerText = "Too Early! Disqualified!";
});

socket.on("updatePlayers", (players) => {
  let html = "<h2>Scoreboard</h2>";
  for (let id in players) {
    html += `<p>${players[id].name}: ${players[id].score}</p>`;
  }
  document.getElementById("players").innerHTML = html;
});
function randomizeButton() {
  const btn = document.getElementById("drawBtn");
  const area = document.querySelector(".game-area");

  const maxX = area.clientWidth - btn.offsetWidth;
  const maxY = area.clientHeight - btn.offsetHeight;

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  btn.style.left = x + "px";
  btn.style.top = y + "px";
}