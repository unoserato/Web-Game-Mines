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
let baseMultiplier = 0;
let currentMultiplier = 0;
let currentWinnings = 0;
let bombed = false;
let bal, bet = 0;
function gameOverReset() {
  if (!bombed) balance.value = Number(balance.value) + Number(currentWinnings);
  winnings.value = 0;

  isPlaying = false;
  tilesWithMines = [];
  revealedSafeTiles = 0;
  totalSafeTiles = 0;
  baseMultiplier = Number(numberOfMines.value) * 0.25;
  currentMultiplier = baseMultiplier; // this is the line that fixed the multiplier reset
  currentWinnings = 0;
  bombed = false;

  betAmount.disabled = false;
  numberOfMines.disabled = false;
}

function createTiles() {
  gameScreen.innerHTML = Array(25)
    .fill('<div class="minesCard"></div>')
    .join("");
}

function startGame() {
  if (isPlaying) return;
  isPlaying = true;

  // Reset tiles
  tiles.forEach((tile) => {
    tile.style.transform = "rotateY(0deg)";
    tile.innerText = "";
    tile.style.backgroundColor = "#333333";
  });

  
  bet = Number(betAmount.value);
  bal = Number(balance.value);
  const mineCount = Number(numberOfMines.value);
  currentMultiplier = mineCount * 0.25;
  
  if (bet > bal) {
    alert("Not enough balance!");
    isPlaying = false;
    return;
  }

  // Deduct balance
  betAmount.disabled = true;
  numberOfMines.disabled = true;
  balance.value = bal - bet;

  // Generate mines
  tilesWithMines = [];
  while (tilesWithMines.length < mineCount) {
    let randomIndex = Math.floor(Math.random() * 25);
    if (!tilesWithMines.includes(randomIndex)) tilesWithMines.push(randomIndex);
  }

  totalSafeTiles = 25 - tilesWithMines.length;
  revealedSafeTiles = 0;

  // Reset multipliers
  baseMultiplier = mineCount * 0.25;
  currentMultiplier = baseMultiplier;
  currentWinnings = 0;
  winnings.value = currentWinnings;

  // Add click events
  tiles.forEach((tile, index) => {
    tile.removeEventListener("click", tile._clickHandler); // remove old handler
    tile._clickHandler = () => clickTile(tile, index); // store handler reference
    tile.addEventListener("click", tile._clickHandler);
  });

  // cheat: show safe tiles in console
  let safeTiles = [];
  tiles.forEach((tile, index) => {
    if (!tilesWithMines.includes(index)) safeTiles.push(index);
  });
  console.log(safeTiles.map((i) => i + 1).sort((a, b) => a - b));
}

function clickTile(tile, index) {
  if (!isPlaying) return;

  tile.style.transform = "rotateY(180deg)";

  if (tilesWithMines.includes(index)) {
    tile.style.backgroundColor = "red";
    tile.innerText = "💣";
    revealMines(tile, index);
    bombed = true;
    gameOverReset();
  } else {
    tile.disabled = true;
    tile.style.backgroundColor = "green";
    tile.innerText = "💎";
    revealedSafeTiles++;

    currentMultiplier = baseMultiplier * revealedSafeTiles * 0.75; // recalc multiplier
    currentWinnings = Math.floor(bet * currentMultiplier);
    winnings.value = currentWinnings;

    if (revealedSafeTiles === totalSafeTiles) {
      revealMines();
      gameOverReset();
    }
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
numberOfMines.addEventListener("input", () => {
  if (numberOfMines.value > 24) numberOfMines.value = 24;
});

//betAmount.addEventListener("input", () => {
//  if (Number(betAmount.value) > Number(balance.value)) {
//    betAmount.value = balance.value;
//  } 
//});
