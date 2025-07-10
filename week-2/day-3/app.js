let countdownTimer;
let isRunning = false;
let currentTime = 10;

const timeInput = document.getElementById("timeInput");
const countdownElement = document.getElementById("countdown");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const statusMessage = document.getElementById("statusMessage");

function showMessage(message, type = "success") {
  statusMessage.textContent = message;
  statusMessage.className = `status-message show ${type}`;

  setTimeout(() => {
    statusMessage.classList.remove("show");
  }, 3000);
}

function updateDisplay() {
  countdownElement.textContent = currentTime;

  if (currentTime <= 5 && currentTime > 0) {
    countdownElement.classList.add("warning");
  } else {
    countdownElement.classList.remove("warning");
  }
}

function startCountdown() {
  if (isRunning) return;

  const inputValue = parseInt(timeInput.value);
  if (isNaN(inputValue) || inputValue <= 0) {
    showMessage("Lütfen geçerli bir süre girin!", "finished");
    return;
  }

  currentTime = inputValue;
  isRunning = true;
  startBtn.disabled = true;
  startBtn.textContent = "Çalışıyor...";
  timeInput.disabled = true;

  showMessage("Geri sayım başlatıldı!");
  updateDisplay();

  countdownTimer = setInterval(() => {
    currentTime--;
    updateDisplay();

    if (currentTime <= 0) {
      clearInterval(countdownTimer);
      isRunning = false;
      startBtn.disabled = false;
      startBtn.textContent = "Başlat";
      timeInput.disabled = false;

      countdownElement.textContent = "Süre Doldu!";
      countdownElement.classList.add("warning");
      showMessage("Süre doldu! Geri sayım tamamlandı.", "finished");
    }
  }, 1000);
}

function resetCountdown() {
  clearInterval(countdownTimer);
  isRunning = false;
  startBtn.disabled = false;
  startBtn.textContent = "Başlat";
  timeInput.disabled = false;

  const inputValue = parseInt(timeInput.value) || 10;
  currentTime = inputValue;

  updateDisplay();
  countdownElement.classList.remove("warning");
  showMessage("Geri sayım sıfırlandı!");
}

// Event listeners
startBtn.addEventListener("click", startCountdown);
resetBtn.addEventListener("click", resetCountdown);

timeInput.addEventListener("input", () => {
  if (!isRunning) {
    const inputValue = parseInt(timeInput.value) || 0;
    if (inputValue > 0) {
      currentTime = inputValue;
      updateDisplay();
    }
  }
});

// Initialize
updateDisplay();
