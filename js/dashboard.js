import { db, ref, set, get, update, onValue } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
  const currentQuestion = document.getElementById('currentQuestion');
  const totalQuestions = document.getElementById('totalQuestions');
  const timer = document.getElementById('timer');
  const progressFill = document.getElementById('progressFill');
  const questionText = document.getElementById('questionText');
  const responseCount = document.getElementById('responseCount');
  const resultsGrid = document.getElementById('resultsGrid');
  const playersLine = document.getElementById('playersLine');
  const startBtn = document.getElementById('startBtn');
  const nextBtn = document.getElementById('nextBtn');
  const waitingState = document.getElementById('waitingState');
  const playingState = document.getElementById('playingState');
  const playerCountBig = document.getElementById('playerCountBig');
  const playersWaitingLine = document.getElementById('playersWaitingLine');

  totalQuestions.textContent = TOTAL_QUESTIONS;

  let currentQ = 0;
  let timeLeft = QUIZ_CONFIG.timePerQuestion;
  let timerInterval = null;

  // Listen for players
  const playersRef = ref(db, 'game/players');
  onValue(playersRef, (snapshot) => {
    const players = snapshot.val();
    if (players) {
      const names = Object.keys(players);
      playerCountBig.textContent = names.length;
      playersLine.textContent = names.join(' - ');
      playersWaitingLine.textContent = names.join(' - ');
    } else {
      playerCountBig.textContent = '0';
      playersLine.innerHTML = '<span>No hay jugadores</span>';
      playersWaitingLine.innerHTML = '<span>Agrega jugadores escaneando el QR</span>';
    }
  });

  function loadQuestion() {
    const q = QUIZ_CONFIG.questions[currentQ];
    currentQuestion.textContent = currentQ + 1;
    progressFill.style.width = `${((currentQ + 1) / TOTAL_QUESTIONS) * 100}%`;
    questionText.textContent = q.question;
    timeLeft = QUIZ_CONFIG.timePerQuestion;
    timer.textContent = timeLeft;
    timer.classList.remove('warning');

    resultsGrid.innerHTML = '';
    q.options.forEach((option) => {
      const card = document.createElement('div');
      card.className = 'result-card';
      card.innerHTML = `
        <div class="result-header">
          <div class="result-label">${option}</div>
          <div class="result-percent">0%</div>
        </div>
        <div class="result-bar">
          <div class="result-fill" style="width: 0%;"></div>
        </div>
      `;
      resultsGrid.appendChild(card);
    });

    responseCount.innerHTML = '<strong>0</strong> de 0 respuestas';

    const answersRef = ref(db, `game/answers/${currentQ}`);
    onValue(answersRef, (snapshot) => {
      const answers = snapshot.val();
      updateResults(answers, q.options.length);
    });
  }

  function updateResults(answers, numOptions) {
    if (!answers) {
      responseCount.innerHTML = '<strong>0</strong> de 0 respuestas';
      return;
    }

    const totalAnswers = Object.keys(answers).length;
    const playersSnapshot = get(ref(db, 'game/players'));
    playersSnapshot.then(snap => {
      const totalPlayers = snap.val() ? Object.keys(snap.val()).length : 0;
      responseCount.innerHTML = `<strong>${totalAnswers}</strong> de ${totalPlayers} respuestas`;
    });

    const counts = new Array(numOptions).fill(0);
    Object.values(answers).forEach(optionIndex => {
      if (optionIndex >= 0 && optionIndex < numOptions) {
        counts[optionIndex]++;
      }
    });

    const cards = resultsGrid.querySelectorAll('.result-card');
    cards.forEach((card, i) => {
      const total = Object.keys(answers).length;
      const percent = total > 0 ? Math.round((counts[i] / total) * 100) : 0;
      card.querySelector('.result-percent').textContent = `${percent}%`;
      card.querySelector('.result-fill').style.width = `${percent}%`;
    });
  }

  function startTimer() {
    timer.textContent = timeLeft;
    timerInterval = setInterval(async () => {
      timeLeft--;
      timer.textContent = timeLeft;

      if (timeLeft <= 5) {
        timer.classList.add('warning');
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        timer.classList.remove('warning');
        nextBtn.style.display = 'block';
      }
    }, 1000);
  }

  async function goToNextQuestion() {
    clearInterval(timerInterval);
    timer.classList.remove('warning');
    currentQ++;

    if (currentQ < TOTAL_QUESTIONS) {
      try {
        await update(ref(db, 'game'), {
          currentQuestion: currentQ
        });
      } catch (error) {
        console.error('Error updating question:', error);
      }
      loadQuestion();
      startTimer();
    } else {
      try {
        await set(ref(db, 'game/status'), 'finished');
      } catch (error) {
        console.error('Error finishing game:', error);
      }
    }
  }

  // Start button
  startBtn.addEventListener('click', async () => {
    startBtn.style.display = 'none';
    waitingState.classList.add('hidden');
    playingState.classList.add('active');
    timer.textContent = QUIZ_CONFIG.timePerQuestion;

    try {
      await update(ref(db, 'game'), {
        status: 'playing',
        currentQuestion: 0,
        timer: QUIZ_CONFIG.timePerQuestion
      });
    } catch (error) {
      console.error('Error starting game:', error);
    }

    loadQuestion();
    startTimer();
  });

  // Next button
  nextBtn.addEventListener('click', () => {
    nextBtn.style.display = 'none';
    goToNextQuestion();
  });
});
