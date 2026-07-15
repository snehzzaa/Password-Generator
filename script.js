const passwordField = document.getElementById("password");
const copyButton = document.getElementById("copy-btn");
const generateButton = document.getElementById("generate-btn");
const lengthInput = document.getElementById("length");
const lengthValue = document.getElementById("length-value");
const uppercaseInput = document.getElementById("uppercase");
const lowercaseInput = document.getElementById("lowercase");
const numbersInput = document.getElementById("numbers");
const symbolsInput = document.getElementById("symbols");
const strengthFill = document.getElementById("strength-fill");
const strengthText = document.getElementById("strength-text");
const statusText = document.getElementById("status");

const characterSets = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?/"
};

function getSelectedSets() {
  const sets = [];

  if (uppercaseInput.checked) {
    sets.push(characterSets.uppercase);
  }

  if (lowercaseInput.checked) {
    sets.push(characterSets.lowercase);
  }

  if (numbersInput.checked) {
    sets.push(characterSets.numbers);
  }

  if (symbolsInput.checked) {
    sets.push(characterSets.symbols);
  }

  return sets;
}

function getRandomCharacter(characters) {
  const randomIndex = Math.floor(Math.random() * characters.length);
  return characters[randomIndex];
}

function shuffleCharacters(characters) {
  for (let index = characters.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [characters[index], characters[swapIndex]] = [characters[swapIndex], characters[index]];
  }

  return characters;
}

function generatePassword() {
  const length = Number(lengthInput.value);
  const selectedSets = getSelectedSets();

  if (selectedSets.length === 0) {
    lowercaseInput.checked = true;
    selectedSets.push(characterSets.lowercase);
  }

  const allCharacters = selectedSets.join("");
  const passwordCharacters = [];

  selectedSets.forEach((set) => {
    passwordCharacters.push(getRandomCharacter(set));
  });

  while (passwordCharacters.length < length) {
    passwordCharacters.push(getRandomCharacter(allCharacters));
  }

  const password = shuffleCharacters(passwordCharacters)
    .slice(0, length)
    .join("");

  passwordField.value = password;
  updateStrength(password, selectedSets.length);
  statusText.textContent = "";
}

function updateStrength(password, selectedSetCount) {
  const lengthScore = Math.min(password.length / 32, 1);
  const varietyScore = selectedSetCount / 4;
  const score = (lengthScore * 0.65) + (varietyScore * 0.35);

  let label = "Weak";
  let width = 25;
  let color = "var(--bad)";

  if (score >= 0.75) {
    label = "Strong";
    width = 100;
    color = "var(--accent)";
  } else if (score >= 0.45) {
    label = "Moderate";
    width = 65;
    color = "var(--warn)";
  } else if (score >= 0.2) {
    label = "Fair";
    width = 40;
    color = "#ff9f43";
  }

  strengthFill.style.width = `${width}%`;
  strengthFill.style.background = `linear-gradient(90deg, ${color}, var(--accent))`;
  strengthText.textContent = label;
}

async function copyPassword() {
  if (!passwordField.value) {
    return;
  }

  try {
    await navigator.clipboard.writeText(passwordField.value);
    copyButton.textContent = "Copied";
    copyButton.classList.add("copied");
    statusText.textContent = "Password copied to clipboard.";

    window.setTimeout(() => {
      copyButton.textContent = "Copy";
      copyButton.classList.remove("copied");
    }, 1600);
  } catch {
    passwordField.select();
    document.execCommand("copy");
    copyButton.textContent = "Copied";
    copyButton.classList.add("copied");
    statusText.textContent = "Password copied to clipboard.";

    window.setTimeout(() => {
      copyButton.textContent = "Copy";
      copyButton.classList.remove("copied");
    }, 1600);
  }
}

function syncLengthValue() {
  lengthValue.textContent = lengthInput.value;
}

lengthInput.addEventListener("input", () => {
  syncLengthValue();
});

generateButton.addEventListener("click", generatePassword);
copyButton.addEventListener("click", copyPassword);

[uppercaseInput, lowercaseInput, numbersInput, symbolsInput].forEach((input) => {
  input.addEventListener("change", generatePassword);
});

syncLengthValue();
generatePassword();
