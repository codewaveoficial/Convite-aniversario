// script.js - comportamento simples para o convite
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('button');
  const root = document.documentElement; // usar html element para aplicar dark/invitation state
  const wrapper = document.querySelector('.relative.flex.h-screen');

  if (!btn) return;

  btn.addEventListener('click', function () {
    // navega para a página do convite verdadeira
    window.location.href = 'convite.html';
  });
});
