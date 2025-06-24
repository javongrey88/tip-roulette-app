// Load sounds
const spinSound = new Audio('assets/sounds/spin.wav');
const winSound = new Audio('assets/sounds/win.wav');

// Global variables
let names = [];
let startAngle = 0;
let arc = 0;
let spinTimeout = null;
let spinAngle = 0;
let ctx;

const canvas = document.getElementById("wheel");
if (canvas) {
  ctx = canvas.getContext("2d");
}

// Add name to list
function addName() {
  const nameInput = document.getElementById("nameInput");
  const name = nameInput.value.trim();
  if (name) {
    names.push(name);
    nameInput.value = "";
    updateNameList();
    drawWheel();
  }
}

// Display name list
function updateNameList() {
  const list = document.getElementById("nameList");
  list.innerHTML = "";
  names.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    list.appendChild(li);
  });
}

// Draw spinning wheel
function drawWheel() {
  if (!ctx || names.length < 2) return;

  const radius = canvas.width / 2;
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  arc = (2 * Math.PI) / names.length;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < names.length; i++) {
    const angle = startAngle + i * arc;
    ctx.fillStyle = `hsl(${(i * 360) / names.length}, 80%, 60%)`;

    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, angle, angle + arc, false);
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    // Draw name label
    ctx.save();
    ctx.fillStyle = "white";
    ctx.translate(centerX, centerY);
    ctx.rotate(angle + arc / 2);
    ctx.textAlign = "right";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(names[i], radius - 10, 0);
    ctx.restore();
  }
}

// Spin animation loop
function rotateWheel() {
  startAngle += spinAngle;
  drawWheel();
  spinAngle *= 0.97;

  if (spinAngle > 0.002) {
    spinTimeout = requestAnimationFrame(rotateWheel);
  } else {
    cancelAnimationFrame(spinTimeout);
    announceWinner();
  }
}

// Start spin
function spinWheel() {
  if (names.length < 2) {
    alert("Add at least two names.");
    return;
  }

  spinSound.currentTime = 0;
  spinSound.play();

  spinAngle = Math.random() * 0.4 + 0.3;
  rotateWheel();
}

// Announce winner and calculate tip
function announceWinner() {
  spinSound.pause();

  // Validate inputs
  const billInput = document.getElementById("billInput").value;
  const tipInput = document.getElementById("tipInput").value;

  if (!billInput || !tipInput || isNaN(billInput) || isNaN(tipInput)) {
    alert("Please enter a valid bill and tip percentage.");
    return;
  }

  const bill = parseFloat(billInput);
  const tipPercent = parseFloat(tipInput);
  const tipAmount = (bill * tipPercent) / 100;

  // Determine winner
  const degrees = (startAngle * 180) / Math.PI + 90;
  const arcDeg = 360 / names.length;
  const index = Math.floor(((360 - (degrees % 360)) % 360) / arcDeg);
  const winner = names[index];

  // Display result
  document.getElementById("result").innerHTML = `
    🎉 <strong>${winner}</strong> pays the tip: $${tipAmount.toFixed(2)}
  `;

  // Play win sound and confetti
  winSound.currentTime = 0;
  winSound.play();
  launchConfetti();
}

// Launch confetti scoped to canvas
function launchConfetti() {
  const wheelCanvas = document.getElementById('wheel');
  const scopedConfetti = confetti.create(wheelCanvas, { resize: true });

  scopedConfetti({
    particleCount: 150,
    spread: 80,
    origin: { y: 0.5 },
  });
}

// Theme toggle with persistence
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeButton(newTheme);
}

function updateThemeButton(theme) {
  const button = document.getElementById("themeToggle");
  button.textContent = theme === 'light' ? '🌞' : '🌙';
}

// Load saved theme
window.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeButton(savedTheme);
});



