const gameScreen = document.getElementById("gameScreen");
const balance = document.getElementById("balance");
const betAmount = document.getElementById("betAmount");
const winnings = document.getElementById("winnings");
const numberOfMines = document.getElementById("mines");

createTiles();
const tiles = document.querySelectorAll(".minesCard");

let isPlaying = false;
let tilesWithMines = [];
let totalSafeTiles = 0;
let revealedSafeTiles = 0;
let currentMultiplier = Number(mines.value) * 0.25;
let currentWinnings = 0;
let bombed = false;

function gameOverReset() {
  if (!bombed) balance.value = Number(balance.value) + Number(currentWinnings);
  winnings.value = 0;

  isPlaying = false;
  tilesWithMines = [];
  revealedSafeTiles = 0;
  totalSafeTiles = 0;
  currentMultiplier = Number(mines.value) * 0.25;
  currentWinnings = 0;
  bombed = false;

  betAmount.disabled = false;
  mines.disabled = false;
}

function createTiles() {
  gameScreen.innerHTML = Array(25)
    .fill('<div class="minesCard"></div>')
    .join("");
}

function startGame() {
  if (isPlaying) return;
  isPlaying = true;

  tiles.forEach((tile) => {
    tile.style.transform = "rotateY(0deg)";
    tile.innerText = "";
  });

  const bet = Number(betAmount.value);
  const bal = Number(balance.value);
  const mineCount = Number(numberOfMines.value);

  if (bet > bal) {
    alert("Not enough balance!");
    isPlaying = false;
    return;
  }

  // Deduct balance
  betAmount.disabled = true;
  mines.disabled = true;
  balance.value = bal - bet;

  // Generate mines
  tilesWithMines = [];
  while (tilesWithMines.length < mineCount) {
    let randomIndex = Math.floor(Math.random() * 25);
    if (!tilesWithMines.includes(randomIndex)) tilesWithMines.push(randomIndex);
  }

  totalSafeTiles = 25 - tilesWithMines.length;

  // cheat var
  let safeTiles = [];

  tiles.forEach((tile, index) => {
    tile.style.backgroundColor = "#333333";
    if (!tilesWithMines.includes(index)) {
      safeTiles.push(index);
    }
    tile.addEventListener("click", () => clickTile(tile, index));
  });

  // cheat
  // console.log(tilesWithMines.map((mine) => mine + 1).sort((a, b) => a - b));
  console.log(safeTiles.map((mine) => mine + 1).sort((a, b) => a - b));
}

function clickTile(tile, index) {
  if (!isPlaying) return;

  const bet = Number(betAmount.value);

  tile.style.transform = "rotateY(180deg)";

  if (tilesWithMines.includes(index)) {
    tile.style.backgroundColor = "red";
    tile.innerText = "💣";
    revealMines(tile, index);
    setTimeout("", 200);
    bombed = true;
    gameOverReset();
  } else {
    tile.style.backgroundColor = "green";
    tile.innerText = "💎";
    revealedSafeTiles++;
    currentMultiplier *= 1.25; // increase multiplier

    currentWinnings = Math.floor(bet * currentMultiplier);
    winnings.value = currentWinnings;
  }
}

function revealMines() {
  tiles.forEach((tile, index) => {
    if (tilesWithMines.includes(index)) {
      tile.style.transform = "rotateY(180deg)";
      tile.style.backgroundColor = "red";
      tile.innerText = "💣";
    }
  });
}

function cashOut() {
  if (currentWinnings > 0) {
    revealMines();
    gameOverReset();
  }
}

// error handling
mines.addEventListener("input", () => {
  if (mines.value > 24) {
    mines.value = 24;
  }
});

betAmount.addEventListener("input", () => {
  if (Number(betAmount.value) > Number(balance.value)) {
    betAmount.value = balance.value;
  } else if (Number(betAmount.value) < 10) {
    const playBtn = document.getElementById("placeBet");
    playBtn.disabled = true;
  }
});
