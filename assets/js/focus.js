function startFocus(mode) {
    const focusState = document.getElementById("focusState");
    let soundtrack, label;
  
    if (mode === "deep") {
      soundtrack = "assets/audio/deep-work.mp3";
      label = "💪 Deep Work Mode Activated – Timer started!";
    } else if (mode === "creative") {
      soundtrack = "assets/audio/creative-flow.mp3";
      label = "🎨 Creative Flow Mode Activated – Let's create!";
    } else if (mode === "chill") {
      soundtrack = "assets/audio/chill-focus.mp3";
      label = "😌 Chill Focus Mode Activated – Stay centered.";
    }
  
    focusState.innerHTML = `${label}<br><br><span id="timer">25:00</span>`;
    playSoundtrack(soundtrack);
    startTimer(25 * 60); // 25 min in seconds
  }
  
  function playSoundtrack(src) {
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0.4;
    audio.play();
  }
  
  function startTimer(duration) {
    let time = duration;
    const timerElement = document.getElementById("timer");
  
    const interval = setInterval(() => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      timerElement.textContent =
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      time--;
  
      if (time < 0) {
        clearInterval(interval);
        timerElement.textContent = "⏰ Time’s up! Take a break.";
      }
    }, 1000);
  }
  