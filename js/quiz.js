import { db, ref, set, onValue, get } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
  const questionScreen = document.getElementById('questionScreen');
  const waitingScreen = document.getElementById('waitingScreen');
  const currentQuestion = document.getElementById('currentQuestion');
  const timer = document.getElementById('timer');
  const progressFill = document.getElementById('progressFill');
  const questionText = document.getElementById('questionText');
  const optionsContainer = document.getElementById('options');
  const selectedAnswer = document.getElementById('selectedAnswer');

  const playerName = localStorage.getItem('playerName');
  if (!playerName) {
    window.location.href = 'join.html';
    return;
  }

  let currentQ = 0;
  let answered = false;

  // Start with waiting screen
  questionScreen.style.display = 'none';
  waitingScreen.classList.add('active');

  function loadQuestion() {
    const q = QUIZ_CONFIG.questions[currentQ];
    currentQuestion.textContent = currentQ + 1;
    progressFill.style.width = `${((currentQ + 1) / TOTAL_QUESTIONS) * 100}%`;
    questionText.textContent = q.question;
    answered = false;

    questionScreen.style.display = 'flex';
    waitingScreen.classList.remove('active');

    optionsContainer.innerHTML = '';
    q.options.forEach((option, index) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.dataset.index = index;
      btn.textContent = option;
      btn.addEventListener('click', () => selectOption(index, option));
      optionsContainer.appendChild(btn);
    });
  }

  async function selectOption(index, optionText) {
    if (answered) return;
    answered = true;

    const buttons = optionsContainer.querySelectorAll('.option-btn');
    buttons.forEach((btn, i) => {
      btn.disabled = true;
      if (i === index) {
        btn.classList.add('selected');
      }
    });

    try {
      const answerRef = ref(db, `game/answers/${currentQ}/${playerName}`);
      await set(answerRef, index);
    } catch (error) {
      console.error('Error saving answer:', error);
    }

    selectedAnswer.textContent = optionText;

    setTimeout(() => {
      questionScreen.style.display = 'none';
      waitingScreen.classList.add('active');
    }, 500);
  }

  // Listen for timer changes from Firebase
  const timerRef = ref(db, 'game/timer');
  onValue(timerRef, (snapshot) => {
    const firebaseTimer = snapshot.val();
    if (firebaseTimer !== null) {
      timer.textContent = firebaseTimer;
      if (firebaseTimer <= 5) {
        timer.classList.add('warning');
      } else {
        timer.classList.remove('warning');
      }
    }
  });

  // Listen for question changes
  const gameRef = ref(db, 'game/currentQuestion');
  onValue(gameRef, (snapshot) => {
    const newQuestion = snapshot.val();
    if (newQuestion !== null && newQuestion !== currentQ) {
      currentQ = newQuestion;
      if (currentQ < TOTAL_QUESTIONS) {
        loadQuestion();
      } else {
        window.location.href = 'index.html';
      }
    }
  });

  // Listen for game finished
  const statusRef = ref(db, 'game/status');
  onValue(statusRef, (snapshot) => {
    const status = snapshot.val();
    if (status === 'finished') {
      window.location.href = 'index.html';
    }
  });
});
