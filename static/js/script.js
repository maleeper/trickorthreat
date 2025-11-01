// ============================================
// 🎃 SPOOKY NAVBAR ANIMATIONS
// ============================================

document.addEventListener("DOMContentLoaded", function () {
    const nav = document.getElementById('mainNav');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // ============================================
    // NAVBAR SCROLL EFFECT
    // ============================================
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // ============================================
    // MOBILE MENU TOGGLE WITH GSAP
    // ============================================
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');

            // GSAP Timeline for menu animation
            if (navMenu.classList.contains('active')) {
                const tl = gsap.timeline();
                
                tl.to(navMenu, {
                    duration: 0.4,
                    ease: "power2.out"
                });

                // Stagger animate menu items
                tl.from('.nav-item', {
                    x: 50,
                    opacity: 0,
                    duration: 0.3,
                    stagger: 0.1,
                    ease: "back.out(1.7)"
                }, "-=0.2");
            }
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                gsap.to(window, {
                    duration: 1,
                    scrollTo: {
                        y: target,
                        offsetY: 80 // Account for fixed navbar
                    },
                    ease: "power2.inOut"
                });
            }
        });
    });

    // ============================================
    // NAVBAR LOAD ANIMATION
    // ============================================
    const navLoadTL = gsap.timeline();

    navLoadTL.from('.nav-logo', {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    })
    .from('.nav-item', {
        y: -30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: "back.out(1.5)"
    }, "-=0.4")
    .from('.nav-neon-line', {
        scaleX: 0,
        duration: 1,
        ease: "power2.inOut"
    }, "-=0.5");

    // ============================================
    // LOGO HOVER EFFECT
    // ============================================
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        logo.addEventListener('mouseenter', () => {
            gsap.to('.logo-icon', {
                scale: 1.2,
                rotation: 15,
                duration: 0.3,
                ease: "back.out(2)"
            });
        });

        logo.addEventListener('mouseleave', () => {
            gsap.to('.logo-icon', {
                scale: 1,
                rotation: 0,
                duration: 0.3,
                ease: "power2.out"
            });
        });
    }

    // ============================================
    // NAV LINK HOVER PARTICLES
    // ============================================
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function(e) {
            // Create a small particle burst effect
            for (let i = 0; i < 5; i++) {
                createParticleBurst(e.clientX, e.clientY);
            }
        });
    });

    function createParticleBurst(x, y) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: 4px;
            height: 4px;
            background: #ff6b35;
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            box-shadow: 0 0 10px #ff6b35;
        `;
        document.body.appendChild(particle);

        gsap.to(particle, {
            x: (Math.random() - 0.5) * 100,
            y: (Math.random() - 0.5) * 100,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => particle.remove()
        });
    }

    // Rest of your existing script.js code below...
    console.log("Hello world");

});


document.addEventListener("DOMContentLoaded", function () {
  // ----------------------------------------------------------
  // Quiz timer for each question
  // ----------------------------------------------------------
  function updateTimer(timerDisplay, timeLeft, timerInterval) {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    timerDisplay.textContent = `Timer: ${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval);
      // Optionally, trigger quiz end or auto-submit here
      timerDisplay.textContent = "Time's up!";
    }
    timeLeft.value--;
  }

  let timerInterval = null;
  let timeLeft = null;

  const timerDisplay = document.getElementById("quiz-timer");
  if (timerDisplay) {
    // Get timer value from data attribute, fallback to 10 minutes if not set
    let timerValue = parseInt(
      timerDisplay.getAttribute("data-timer-value"),
      10
    );
    if (isNaN(timerValue)) {
      timerValue = 10 * 60; // default to 10 minutes in seconds
    }
    timeLeft = { value: timerValue };
    updateTimer(timerDisplay, timeLeft); // Initial call to display immediately
    timerInterval = setInterval(
      () => updateTimer(timerDisplay, timeLeft, timerInterval),
      1000
    );
  }

  // ----------------------------------------------------------
  // Event handlers for buttons
  // ----------------------------------------------------------
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", function (event) {
      const dataType = button.getAttribute("data-type");
      const questionId = button.getAttribute("data-question-id");
      const sessionId = button.getAttribute("data-session-id");

      if (dataType === "phish" || dataType === "treat") {
        // Stop the timer
        if (timerInterval) {
          clearInterval(timerInterval);
        }

        // Get CSRF token from DOM
        const csrfToken = document.querySelector(
          "[name=csrfmiddlewaretoken]"
        ).value;

        // Make AJAX call to check results
        fetch(`/quiz/${sessionId}/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({
            answer: {
              question: questionId,
              choice: dataType,
              time_left: timeLeft ? timeLeft.value : null,
            },
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            // Handle response data here
            console.log(data);
            const resultsDiv = document.getElementById("quiz-results");
            if (resultsDiv) {
              let resultText = data.correct ? "Correct!" : "Incorrect.";
              if (data.explanation) {
                resultText += `\nExplanation: ${data.explanation}`;
              }
              resultsDiv.textContent = resultText;
            }
            // Update the score display
            const scoreDisplay = document.getElementById("user-score");
            if (scoreDisplay && typeof data.score !== "undefined") {
              scoreDisplay.textContent = data.score;
            }
            // Display progression controls
            document
              .getElementById("quiz-progression-control")
              .classList.remove("hidden");
            document.getElementById("quiz-choices").classList.add("hidden");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else {
        alert("Feature not yet implemented");
      }
    });
  });

  // Particle system
  const canvas = document.getElementById("particleCanvas");
  if (canvas) {
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
  }
  // Audio control
  const audioToggle = document.getElementById("audioToggle");
  const bgAudio = document.getElementById("bgAudio");

  if (audioToggle && bgAudio) {
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
  }

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
  if (document.getElementById("titleContainer")) {
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
  }
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
