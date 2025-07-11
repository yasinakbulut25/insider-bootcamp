// Countdown state variables
let countdownTimer;
let isRunning = false;
let currentTime = 10;
let totalTime = 10;
let messageTimeout;

// Get DOM elements
const timeInput = document.getElementById("timeInput");
const countdownElement = document.getElementById("countdown");
const startBtn = document.getElementById("startBtn");
const resetBtn = document.getElementById("resetBtn");
const statusMessage = document.getElementById("statusMessage");
const progressBar = document.getElementById("progressBar");
const progressCircle = document.getElementById("progressCircle");

// Show a temporary toast message
const showMessage = (message, type = "success") => {
  statusMessage.textContent = message;
  statusMessage.className = `status-message show ${type}`;

  clearTimeout(messageTimeout);

  messageTimeout = setTimeout(() => {
    statusMessage.classList.remove("show");
  }, 3000);
};

// Update countdown number and visual warning state
const updateDisplay = () => {
  countdownElement.textContent = currentTime;
  progressCircle.classList.remove("finished");

  const warning = currentTime <= 5 && currentTime > 0;
  countdownElement.classList.toggle("warning", warning);
  progressBar.classList.toggle("warning", warning);
};

// Trigger or reset circular progress animation
const updateProgress = () => {
  progressBar.classList.remove("animate");

  if (isRunning) {
    progressBar.style.setProperty("--duration", `${totalTime}s`);
    progressBar.classList.add("animate");
  }
};

// Enable or disable buttons and update start button text
const setButtonState = (disabled) => {
  startBtn.disabled = disabled;
  timeInput.disabled = disabled;
  startBtn.innerHTML = disabled
    ? "<i class='bi bi-hourglass-split'></i> Çalışıyor..."
    : "<i class='bi bi-play'></i> Başlat";
};

// Start the countdown timer
const startCountdown = () => {
  if (isRunning) return;

  const inputValue = parseInt(timeInput.value);
  if (isNaN(inputValue) || inputValue <= 0 || inputValue > 3600) {
    showMessage(
      "Lütfen 1 ile 3600 arasında geçerli bir süre girin!",
      "finished"
    );
    return;
  }

  currentTime = totalTime = inputValue;
  isRunning = true;

  setButtonState(true);
  updateDisplay();
  showMessage("Geri sayım başlatıldı!");
  updateProgress();

  countdownTimer = setInterval(() => {
    currentTime--;
    updateDisplay();

    if (currentTime <= 0) {
      clearInterval(countdownTimer);
      isRunning = false;
      setButtonState(false);

      countdownElement.classList.add("warning");
      progressBar.classList.remove("animate");
      progressCircle.classList.add("finished");

      showMessage("Geri sayım tamamlandı.", "finished");
    }
  }, 1000);
};

// Reset countdown to original state
const resetCountdown = () => {
  clearInterval(countdownTimer);
  isRunning = false;
  setButtonState(false);

  const inputValue = parseInt(timeInput.value) || 10;
  currentTime = totalTime = inputValue;

  updateDisplay();
  progressBar.classList.remove("warning", "animate");
  countdownElement.classList.remove("warning");

  showMessage("Geri sayım sıfırlandı!");
};

// Update value on input change
timeInput.addEventListener("input", () => {
  if (!isRunning) {
    const inputValue = parseInt(timeInput.value) || 0;
    if (inputValue > 0) {
      currentTime = totalTime = inputValue;
      updateDisplay();
      progressBar.classList.remove("animate");
    }
  }
});

// Set initial display
updateDisplay();

// Event listeners
startBtn.addEventListener("click", startCountdown);
resetBtn.addEventListener("click", resetCountdown);
