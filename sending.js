const statusText = document.getElementById("statusText");
const progressFill = document.getElementById("progressFill");
const card = document.querySelector(".card");

const messages = [
    "Initializing...",
    "Encrypting message...",
    "Connecting...",
    "Sending...",
    "Delivering...",
    "Almost there...",
    "Finalizing..."
];

// Random duration between 5s and 10s
const duration = Math.floor(Math.random() * 5000) + 5000;

const startTime = Date.now();

let currentMessage = 0;

statusText.textContent = messages[currentMessage];

const messageInterval = setInterval(() => {

    currentMessage++;

    if (currentMessage >= messages.length) {
        currentMessage = messages.length - 1;
    }

    statusText.textContent = messages[currentMessage];

}, 1000);

const progressInterval = setInterval(() => {

    const elapsed = Date.now() - startTime;

    const percentage = Math.min((elapsed / duration) * 100, 100);

    progressFill.style.width = percentage + "%";

    if (percentage >= 100) {

        clearInterval(progressInterval);
        clearInterval(messageInterval);

        statusText.textContent = "Delivered ✓";

        card.classList.add("fadeOut");

        setTimeout(() => {

            window.location.href = "success.html";

        }, 800);

    }

}, 50);