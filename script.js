let towers = [[5, 4, 3, 2, 1], [], []];
let moves = 0;
let selectedFromTower = -1;
let selectedToTower = -1;
let moveHistory = [];
let towerSelectionInProgress = false; 

function startGame() {
  towers = [[5, 4, 3, 2, 1], [], []];
  moves = 0;
  selectedFromTower = -1;
  selectedToTower = -1;
  document.getElementById("from-tower-label").textContent = "-";
  document.getElementById("to-tower-label").textContent = "-";
  drawTowers();
  document.getElementById("moves").textContent = "Moves: 0";
  moveHistory = [];
  towerSelectionInProgress = false;
}

function resetSelections() {
  selectedFromTower = -1;
  selectedToTower = -1;
  document.getElementById("from-tower-label").textContent = "-";
  document.getElementById("to-tower-label").textContent = "-";
}

function moveDisk() {
  if (selectedFromTower !== -1 && selectedToTower !== -1) {
    if (move(selectedFromTower, selectedToTower)) {
      moves++;
      drawTowers();
      document.getElementById("moves").textContent = `Moves: ${moves}`;
      moveHistory.push({ from: selectedFromTower, to: selectedToTower });
      resetSelections();
      if (towers[2].length === 5) {
        celebrateWin();
      }
    } else {
      alert("Invalid move. Follow the rules of Tower of Hanoi.");
      resetSelections();
    }
  } else {
    alert('Select both "From Tower" and "To Tower" before moving the disk.');
  }
}

function undoMove() {
  if (moveHistory.length > 0) {
    const lastMove = moveHistory.pop();
    move(lastMove.to, lastMove.from);
    moves--;
    drawTowers();
    document.getElementById("moves").textContent = `Moves: ${moves}`;
  }
}

function move(from, to) {
  if (towers[from].length === 0) {
    return false;
  }

  if (
    towers[to].length === 0 ||
    towers[from][towers[from].length - 1] < towers[to][towers[to].length - 1]
  ) {
    towers[to].push(towers[from].pop());
    return true;
  }

  return false;
}

function drawTowers() {
  for (let i = 0; i < 3; i++) {
    let towerElement = document.getElementById(`tower${i + 1}`);
    towerElement.innerHTML = "";
    for (let j = 0; j < towers[i].length; j++) {
      let diskElement = document.createElement("div");
      diskElement.className = "disk";
      diskElement.style.height = `${towers[i][j] * 30}px`;
      towerElement.appendChild(diskElement);

      let barName = document.createElement("div");
      barName.className = "bar-name";
      barName.textContent = `Bar ${towers[i][j]}`;
      diskElement.appendChild(barName);
    }
  }
}

function selectTower(towerIndex) {
    if (selectedFromTower === -1) {
      selectedFromTower = towerIndex;
      document.getElementById("from-tower-label").textContent = towerIndex + 1;
    } else if (selectedToTower === -1) {
      selectedToTower = towerIndex;
      document.getElementById("to-tower-label").textContent = towerIndex + 1;

      if (!move(selectedFromTower, selectedToTower)) {
        alert("Invalid move. Follow the rules of Tower of Hanoi.");
        resetSelections();
      } else {

        moves++;
        drawTowers();
        document.getElementById("moves").textContent = `Moves: ${moves}`;
        moveHistory.push({ from: selectedFromTower, to: selectedToTower });
        resetSelections();
  

        if (towers[2].length === 5) {
          celebrateWin();
        }
      }
    }
  }
  

startGame();

function celebrateWin() {
  const celebration = document.getElementById("celebration");
  celebration.classList.remove("hidden");
  setTimeout(() => {
    celebration.classList.add("hidden");
  }, 8000);
  alert("Hey !! Congratulations ... You won the game");
}

function showInstructions() {
  const instructionsModal = document.getElementById("instructions-modal");
  instructionsModal.style.display = "block";
}

function closeInstructionsModal() {
  const instructionsModal = document.getElementById("instructions-modal");
  instructionsModal.style.display = "none";
}

window.onclick = function (event) {
  const instructionsModal = document.getElementById("instructions-modal");
  if (event.target === instructionsModal) {
    instructionsModal.style.display = "none";
  }
};

document.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    moveDisk();
  }
});


