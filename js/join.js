import { db, ref, set, get } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
  const nameInput = document.getElementById('nameInput');
  const joinBtn = document.getElementById('joinBtn');

  nameInput.addEventListener('input', () => {
    joinBtn.disabled = nameInput.value.trim().length === 0;
  });

  joinBtn.addEventListener('click', async () => {
    const name = nameInput.value.trim();
    if (name) {
      joinBtn.disabled = true;
      joinBtn.textContent = 'Conectando...';

      try {
        const playerRef = ref(db, `game/players/${name}`);
        await set(playerRef, true);

        localStorage.setItem('playerName', name);
        window.location.href = 'waiting.html';
      } catch (error) {
        console.error('Error joining:', error);
        joinBtn.disabled = false;
        joinBtn.textContent = 'Unirse';
      }
    }
  });

  nameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && nameInput.value.trim().length > 0) {
      joinBtn.click();
    }
  });
});
