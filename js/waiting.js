import { db, ref, onValue } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
  const status = document.getElementById('status');
  const playerCount = document.getElementById('playerCount');
  const playerName = localStorage.getItem('playerName');

  if (!playerName) {
    window.location.href = 'join.html';
    return;
  }

  status.textContent = `Hola ${playerName}`;

  const gameRef = ref(db, 'game');
  onValue(gameRef, (snapshot) => {
    const game = snapshot.val();
    if (game) {
      const players = game.players ? Object.keys(game.players).length : 0;
      playerCount.textContent = `${players} jugadores conectados`;

      if (game.status === 'playing') {
        window.location.href = 'quiz.html';
      }
    }
  });
});
