document.addEventListener('DOMContentLoaded', () => {
  renderRankingList('rankingListLogin');
});

const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const rankingList = document.getElementById('rankingList');
const timerDisplay = document.getElementById('timer');

let lastHole;
let timeUp = false;
let score = 0;
let countdown;

function renderRankingList(targetId) {
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  const list = document.getElementById(targetId);
  if (!list) return;
  list.innerHTML = '';
  ranking.forEach(player => {
    const li = document.createElement('li');
    li.textContent = `${player.nome}: ${player.score} pontos`;
    list.appendChild(li);
  });
}

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) return randomHole(holes);
  lastHole = hole;
  return hole;
}

function peep() {
  const time = randomTime(700, 1000);
  const hole = randomHole(holes);
  hole.classList.add('up');
  setTimeout(() => {
    hole.classList.remove('up');
    if (!timeUp) peep();
  }, time);
}

function startGame() {
  scoreBoard.textContent = "0";
  timerDisplay.textContent = "15";
  score = 0;
  timeUp = false;
  peep();
  let timeLeft = 10;
  countdown = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(countdown);
      timeUp = true;
      saveScore();
      showPopup();
    }
  }, 1000);
}

function bonk(e) {
  if (!e.isTrusted) return;
  score++;
  this.parentNode.classList.remove('up');
  scoreBoard.textContent = score;
}

function saveScore() {
  const nome = localStorage.getItem('userNome') || 'Jogador';
  const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
  ranking.push({ nome, score });
  ranking.sort((a, b) => b.score - a.score);
  localStorage.setItem('ranking', JSON.stringify(ranking.slice(0, 5)));
  renderRankingList('rankingList');
  renderRankingList('rankingListLogin');
}

moles.forEach(mole => mole.addEventListener('click', bonk));

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const email = document.getElementById('email').value.trim();
  const nome = document.getElementById('nome').value.trim();
  const password = document.getElementById('password').value.trim();

  if (email && nome && password) {
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userNome', nome);
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    renderRankingList('rankingList');
  } else {
    alert('Preencha todos os campos!');
  }
});

function showPopup() {
  const nome = localStorage.getItem('userNome') || 'Jogador';
  const popup = document.getElementById('popup');
  const message = document.getElementById('popupMessage');
  message.textContent = `${nome}, você fez ${score} pontos!`;
  popup.style.display = 'flex';
}

function restartGame() {
  document.getElementById('popup').style.display = 'none';
  startGame();
}

function exitGame() {
  document.getElementById('popup').style.display = 'none';
  document.getElementById('gameScreen').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'block';
}
