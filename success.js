const countdown = document.getElementById("countdown");

let timeLeft = 5;

const timer = setInterval(() => {

    timeLeft--;

    countdown.textContent = timeLeft;

    if (timeLeft <= 0) {

        clearInterval(timer);

        document.body.style.opacity = "0";

        document.body.style.transition = "opacity 0.8s ease";

        setTimeout(() => {

            window.location.href = "index.html";

        }, 800);

    }

}, 1000);