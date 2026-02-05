document.addEventListener('DOMContentLoaded', () => {

  let experienceStarted = false; // ✅ FALTAVA ISSO

let ballX, ballY;
let velocityX = 2.2;
let velocityY = 1.8;
let animationId = null;

  /* ===== ELEMENTOS ===== */
  const openInviteBtn = document.getElementById('open-invite');
  const ball = document.getElementById('ball');
  const shield = document.getElementById('shield');
  const hintText = document.getElementById('hint-text');
  const audio = document.getElementById('heart-audio');
  const btnSound = document.getElementById('btn-heart');

  if (!audio || !btnSound || !ball || !openInviteBtn) return;

  let isPlaying = false;
  let unlocked = false;

  audio.volume = 1;
  audio.muted = true;

  /* ===== AUTOPLAY MUTED ===== */
  audio.play().then(() => {
    isPlaying = true;
    btnSound.textContent = '🔈';
  }).catch(() => {});

  /* ===== DESBLOQUEIO DE ÁUDIO ===== */
  const unlockAudio = () => {
    if (unlocked || !experienceStarted) return;

    audio.muted = false;
    audio.play().catch(() => {});
    unlocked = true;
    isPlaying = true;

    btnSound.textContent = '🔇';
    btnSound.classList.add('active');
  };

  /* ===== EXPERIÊNCIA PRINCIPAL ===== */
  function startExperience() {
  if (experienceStarted) return;
  experienceStarted = true;

// tornar bola visível
ball.style.opacity = '1';

// posição inicial visual (ex: abaixo do escudo)
const shieldRect = shield.getBoundingClientRect();
const ballSize = ball.offsetWidth;

ballX = shieldRect.left + (shieldRect.width / 2) - (ballSize / 2);
ballY = shieldRect.bottom + 20;

// aplicar posição inicial
ball.style.transform = `translate(${ballX}px, ${ballY}px)`;

  // liberar botão
  openInviteBtn.disabled = false;
  openInviteBtn.classList.remove(
    'opacity-50',
    'cursor-not-allowed',
    'bg-primary/40'
  );
  openInviteBtn.classList.add(
    'bg-primary',
    'cursor-pointer',
    'shadow-[0_0_20px_rgba(236,19,19,0.4)]'
  );

  // pulsar escudo
  shield.classList.add('pulsing');

  // esconder dica
  if (hintText) hintText.style.opacity = '0';

  // desbloquear áudio
  unlockAudio();

  // iniciar movimento global da bola
  startBallMovement();
}

  /* ===== CLIQUE NA BOLA ===== */
  ball.addEventListener('click', startExperience);


function startBallMovement() {
  const ballSize = ball.offsetWidth;

  function moveBall() {
    ballX += velocityX;
    ballY += velocityY;

    if (ballX <= 0 || ballX + ballSize >= window.innerWidth) {
      velocityX *= -1;
      ballX = Math.max(0, Math.min(ballX, window.innerWidth - ballSize));
    }

    if (ballY <= 0 || ballY + ballSize >= window.innerHeight) {
      velocityY *= -1;
      ballY = Math.max(0, Math.min(ballY, window.innerHeight - ballSize));
    }

    ball.style.transform = `translate(${ballX}px, ${ballY}px)`;
    animationId = requestAnimationFrame(moveBall);
  }

  moveBall();
}


  /* ===== BOTÃO ABRIR ===== */
  openInviteBtn.addEventListener('click', () => {
    if (!experienceStarted) return;
    window.location.href = 'convite.html';
  });

  /* ===== BOTÃO DE SOM ===== */
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
