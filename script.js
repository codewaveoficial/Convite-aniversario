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

  /* ===== TENTATIVA DE AUTOPLAY ===== */
  audio.volume = 0.6;

  audio.play()
    .then(() => {
      // autoplay permitido 🎉
      isPlaying = true;
      btnSound.textContent = '🔇';
      btnSound.classList.add('active');
    })
    .catch(() => {
      // autoplay bloqueado (normal em mobile)
      // botão fica visível aguardando interação
    });

  /* ===== PRIMEIRA INTERAÇÃO EM QUALQUER TOQUE ===== */
  const unlockAudio = () => {
    if (!isPlaying) {
      audio.play().catch(() => {});
      isPlaying = true;
      btnSound.textContent = '🔇';
      btnSound.classList.add('active');
    }

    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };

  document.addEventListener('click', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);

  /* ===== BOTÃO MANUAL ===== */
  btnSound.addEventListener('click', (e) => {
    e.stopPropagation();

    if (!isPlaying) {
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
