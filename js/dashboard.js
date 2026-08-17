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

  totalQuestions.textContent = TOTAL_QUESTIONS;

  let currentQ = 0;
  let timeLeft = QUIZ_CONFIG.timePerQuestion;
  let timerInterval = null;

  const playersRef = ref(db, 'game/players');
  onValue(playersRef, (snapshot) => {
    const players = snapshot.val();
    if (players) {
      const names = Object.keys(players);
      playersLine.textContent = names.join(' - ');
    } else {
      playersLine.innerHTML = '<span>No hay jugadores</span>';
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

  startBtn.addEventListener('click', async () => {
    startBtn.style.display = 'none';

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

    timerInterval = setInterval(async () => {
      timeLeft--;
      timer.textContent = timeLeft;

      if (timeLeft <= 5) {
        timer.classList.add('warning');
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        currentQ++;

        if (currentQ < TOTAL_QUESTIONS) {
          try {
            await update(ref(db, 'game'), {
              currentQuestion: currentQ,
              timer: QUIZ_CONFIG.timePerQuestion
            });
          } catch (error) {
            console.error('Error updating question:', error);
          }
          loadQuestion();
        } else {
          try {
            await set(ref(db, 'game/status'), 'finished');
          } catch (error) {
            console.error('Error finishing game:', error);
          }
        }
      }
    }, 1000);
  });
});
