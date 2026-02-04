// convite.js - controla botões e modais na página do convite
document.addEventListener('DOMContentLoaded', function () {
  const btnLocation = document.getElementById('btn-location');
  const btnChurrasco = document.getElementById('btn-churrasco');
  const btnPresentes = document.getElementById('btn-presentes');
  const modalChurrasco = document.getElementById('modal-churrasco');
  const modalPresentes = document.getElementById('modal-presentes');

  if (btnLocation) {
    btnLocation.addEventListener('click', function () {
      // abre o Google Maps com o endereço especificado
      const address = encodeURIComponent('Rua dos Bem-Te-Vis 440, Morada de Laranjeiras, Serra, ES, 29166-767');
      window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
    });
  }

  if (btnChurrasco) btnChurrasco.addEventListener('click', () => openModal(modalChurrasco));
  if (btnPresentes) btnPresentes.addEventListener('click', () => openModal(modalPresentes));

  // Modal management: open/close with focus trapping and background interaction block
  let _openModal = null;
  let _lastFocused = null;
  let _blockedElements = [];

  function openModal(modal) {
    if (!modal) return;
    if (_openModal) closeModal(_openModal);
    _openModal = modal;
    _lastFocused = document.activeElement;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    // prevent background scrolling
    document.body.style.overflow = 'hidden';

    // block interactions on all top-level body children that DO NOT contain the modal
    _blockedElements = Array.from(document.body.children).filter(ch => !ch.contains(modal));
    _blockedElements.forEach(el => {
      // store previous inline styles/attributes to restore later
      el.dataset._prevPointer = el.style.pointerEvents || '';
      el.dataset._prevAria = el.getAttribute('aria-hidden') || '';
      try { el.dataset._prevInert = el.inert ? '1' : '0'; } catch (e) { el.dataset._prevInert = '0'; }
      el.style.pointerEvents = 'none';
      el.setAttribute('aria-hidden', 'true');
      try { el.inert = true; } catch (e) { /* inert may not be supported */ }
    });

    // focus first focusable element inside modal (close button preferably)
    const focusable = getFocusable(modal);
    const toFocus = focusable.length ? focusable[0] : modal;
    toFocus.focus();

    // listeners for closing and trapping
    modal.addEventListener('click', onModalClick);
    document.addEventListener('keydown', onKeyDown);
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    modal.removeEventListener('click', onModalClick);
    document.removeEventListener('keydown', onKeyDown);
    // restore focus
    try { if (_lastFocused && _lastFocused.focus) _lastFocused.focus(); } catch (e) {}
    _openModal = null;
    _lastFocused = null;
    // restore previously blocked siblings
    if (_blockedElements && _blockedElements.length){
      _blockedElements.forEach(el => {
        try { el.style.pointerEvents = el.dataset._prevPointer || ''; } catch (e) {}
        try {
          const prev = el.dataset._prevAria;
          if (prev === '') el.removeAttribute('aria-hidden'); else el.setAttribute('aria-hidden', prev);
        } catch (e) {}
        try { el.inert = (el.dataset._prevInert === '1'); } catch (e) {}
        delete el.dataset._prevPointer; delete el.dataset._prevAria; delete el.dataset._prevInert;
      });
    }
    _blockedElements = [];
  }

  function onModalClick(e){
    // se clicou no overlay (fora do conteúdo), fecha
    if (e.target && e.target.classList && e.target.classList.contains('modal')){
      closeModal(e.target);
    }
  }

  function onKeyDown(e){
    if (! _openModal) return;
    // Esc fecha
    if (e.key === 'Escape'){
      closeModal(_openModal);
      return;
    }
    // Tab trapping
    if (e.key === 'Tab'){
      const focusable = getFocusable(_openModal);
      if (focusable.length === 0) { e.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length -1];
      if (e.shiftKey){
        if (document.activeElement === first){
          e.preventDefault(); last.focus();
        }
      } else {
        if (document.activeElement === last){
          e.preventDefault(); first.focus();
        }
      }
    }
  }

  function getFocusable(el){
    if (!el) return [];
    const nodes = Array.from(el.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'));
    return nodes.filter(n => n.offsetWidth > 0 || n.offsetHeight > 0 || n === document.activeElement);
  }

  // previous handlers removed; handled above for new buttons

  // delegação para fechar modais via botão — usa closeModal para gerenciar foco
  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-close')) {
      const modal = e.target.closest('.modal');
      if (modal) closeModal(modal);
    }
  });

  // ---------- Confetes dinâmicos (background) ----------
    (function createConfetti(){
      const container = document.querySelector('.bg-confetti');
      if (!container) return;
      const colors = ['#ff3b3b','#ec1313','#000000'];
      // gerar várias peças com variação (aumentado para garantir presença)
      const COUNT = 80;
      for(let i=0;i<COUNT;i++){
        const el = document.createElement('div');
        el.className = 'piece';
        // tamanhos variados
        const sizeW = 6 + Math.round(Math.random()*18);
        const sizeH = Math.round(sizeW*(1 + Math.random()*0.8));
        el.style.width = sizeW + 'px';
        el.style.height = sizeH + 'px';
        // posição horizontal aleatória
        el.style.left = Math.floor(Math.random()*100) + '%';
        // posição vertical inicial distribuída para garantir que algumas já estejam visíveis
        const startTop = -20 + Math.floor(Math.random()*90); // -20% .. 70%
        el.style.top = startTop + '%';
        // cor e opacidade
        el.style.background = colors[Math.floor(Math.random()*colors.length)];
        el.style.opacity = 0.9;
        // usar variável CSS para rotação inicial (compatível com keyframes)
        const angle = (Math.random()*360|0) + 'deg';
        el.style.setProperty('--r', angle);
        // duração/atraso
        el.style.animationDuration = (4 + Math.random()*6).toFixed(2) + 's';
        el.style.animationDelay = (Math.random()*2).toFixed(2) + 's';
        // inline z-index para forçar sobreposição dentro do mesmo stacking context
        el.style.zIndex = 21;
        container.appendChild(el);
      }
    })();

  // ---------- Áudio: mix crowd + hino do Flamengo com controle de volumes ----------
  function initAnthemAudio({
  audioId = 'anthem-audio',
  buttonId = 'btn-sound',
  volume = 0.7
} = {}) {
  const audio = document.getElementById(audioId);
  const btn = document.getElementById(buttonId);

  if (!audio || !btn) return;

  let isPlaying = false;
  audio.volume = volume;

  // botão começa escondido (só aparece se autoplay falhar)
  btn.classList.add('hidden');

  const setButton = (playing) => {
    btn.textContent = playing ? '🔊' : '🔈';
    btn.classList.toggle('active', playing);
  };

  /* ===== TENTATIVA DE AUTOPLAY ===== */
  audio.play()
    .then(() => {
      isPlaying = true;
      setButton(true);
    })
    .catch(() => {
      // autoplay bloqueado (mobile padrão)
      btn.classList.remove('hidden');
    });

  /* ===== PRIMEIRA INTERAÇÃO DESBLOQUEIA ===== */
  const unlockAudio = () => {
    if (!isPlaying) {
      audio.play().catch(() => {});
      isPlaying = true;
      setButton(true);
    }

    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
  };

  document.addEventListener('click', unlockAudio);
  document.addEventListener('touchstart', unlockAudio);

  /* ===== BOTÃO MANUAL ===== */
  btn.addEventListener('click', (e) => {
    e.stopPropagation();

    if (isPlaying) {
      audio.pause();
      setButton(false);
    } else {
      audio.play().catch(() => {});
      setButton(true);
    }

    isPlaying = !isPlaying;
  });
}

initAnthemAudio({
  audioId: 'anthem-audio',
  buttonId: 'btn-sound',
  volume: 0.7
});

  // ---------- Bola com física simples (rebate nas bordas) ----------
  (function ballPhysics(){
    const ball = document.querySelector('.bg-ball');
    const container = document.querySelector('.stadium-bg');
    if (!ball || !container) return;

    // posição relativa ao container
    const rect = container.getBoundingClientRect();
    let bw = 84, bh = 84;
    // tentar ler tamanho real
    const computed = window.getComputedStyle(ball);
    bw = parseInt(computed.width) || bw;
    bh = parseInt(computed.height) || bh;

    let x = -bw; // start off-screen left
    let y = rect.height * 0.7; // vertical aproximadamente
    // velocidade pixels/segundo — mantenha constante (sem variação)
    const BASE_VX = 220; // velocidade fixa horizontal (px/s)
    let vx = (Math.random()>0.5?1:-1) * BASE_VX;
    let vy = ( -20 + Math.random()*40 );

    let last = performance.now();

    function step(now){
      const dt = Math.min(0.04, (now - last)/1000);
      last = now;

      x += vx * dt;
      y += vy * dt;

      // bounds inside container
      const bounds = container.getBoundingClientRect();
      const minX = -bw*0.1;
      const maxX = bounds.width - bw*0.9;
      const minY = 12; // keep above top edge slightly
      const maxY = bounds.height - bh - 12;

      // bounce on X — maior variação de direção ao bater nas paredes laterais
      if (x < minX) {
        x = minX;
        // inverte direção horizontal e aplica um impulso vertical aleatório maior
        vx = Math.abs(BASE_VX);
        vy = (Math.random()*2 - 1) * BASE_VX * (0.6 + Math.random()*0.9);
      } else if (x > maxX) {
        x = maxX;
        vx = -Math.abs(BASE_VX);
        vy = (Math.random()*2 - 1) * BASE_VX * (0.6 + Math.random()*0.9);
      }

      // bounce on Y — ao bater em cima/baixo ajusta horizontal para variar a trajetória
      if (y < minY) {
        y = minY;
        vy = Math.abs(vy) * 0.9;
        // ligeira alteração horizontal com probabilidade
        vx = (Math.random()>0.5 ? 1 : -1) * BASE_VX * (0.85 + Math.random()*0.45);
      } else if (y > maxY) {
        y = maxY;
        vy = -Math.abs(vy) * 0.9;
        vx = (Math.random()>0.5 ? 1 : -1) * BASE_VX * (0.85 + Math.random()*0.45);
      }

      // se vertical ficar muito fraca, dá um pequeno impulso para evitar trajetória reta
      if (Math.abs(vy) < 12) {
        vy = (Math.random()*2 - 1) * 40;
      }

      // small vertical friction only (horizontal remains fixed magnitude)
      vy *= 0.995;

      // apply transform (position relative to container)
      ball.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px) rotate(${(x/2)%360}deg)`;

      requestAnimationFrame(step);
    }

    // ensure container resize updates bounds
    window.addEventListener('resize', ()=>{});
    requestAnimationFrame(step);
  })();
});
