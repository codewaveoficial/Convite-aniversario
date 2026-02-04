document.addEventListener('DOMContentLoaded', () => {

  /* ===== BOTÃO ABRIR CONVITE ===== */
  const openInviteBtn = document.getElementById('open-invite');

  if (openInviteBtn) {
    openInviteBtn.addEventListener('click', () => {
      window.location.href = 'convite.html';
    });
  }

  /* ===== ÁUDIO DO INDEX ===== */
  const audio = document.getElementById('heart-audio');
  const btnSound = document.getElementById('btn-heart');

  if (!audio || !btnSound) return;

  let isPlaying = false;
  let unlocked = false;

  audio.volume = 1;
  audio.muted = true; // 🔑 truque essencial

  /* ===== AUTOPLAY MUTED ===== */
  audio.play()
    .then(() => {
      isPlaying = true;
      btnSound.textContent = '🔈'; // ainda mutado
    })
    .catch(() => {
      // bloqueado — normal
    });

  /* ===== DESBLOQUEAR ÁUDIO NA PRIMEIRA INTERAÇÃO ===== */
  const unlockAudio = () => {
    if (unlocked) return;

    audio.muted = false;
    audio.play().catch(() => {});
    isPlaying = true;
    unlocked = true;

    btnSound.textContent = '🔇';
    btnSound.classList.add('active');

    document.removeEventListener('pointerdown', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
    document.removeEventListener('keydown', unlockAudio);
  };

  document.addEventListener('pointerdown', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);
  document.addEventListener('keydown', unlockAudio);

  /* ===== BOTÃO MANUAL ===== */
  btnSound.addEventListener('click', (e) => {
    e.stopPropagation();

    if (!isPlaying) {
      audio.muted = false;
      audio.play().catch(() => {});
      btnSound.textContent = '🔇';
      btnSound.classList.add('active');
    } else {
      audio.pause();
      btnSound.textContent = '🔈';
      btnSound.classList.remove('active');
    }

    isPlaying = !isPlaying;
  });

});
