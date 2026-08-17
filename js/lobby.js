import { db, ref, set, onValue, update } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
  const qrcode = document.getElementById('qrcode');
  const qrLink = document.getElementById('qrLink');
  const playerCount = document.getElementById('playerCount');
  const playersLine = document.getElementById('playersLine');
  const startBtn = document.getElementById('startBtn');

  const joinUrl = window.location.href.replace('lobby.html', 'join.html');

  new QRCode(qrcode, {
    text: joinUrl,
    width: 400,
    height: 400,
    colorDark: "#000000",
    colorLight: "#ffffff",
  });

  qrLink.textContent = joinUrl;

  const playersRef = ref(db, 'game/players');
  onValue(playersRef, (snapshot) => {
    const players = snapshot.val();
    if (players) {
      const names = Object.keys(players);
      playerCount.textContent = names.length;
      playersLine.textContent = names.join(' - ');
    } else {
      playerCount.textContent = '0';
      playersLine.innerHTML = '<span>Esperando jugadores...</span>';
    }
  });

  startBtn.addEventListener('click', async () => {
    try {
      await update(ref(db, 'game'), {
        status: 'playing',
        currentQuestion: 0,
        timer: QUIZ_CONFIG.timePerQuestion
      });
      window.location.href = 'dashboard.html';
    } catch (error) {
      console.error('Error starting game:', error);
    }
  });
});
