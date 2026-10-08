let towers = [[5, 4, 3, 2, 1], [], []];
let moves = 0;
let selectedFromTower = -1;
let selectedToTower = -1;
let moveHistory = [];

const MAX_DISK_WIDTH = 90; // percentage
const MIN_DISK_WIDTH = 30; // percentage
const DISK_COLORS = [
    'var(--disk-1)', 
    'var(--disk-2)', 
    'var(--disk-3)', 
    'var(--disk-4)', 
    'var(--disk-5)'
];

function startGame() {
  towers = [[5, 4, 3, 2, 1], [], []];
  moves = 0;
  selectedFromTower = -1;
  selectedToTower = -1;
  moveHistory = [];
  
  updateLabels();
  document.getElementById("moves").innerHTML = "Moves: <span>0</span>";
  document.getElementById("celebration").classList.add("hidden");
  
  drawTowers();
}

function resetSelections() {
  selectedFromTower = -1;
  selectedToTower = -1;
  updateLabels();
  drawTowers(); // To remove selected states visually
}

function updateLabels() {
  document.getElementById("from-tower-label").textContent = selectedFromTower !== -1 ? selectedFromTower + 1 : "-";
  document.getElementById("to-tower-label").textContent = selectedToTower !== -1 ? selectedToTower + 1 : "-";
  
  // Highlight active tower visually
  for(let i=0; i<3; i++) {
    const t = document.getElementById(`tower${i+1}`);
    if (i === selectedFromTower) {
        t.classList.add('selected-from');
    } else {
        t.classList.remove('selected-from');
    }
  }
}

function undoMove() {
  if (moveHistory.length > 0) {
    const lastMove = moveHistory.pop();
    // Directly move it back without rules checking
    const disk = towers[lastMove.to].pop();
    towers[lastMove.from].push(disk);
    
    moves--;
    document.getElementById("moves").innerHTML = `Moves: <span>${moves}</span>`;
    resetSelections();
    drawTowers();
  }
}

function move(from, to) {
  if (towers[from].length === 0) {
    return false; // from tower is empty
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
      let diskSize = towers[i][j];
      let diskElement = document.createElement("div");
      diskElement.className = "disk";
      
      // Calculate width instead of height
      let widthStep = (MAX_DISK_WIDTH - MIN_DISK_WIDTH) / 4; // 5 disks
      let diskWidth = MIN_DISK_WIDTH + ((diskSize - 1) * widthStep);
      
      diskElement.style.width = `${diskWidth}%`;
      diskElement.style.background = DISK_COLORS[diskSize - 1];
      
      // Add selected animation class if it's the top disk of the selectedFromTower
      if (i === selectedFromTower && j === towers[i].length - 1) {
          diskElement.classList.add("selected");
      }

      diskElement.textContent = diskSize; // Show number inside
      towerElement.appendChild(diskElement);
    }
  }
}

function selectTower(towerIndex) {
    if (selectedFromTower === -1) {
      if (towers[towerIndex].length === 0) return; // Can't select empty tower
      
      selectedFromTower = towerIndex;
      updateLabels();
      drawTowers(); // re-draw to show selection animation
      
    } else if (selectedToTower === -1) {
      // Clicking the same tower deselects it
      if (selectedFromTower === towerIndex) {
          resetSelections();
          return;
      }
      
      selectedToTower = towerIndex;
      updateLabels();

      if (!move(selectedFromTower, selectedToTower)) {
        // We will just do a visual shake or simple console log, alerts are jarring
        // For now, reset selection smoothly
        resetSelections();
      } else {
        moves++;
        document.getElementById("moves").innerHTML = `Moves: <span>${moves}</span>`;
        moveHistory.push({ from: selectedFromTower, to: selectedToTower });
        
        resetSelections();
        drawTowers();
  
        if (towers[2].length === 5) {
          celebrateWin();
        }
      }
    }
}

function fireConfetti() {
    var duration = 3 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 10000 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function() {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      
      // since particles fall down, start a bit higher than random
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

function celebrateWin() {
  const celebration = document.getElementById("celebration");
  celebration.classList.remove("hidden");
  
  // Fire the canvas confetti
  if(typeof confetti === 'function') {
      fireConfetti();
  }
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

// Initialize
startGame();
