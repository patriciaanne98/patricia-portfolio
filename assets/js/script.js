function showAdvice(mood) {
    const advice = {
      happy: [
        "Celebrate your joy today. Spread that energy to someone else 🥰",
        "Capture this feeling. What made today feel good?",
        "You deserve this moment — enjoy it fully!"
      ],
      sad: [
        "It’s okay to feel low. Be gentle with yourself 💛",
        "Name one small thing that could bring you comfort right now.",
        "Try writing down how you feel without editing — just let it flow."
      ],
      frustrated: [
        "Pause and take 3 deep breaths. What’s *really* bothering you?",
        "Step away for 5 minutes — your future self will thank you.",
        "Turn frustration into action. What's one small win you can take today?"
      ],
      tired: [
        "You don’t have to earn your rest. You already deserve it.",
        "Can you give yourself 10 minutes of total stillness?",
        "Your body is speaking. Are you listening?"
      ],
      anxious: [
        "Inhale 4… hold 4… exhale 6. Try that 3 times.",
        "What’s one thing in your control right now?",
        "Write down 3 things that are true and safe in this moment."
      ]
    };
  
    const moodAdvice = advice[mood];
    const randomIndex = Math.floor(Math.random() * moodAdvice.length);
    document.getElementById("adviceDisplay").textContent = moodAdvice[randomIndex];
  }
  