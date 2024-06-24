document.addEventListener("DOMContentLoaded", function () {
  const cake = document.querySelector(".cake");
  const candleCountDisplay = document.getElementById("candleCount");
  const container = document.querySelector(".container"); // Select the container element
  let candles = [];
  let audioContext;
  let analyser;
  let microphone;
  let audio = new Audio('hbd.mp3');
  let currentAudio = audio; // Track the current playing audio

  function updateCandleCount() {
    const activeCandles = candles.filter(
      (candle) => !candle.classList.contains("out")
    ).length;
    candleCountDisplay.textContent = activeCandles;
  }

  function addCandle(left, top) {
    const candle = document.createElement("div");
    candle.className = "candle";
    candle.style.left = left + "px";
    candle.style.top = top + "px";

    const flame = document.createElement("div");
    flame.className = "flame";
    candle.appendChild(flame);

    cake.appendChild(candle);
    candles.push(candle);
    updateCandleCount();
  }

  // Add default candles
  addCandle(60, 20);
  addCandle(120, 20);
  addCandle(180, 20);

  cake.addEventListener("click", function (event) {
    const rect = cake.getBoundingClientRect();
    const left = event.clientX - rect.left;
    const top = event.clientY - rect.top;
    addCandle(left, top);
  });

  function isBlowing() {
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < bufferLength; i++) {
      sum += dataArray[i];
    }
    let average = sum / bufferLength;

    return average > 50; // Adjust this threshold as needed
  }

  function blowOutCandles() {
    let blownOut = 0;

    if (candles.length > 0 && candles.some((candle) => !candle.classList.contains("out"))) {
      if (isBlowing()) {
        candles.forEach((candle) => {
          if (!candle.classList.contains("out") && Math.random() > 0.5) {
            candle.classList.add("out");
            blownOut++;
          }
        });
      }

      if (blownOut > 0) {
        updateCandleCount();
      }

      if (candles.every((candle) => candle.classList.contains("out"))) {
        setTimeout(function() {
          triggerConfetti();
          endlessConfetti();
          showContainer(); // Show container when all candles are blown out
        }, 200);
        audio.play();
      }
    }

    requestAnimationFrame(blowOutCandles);
  }

  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        microphone.connect(analyser);
        analyser.fftSize = 256;
        requestAnimationFrame(blowOutCandles);
      })
      .catch(function (err) {
        console.log("Unable to access microphone: " + err);
        alert("Microphone access is required to blow out the candles!");
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
    alert("Microphone access is not supported on your browser!");
  }

  // Typewriter effect
  const birthdayAgeElement = document.querySelector(".birthdayAge");
  const birthdayText = birthdayAgeElement.textContent;
  birthdayAgeElement.innerHTML = "";
  const typewriterElement = document.createElement("span");
  typewriterElement.className = "typewriter";
  birthdayAgeElement.appendChild(typewriterElement);
  let charIndex = 0;

  function type() {
    if (charIndex < birthdayText.length) {
      typewriterElement.textContent += birthdayText.charAt(charIndex);
      charIndex++;
      setTimeout(type, 100); // Adjust typing speed here
    }
  }

  type();

  function showContainer() {
    container.style.display = "block"; // Show the container
  }

  // Function to stop current audio and play new audio
  function playNewAudio(newAudio) {
    currentAudio.pause(); // Pause current audio
    currentAudio.currentTime = 0; // Reset current audio time to start
    currentAudio = newAudio; // Set new audio as current audio
    currentAudio.play(); // Play new audio
  }

  // Event listeners for cream buttons
  document.querySelector(".cream-button-1").addEventListener("click", function () {
    playNewAudio(new Audio('Jessica.mp3'));
  });

  document.querySelector(".cream-button-2").addEventListener("click", function () {
    currentAudio.pause(); // Pause current audio
    currentAudio.currentTime = 0; // Reset current audio time to start
    playNewAudio(new Audio('Eroll.mp3'));
  });

  document.querySelector(".cream-button-3").addEventListener("click", function () {
    currentAudio.pause(); // Pause current audio
    currentAudio.currentTime = 0; // Reset current audio time to start
    playNewAudio(new Audio('Ghie.mp3'));
  });

});

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 }
  });
}

function endlessConfetti() {
  setInterval(function() {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0 }
    });
  }, 1000);
}
