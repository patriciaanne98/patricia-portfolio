const gameArea = document.getElementById("gameArea");
const scoreDisplay = document.getElementById("score");
const timeDisplay = document.getElementById("time");
const highScoreDisplay = document.getElementById("highScore");
const replayBtn = document.getElementById("replayBtn");
const frog = document.querySelector(".frog");

const bugs = ["🪰", "🦋", "🐞", "🌶️"];
let score = 0;
let timeLeft = 30;
let gameInterval, countdown;

const gulpSound = new Audio("assets/audio/gulp.mp3");
const burpSound = new Audio("assets/audio/burp.mp3");

function updateHighScore() {
  const stored = localStorage.getItem("frogHighScore");
  if (!stored || score > stored) {
    localStorage.setItem("frogHighScore", score);
  }
  highScoreDisplay.textContent = localStorage.getItem("frogHighScore") || 0;
}

function spawnBug() {
  const bug = document.createElement("div");
  bug.classList.add("bug");

  const emoji = bugs[Math.floor(Math.random() * bugs.length)];
  bug.textContent = emoji;

  const x = Math.random() * (window.innerWidth - 60);
  const y = Math.random() * (window.innerHeight - 200);

  bug.style.left = `${x}px`;
  bug.style.top = `${y}px`;

  gameArea.appendChild(bug);

  bug.addEventListener("click", () => {
    playTongue(bug);

    if (emoji === "🌶️") {
      burpSound.play();
      alert("🔥 SPICY BUG! The frog burped! 💨");
    } else {
      gulpSound.play();
    }

    bug.remove();
    score++;
    scoreDisplay.textContent = score;
    updateHighScore();
  });

  setTimeout(() => bug.remove(), 3000);
}

function playTongue(bug) {
  const frog = document.querySelector('.frog');
  const frogRect = frog.getBoundingClientRect();
  const bugRect = bug.getBoundingClientRect();

  const tongue = document.createElement("div");
  tongue.classList.add("tongue");

  const startX = frogRect.left + frogRect.width / 2;
  const startY = frogRect.top + 10; // small offset down
  const endX = bugRect.left + bugRect.width / 2;
  const endY = bugRect.top + bugRect.height / 2;

  const dx = endX - startX;
  const dy = endY - startY;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  tongue.style.height = `${length}px`;
  tongue.style.left = `${startX}px`;
  tongue.style.top = `${startY}px`;
  tongue.style.transform = `rotate(${angle}deg)`;

  document.body.appendChild(tongue);

  // Remove tongue after 300ms
  setTimeout(() => tongue.remove(), 300);
}

function startGame() {
  clearInterval(gameInterval);
  clearInterval(countdown);
  gameArea.querySelectorAll(".bug").forEach(b => b.remove());

  score = 0;
  timeLeft = 30;
  scoreDisplay.textContent = score;
  timeDisplay.textContent = timeLeft;
  replayBtn.style.display = "none";

  updateHighScore();

  gameInterval = setInterval(spawnBug, 1000);
  countdown = setInterval(() => {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(gameInterval);
      clearInterval(countdown);
      alert(`⏰ Time's up! Final Score: ${score}`);
      replayBtn.style.display = "block";
    }
  }, 1000);
}


window.onload = () => {
  updateHighScore();
  startGame();
};


