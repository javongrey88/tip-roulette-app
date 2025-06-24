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

function updateNameList() {
  const list = document.getElementById("nameList");
  list.innerHTML = "";
  names.forEach((name) => {
    const li = document.createElement("li");
    li.textContent = name;
    list.appendChild(li);
  });
}

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

    // Text
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

function spinWheel() {
  if (names.length < 2) {
    alert("Add at least two names.");
    return;
  }

  spinAngle = Math.random() * 0.4 + 0.3; // Initial speed
  rotateWheel();
}

function announceWinner() {
  const degrees = (startAngle * 180) / Math.PI + 90;
  const arcDeg = 360 / names.length;
  const index = Math.floor(((360 - (degrees % 360)) % 360) / arcDeg);
  const winner = names[index];

  const bill = parseFloat(document.getElementById("billInput").value);
  const tipPercent = parseFloat(document.getElementById("tipInput").value);
  const tipAmount = (bill * tipPercent) / 100;

  document.getElementById("result").innerHTML = `
    🎉 <strong>${winner}</strong> pays the tip: $${tipAmount.toFixed(2)}
  `;
}

