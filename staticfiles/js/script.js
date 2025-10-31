document.addEventListener("DOMContentLoaded", function () {
  console.log("Hello world");

  // Particle system
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
      this.color = ["#ff6b35", "#00ff88", "#9b59b6", "#fff"][
        Math.floor(Math.random() * 4)
      ];
      this.life = 100;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= 2;
      this.size *= 0.97;
    }

    draw() {
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.life / 100;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw();

      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(animateParticles);
  }

  animateParticles();

  // Audio control
  const audioToggle = document.getElementById("audioToggle");
  const bgAudio = document.getElementById("bgAudio");
  let audioPlaying = false;

  audioToggle.addEventListener("click", () => {
    if (audioPlaying) {
      bgAudio.pause();
      audioToggle.textContent = "🔇";
    } else {
      bgAudio.play();
      audioToggle.textContent = "🔊";
    }
    audioPlaying = !audioPlaying;
  });

  // Split text into chars
  function splitText(element) {
    const text = element.textContent;
    element.innerHTML = "";

    text.split(" ").forEach((word, wordIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "word";

      word.split("").forEach((char, charIndex) => {
        const charSpan = document.createElement("span");
        charSpan.className = "char";
        charSpan.textContent = char;
        charSpan.style.display = "inline-block";
        wordSpan.appendChild(charSpan);
      });

      element.appendChild(wordSpan);
      if (wordIndex < text.split(" ").length - 1) {
        element.appendChild(document.createTextNode(" "));
      }
    });
  }

  // Title explosion effect
  function explodeTitle() {
    const chars = document.querySelectorAll(".char");
    chars.forEach((char, i) => {
      const rect = char.getBoundingClientRect();

      // Create particles
      for (let j = 0; j < 5; j++) {
        particles.push(
          new Particle(rect.left + rect.width / 2, rect.top + rect.height / 2)
        );
      }
    });
  }

  // GSAP Animations
  window.addEventListener("load", () => {
    const title = document.getElementById("mainTitle");
    splitText(title);

    const chars = document.querySelectorAll(".char");
    const words = document.querySelectorAll(".word");

    // Set colors for words
    words[0].style.color = "#fff"; // TRICK
    words[1].style.color = "#ff6b35"; // OR
    words[2].style.color = "#00ff88"; // THREAT

    const tl = gsap.timeline();

    // Animate chars with split effect
    chars.forEach((char, i) => {
      gsap.set(char, {
        opacity: 0,
        y: -100,
        rotation: Math.random() * 360,
        scale: 0,
      });
    });

    tl.to(chars, {
      opacity: 1,
      y: 0,
      rotation: 0,
      scale: 1,
      duration: 1,
      stagger: {
        each: 0.05,
        from: "start",
      },
      ease: "elastic.out(1, 0.5)",
      onComplete: () => {
        // Add drip effects to some letters
        chars.forEach((char, i) => {
          if (Math.random() > 0.7) {
            const drip = document.createElement("div");
            drip.className = "drip";
            drip.style.animationDelay = Math.random() * 2 + "s";
            char.appendChild(drip);
          }
        });
      },
    });

    // Glow effect on THREAT
    gsap.to(words[2], {
      textShadow: "0 0 30px #00ff88, 0 0 50px #00ff88",
      duration: 1.5,
      yoyo: true,
      repeat: -1,
      ease: "power1.inOut",
    });

    // Card animations
    tl.to(
      "#mainCard",
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power2.out",
      },
      "-=0.5"
    );

    tl.to(
      "#badge",
      {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "back.out(2)",
      },
      "-=0.4"
    );

    tl.to(
      "#features",
      {
        opacity: 1,
        duration: 0.5,
      },
      "-=0.3"
    );

    const featureCards = document.querySelectorAll(".feature-card");
    tl.from(
      featureCards,
      {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      },
      "-=0.3"
    );

    // Set initial states
    gsap.set("#mainCard", { opacity: 0, y: 30 });
    gsap.set("#badge", { opacity: 0, scale: 0.8 });
    gsap.set("#features", { opacity: 0 });
  });

  // Title hover - explosion effect
  document
    .getElementById("titleContainer")
    .addEventListener("mouseenter", () => {
      explodeTitle();

      gsap.to(".char", {
        scale: 1.1,
        duration: 0.2,
        stagger: 0.02,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut",
      });
    });

  // Feature card interactions
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      gsap.to(this.querySelector(".feature-icon"), {
        scale: 1.3,
        rotation: 360,
        duration: 0.5,
        ease: "back.out(2)",
      });
    });

    card.addEventListener("mouseleave", function () {
      gsap.to(this.querySelector(".feature-icon"), {
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  });

  // Window resize
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Console easter egg
  console.log(
    "%c👻 PHANTOM PHISHERS 👻",
    "color: #ff6b35; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #ff6b35;"
  );
  console.log(
    "%cTeam 3 • Code Institute Halloween Hackathon 2025",
    "color: #00ff88; font-size: 14px; font-weight: bold;"
  );
  console.log(
    "%cHover over the title for a surprise 🎃",
    "color: #9b59b6; font-size: 12px;"
  );
});
