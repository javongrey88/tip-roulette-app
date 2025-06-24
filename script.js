let names = [];

function addName() {
  const nameInput = document.getElementById("nameInput");
  const name = nameInput.value.trim();
  if (name) {
    names.push(name);
    nameInput.value = "";
    updateNameList();
  }
}

function updateNameList() {
  const list = document.getElementById("nameList");
  list.innerHTML = "";
  names.forEach((name, index) => {
    const li = document.createElement("li");
    li.textContent = name;
    list.appendChild(li);
  });
}

function spin() {
  const bill = parseFloat(document.getElementById("billInput").value);
  const tipPercent = parseFloat(document.getElementById("tipInput").value);

  if (isNaN(bill) || isNaN(tipPercent) || names.length < 2) {
    alert("Please enter valid inputs and at least 2 names.");
    return;
  }

  const tipAmount = (bill * tipPercent) / 100;
  const winner = names[Math.floor(Math.random() * names.length)];

  document.getElementById("result").innerHTML = `
    🎉 <strong>${winner}</strong> pays the tip: $${tipAmount.toFixed(2)}
  `;
}
