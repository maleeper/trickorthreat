// ============================================
// 🩸 PHANTOM PHISHERS - BLOOD & FIRE EDITION
// ============================================

document.addEventListener("DOMContentLoaded", function () {
  const nav = document.getElementById("mainNav");
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("navMenu");
  const navLinks = document.querySelectorAll(".nav-link");

  // ============================================
  // NAVBAR SCROLL EFFECT - BLOODIER ON SCROLL
  // ============================================
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      nav?.classList.add("scrolled");

      if (typeof gsap !== "undefined") {
        gsap.to(".nav-neon-line", {
          boxShadow:
            "0 0 40px rgba(255, 69, 0, 0.8), 0 0 80px rgba(139, 0, 0, 0.6)",
          duration: 0.3,
        });
      }
    } else {
      nav?.classList.remove("scrolled");

      if (typeof gsap !== "undefined") {
        gsap.to(".nav-neon-line", {
          boxShadow:
            "0 0 20px rgba(255, 69, 0, 0.6), 0 0 40px rgba(139, 0, 0, 0.4)",
          duration: 0.3,
        });
      }
    }
  });

  // ============================================
  // MOBILE MENU TOGGLE WITH BLOOD BURST
  // ============================================
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");

      if (navMenu.classList.contains("active")) {
        createBloodSplatter(window.innerWidth - 140, 40);

        if (typeof gsap !== "undefined") {
          const tl = gsap.timeline();

          tl.to(navMenu, {
            duration: 0.5,
            ease: "power2.out",
          });

          tl.from(
            ".nav-item",
            {
              x: 50,
              opacity: 0,
              duration: 0.4,
              stagger: 0.12,
              ease: "back.out(2)",
            },
            "-=0.3"
          );
        }
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // ============================================
  // SMOOTH SCROLL WITH BLOOD TRAIL
  // ============================================
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target && typeof gsap !== "undefined") {
        const scrollInterval = setInterval(() => {
          createBloodParticle(
            Math.random() * window.innerWidth,
            window.scrollY + Math.random() * window.innerHeight
          );
        }, 50);

        gsap.to(window, {
          duration: 1.2,
          scrollTo: {
            y: target,
            offsetY: 80,
          },
          ease: "power2.inOut",
          onComplete: () => clearInterval(scrollInterval),
        });
      }
    });
  });

  // ============================================
  // NAVBAR LOAD ANIMATION
  // ============================================
  if (typeof gsap !== "undefined") {
    const navLoadTL = gsap.timeline();

    navLoadTL
      .from(".nav-logo", {
        x: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        onStart: () => {
          for (let i = 0; i < 10; i++) {
            setTimeout(() => {
              createBloodParticle(100, 40);
            }, i * 50);
          }
        },
      })
      .from(
        ".nav-item",
        {
          y: -40,
          opacity: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(2)",
        },
        "-=0.5"
      )
      .from(
        ".nav-neon-line",
        {
          scaleX: 0,
          duration: 1.5,
          ease: "power2.inOut",
        },
        "-=0.6"
      );
  }

  // ============================================
  // LOGO HOVER - GHOST SCREAM & BLOOD BURST
  // ============================================
  const logo = document.querySelector(".nav-logo");
  if (logo && typeof gsap !== "undefined") {
    logo.addEventListener("mouseenter", () => {
      gsap.to(".logo-icon", {
        scale: 1.3,
        rotation: -15,
        duration: 0.15,
        ease: "power2.out",
        yoyo: true,
        repeat: 3,
      });

      for (let i = 0; i < 8; i++) {
        setTimeout(() => {
          const rect = logo.getBoundingClientRect();
          createBloodParticle(
            rect.left + rect.width / 2,
            rect.top + rect.height / 2
          );
        }, i * 30);
      }

      gsap.to(".logo-text", {
        textShadow: "0 0 30px rgba(255, 69, 0, 1), 0 0 60px rgba(139, 0, 0, 1)",
        duration: 0.2,
        yoyo: true,
        repeat: 1,
      });
    });

    logo.addEventListener("mouseleave", () => {
      gsap.to(".logo-icon", {
        scale: 1,
        rotation: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    });
  }

  // ============================================
  // NAV LINK HOVER - BLOOD SPLATTER
  // ============================================
  navLinks.forEach((link) => {
    link.addEventListener("mouseenter", function (e) {
      const rect = this.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;

      createBloodSplatter(x, y);

      if (typeof gsap !== "undefined") {
        gsap.to(this, {
          x: -2,
          duration: 0.05,
          yoyo: true,
          repeat: 3,
          ease: "power1.inOut",
        });
      }
    });

    link.addEventListener("mouseleave", function () {
      if (typeof gsap !== "undefined") {
        gsap.to(this, {
          x: 0,
          duration: 0.2,
        });
      }
    });
  });

  // ============================================
  // 🩸 BLOOD PARTICLE SYSTEM
  // ============================================
  function createBloodParticle(x, y) {
    const particle = document.createElement("div");
    const size = Math.random() * 6 + 3;

    particle.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, #8B0000, #FF4500);
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            box-shadow: 0 0 10px #FF4500;
        `;
    document.body.appendChild(particle);

    const angle = Math.random() * 360;
    const distance = Math.random() * 100 + 50;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance + 100;

    if (typeof gsap !== "undefined") {
      gsap.to(particle, {
        x: dx,
        y: dy,
        opacity: 0,
        duration: Math.random() * 1 + 0.8,
        ease: "power2.out",
        onComplete: () => particle.remove(),
      });
    } else {
      setTimeout(() => particle.remove(), 1000);
    }
  }

  function createBloodSplatter(x, y) {
    const splatCount = 15;

    for (let i = 0; i < splatCount; i++) {
      setTimeout(() => {
        const splat = document.createElement("div");
        const size = Math.random() * 8 + 2;

        splat.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${i % 2 === 0 ? "#8B0000" : "#FF4500"};
                    border-radius: ${Math.random() > 0.5 ? "50%" : "0"};
                    pointer-events: none;
                    z-index: 10000;
                    box-shadow: 0 0 ${size * 2}px rgba(255, 69, 0, 0.8);
                `;
        document.body.appendChild(splat);

        const angle = (360 / splatCount) * i + (Math.random() * 30 - 15);
        const distance = Math.random() * 80 + 40;
        const dx = Math.cos((angle * Math.PI) / 180) * distance;
        const dy = Math.sin((angle * Math.PI) / 180) * distance;

        if (typeof gsap !== "undefined") {
          gsap.to(splat, {
            x: dx,
            y: dy,
            opacity: 0,
            rotation: Math.random() * 360,
            duration: Math.random() * 0.8 + 0.5,
            ease: "power2.out",
            onComplete: () => splat.remove(),
          });
        } else {
          setTimeout(() => splat.remove(), 800);
        }
      }, i * 20);
    }
  }

  // ============================================
  // 🔥 EMBER PARTICLES (Background)
  // ============================================
  function createEmberParticles() {
    setInterval(() => {
      const ember = document.createElement("div");
      const size = Math.random() * 4 + 2;
      const startX = Math.random() * window.innerWidth;

      ember.style.cssText = `
                position: fixed;
                left: ${startX}px;
                bottom: -20px;
                width: ${size}px;
                height: ${size}px;
                background: ${Math.random() > 0.5 ? "#FF4500" : "#8B0000"};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1;
                box-shadow: 0 0 ${size * 4}px rgba(255, 69, 0, 0.8);
            `;
      document.body.appendChild(ember);

      if (typeof gsap !== "undefined") {
        gsap.to(ember, {
          y: -(window.innerHeight + 100),
          x: (Math.random() - 0.5) * 200,
          opacity: 0,
          duration: Math.random() * 4 + 3,
          ease: "power1.inOut",
          onComplete: () => ember.remove(),
        });
      } else {
        setTimeout(() => ember.remove(), 5000);
      }
    }, 500);
  }

  createEmberParticles();

  // ============================================
  // 🎮 QUIZ TIMER & HANDLERS
  // ============================================
  function updateTimer(timerDisplay, timeLeft, timerInterval) {
    const minutes = Math.floor(timeLeft.value / 60);
    const seconds = timeLeft.value % 60;
    timerDisplay.textContent = `Timer: ${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    if (timeLeft.value <= 0) {
      clearInterval(timerInterval);
      timerDisplay.textContent = "Time's up!";
    }
    timeLeft.value--;
  }

  let timerInterval = null;
  let timeLeft = null;

  const timerDisplay = document.getElementById("quiz-timer");
  if (timerDisplay) {
    let timerValue = parseInt(
      timerDisplay.getAttribute("data-timer-value"),
      10
    );
    if (isNaN(timerValue)) {
      timerValue = 10 * 60;
    }
    timeLeft = { value: timerValue };
    updateTimer(timerDisplay, timeLeft);
    timerInterval = setInterval(
      () => updateTimer(timerDisplay, timeLeft, timerInterval),
      1000
    );
  }
  // ============================================
  // 🎮 URL SCAN HANDLERS
  // ============================================
  // --- URLScan.io two-step scan logic ---
  let scanUuid = null;
  let scanPollInterval = null;

  function startUrlScan(url) {
    fetch("/scanner/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Requested-With": "XMLHttpRequest",
        "X-CSRFToken": getCSRFToken(),
      },
      body: JSON.stringify({ url }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.uuid) {
          scanUuid = data.uuid;
          pollForScanResult();
          showScanStatus("Scan started. Waiting for results...");
        } else {
          showScanStatus("Scan error: " + (data.error || "Unknown error"));
        }
      })
      .catch((err) => {
        showScanStatus("Scan error: " + err);
      });
  }

  function pollForScanResult() {
    if (scanPollInterval) clearInterval(scanPollInterval);
    scanPollInterval = setInterval(() => {
      const csrfToken = document.querySelector(
        "[name=csrfmiddlewaretoken]"
      )?.value;
      fetch("/scanner/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ uuid: scanUuid }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "complete" && data.result) {
            clearInterval(scanPollInterval);
            showScanResult(data.result);
          } else if (data.status === "pending") {
            showScanStatus("Scan in progress...");
          } else {
            clearInterval(scanPollInterval);
            showScanStatus("Scan error: " + (data.error || "Unknown error"));
          }
        })
        .catch((err) => {
          clearInterval(scanPollInterval);
          showScanStatus("Scan error: " + err);
        });
    }, 2000); // poll every 2 seconds
  }

  function showScanStatus(msg) {
    const resultsDiv = document.getElementById("scan-results");
    if (resultsDiv) resultsDiv.textContent = msg;
  }

  function showScanResult(result) {
    const resultsDiv = document.getElementById("scan-results");
    if (!resultsDiv) return;

    // Defensive checks for nested properties
    const verdicts = result.verdicts && result.verdicts.urlscan ? result.verdicts.urlscan : {};
    const score = verdicts.score !== undefined ? verdicts.score : "N/A";
    const malicious = verdicts.malicious !== undefined ? verdicts.malicious : "N/A";
    const reportURL = result.task && result.task.reportURL ? result.task.reportURL : null;

    let html = `<div><strong>Score:</strong> ${score}</div>`;
    html += `<div><strong>Malicious:</strong> ${malicious}</div>`;
    if (reportURL) {
      html += `<div><a href="${reportURL}" target="_blank">View Full Report</a></div>`;
    }

    resultsDiv.innerHTML = html;
  }

  // ============================================
  // BUTTON HANDLERS WITH BLOOD EFFECTS
  // ============================================
  document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", function (event) {
      const rect = button.getBoundingClientRect();
      createBloodSplatter(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );

      const dataType = button.getAttribute("data-type");
      const questionId = button.getAttribute("data-question-id");
      const sessionId = button.getAttribute("data-session-id");

      if (dataType === "phish" || dataType === "treat") {
        if (timerInterval) {
          clearInterval(timerInterval);
        }

        const csrfToken = document.querySelector(
          "[name=csrfmiddlewaretoken]"
        )?.value;

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
            console.log(data);

            const resultsDiv = document.getElementById("quiz-results");
            if (resultsDiv) {
              let resultText = data.correct ? "Correct!" : "Incorrect.";
              if (data.explanation) {
                resultText += `\nExplanation: ${data.explanation}`;
              }
              resultsDiv.textContent = resultText;
            }

            const scoreDisplay = document.getElementById("user-score");
            if (scoreDisplay && typeof data.score !== "undefined") {
              scoreDisplay.textContent = data.score;
            }

            document
              .getElementById("quiz-progression-control")
              ?.classList.remove("hidden");
            document.getElementById("quiz-choices")?.classList.add("hidden");
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      } else if (dataType === "url-scan") {
        const urlInput = document.getElementById("urlInput");
        const url = urlInput ? urlInput.value : "";
        if (!url) {
          showScanStatus("Please enter a URL to scan.");
          return;
        }

        const csrfToken = document.querySelector(
          "[name=csrfmiddlewaretoken]"
        )?.value;

        // Step 1: Start scan, get uuid
        fetch("/scanner/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": csrfToken,
            "X-Requested-With": "XMLHttpRequest",
          },
          body: JSON.stringify({ url }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success && data.uuid) {
              scanUuid = data.uuid;
              pollForScanResult();
              showScanStatus("Scan started. Waiting for results...");
            } else {
              showScanStatus("Scan error: " + (data.error || "Unknown error"));
            }
          })
          .catch((error) => {
            showScanStatus("Scan error: " + error);
          });
      } else {
        alert("Feature not yet implemented");
      }
    });
  });

  // ============================================
  // 🎨 PARTICLE CANVAS SYSTEM
  // ============================================
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
        this.color = ["#FF4500", "#8B0000", "#FF6B35", "#fff"][
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

    // Title explosion effect
    function explodeTitle() {
      const chars = document.querySelectorAll(".char");
      chars.forEach((char, i) => {
        const rect = char.getBoundingClientRect();
        for (let j = 0; j < 5; j++) {
          particles.push(
            new Particle(rect.left + rect.width / 2, rect.top + rect.height / 2)
          );
        }
      });
    }

    // Title hover - explosion effect
    const titleContainer = document.getElementById("titleContainer");
    if (titleContainer) {
      titleContainer.addEventListener("mouseenter", () => {
        explodeTitle();
        if (typeof gsap !== "undefined") {
          gsap.to(".char", {
            scale: 1.1,
            duration: 0.2,
            stagger: 0.02,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
          });
        }
      });
    }

    // Window resize
    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  // ============================================
  // 🎧 AUDIO CONTROL
  // ============================================
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

  // ============================================
  // ✨ GSAP TITLE ANIMATIONS
  // ============================================
  function splitText(element) {
    if (!element) return;
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

  window.addEventListener("load", () => {
    if (typeof gsap === "undefined") return;

    const title = document.getElementById("mainTitle");
    if (title) {
      splitText(title);

      const chars = document.querySelectorAll(".char");
      const words = document.querySelectorAll(".word");

      // IMPORTANT: Set colors for words so they're visible!
      if (words[0]) {
        words[0].style.color = "#fff"; // TRICK - white
        words[0].style.textShadow = "0 0 20px rgba(255, 255, 255, 0.8)";
      }
      if (words[1]) {
        words[1].style.color = "#FF6B35"; // OR - toxic orange
        words[1].style.textShadow = "0 0 30px rgba(255, 107, 53, 0.8)";
      }
      if (words[2]) {
        words[2].style.color = "#FF4500"; // THREAT - neon orange/red
        words[2].style.textShadow = "0 0 30px rgba(255, 69, 0, 0.8)";
      }

      const tl = gsap.timeline();

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

      // Glow effect on THREAT word
      if (words[2]) {
        gsap.to(words[2], {
          textShadow: "0 0 30px #FF4500, 0 0 50px #8B0000",
          duration: 1.5,
          yoyo: true,
          repeat: -1,
          ease: "power1.inOut",
        });
      }

      // Card animations
      const mainCard = document.getElementById("mainCard");
      const badge = document.getElementById("badge");
      const features = document.getElementById("features");

      if (mainCard) gsap.set(mainCard, { opacity: 0, y: 30 });
      if (badge) gsap.set(badge, { opacity: 0, scale: 0.8 });
      if (features) gsap.set(features, { opacity: 0 });

      tl.to(
        mainCard,
        { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
        "-=0.5"
      );
      tl.to(
        badge,
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" },
        "-=0.4"
      );
      tl.to(features, { opacity: 1, duration: 0.5 }, "-=0.3");

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
    }
  });

  // ============================================
  // 🎃 FEATURE CARD INTERACTIONS
  // ============================================
  document.querySelectorAll(".feature-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      if (typeof gsap !== "undefined") {
        gsap.to(this.querySelector(".feature-icon"), {
          scale: 1.3,
          rotation: 360,
          duration: 0.5,
          ease: "back.out(2)",
        });
      }
    });

    card.addEventListener("mouseleave", function () {
      if (typeof gsap !== "undefined") {
        gsap.to(this.querySelector(".feature-icon"), {
          scale: 1,
          rotation: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    });
  });

  // ============================================
  // 👥 TEAM CARD INTERACTIONS
  // ============================================
  document.querySelectorAll(".team-card").forEach((card) => {
    card.addEventListener("mouseenter", function () {
      // Blood splatter effect
      const rect = this.getBoundingClientRect();
      createBloodSplatter(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2
      );

      // Animate avatar
      if (typeof gsap !== "undefined") {
        gsap.to(this.querySelector(".team-avatar"), {
          rotation: 360,
          duration: 0.6,
          ease: "back.out(2)",
        });
      }
    });

    card.addEventListener("mouseleave", function () {
      if (typeof gsap !== "undefined") {
        gsap.to(this.querySelector(".team-avatar"), {
          rotation: 0,
          duration: 0.4,
          ease: "power2.out",
        });
      }
    });
  });

  // ============================================
  // 🩸 CONSOLE BLOOD MESSAGE
  // ============================================
  console.log(
    "%c🩸 PHANTOM PHISHERS - BLOOD EDITION 🩸",
    "color: #FF4500; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #8B0000, 0 0 20px #FF4500;"
  );
  console.log(
    "%cTeam 3 • Code Institute Halloween Hackathon 2025",
    "color: #FF6B35; font-size: 14px; font-weight: bold;"
  );
  console.log(
    "%cWatch the blood flow... 🔥",
    "color: #8B0000; font-size: 12px;"
  );
});
