const prompts = [
    "What’s a small moment today that made you feel seen?",
    "Describe a time you felt misunderstood — what did you wish you could say?",
    "What emotion are you avoiding right now, and why?",
    "Write a letter to your future self, 1 year from now.",
    "When was the last time you surprised yourself?",
    "What does 'feeling safe' look like to you?",
    "Who in your life makes you feel most like yourself?",
    "If your emotions were weather, what would today’s forecast be?"
  ];
  
  function getPrompt() {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    const promptDisplay = document.getElementById("promptDisplay");
    promptDisplay.textContent = prompts[randomIndex];
  }
  