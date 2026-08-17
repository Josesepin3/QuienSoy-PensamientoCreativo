import { db, ref, onValue, onDisconnect } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
  const playerNameEl = document.getElementById('playerName');
  const playerName = localStorage.getItem('playerName');

  if (!playerName) {
    window.location.href = 'join.html';
    return;
  }

  playerNameEl.textContent = playerName;

  const playerRef = ref(db, `game/players/${playerName}`);
  onDisconnect(playerRef).remove();

  const gameRef = ref(db, 'game/status');
  onValue(gameRef, (snapshot) => {
    const status = snapshot.val();
    if (status === 'playing') {
      window.location.href = 'quiz.html';
    }
  });
});
