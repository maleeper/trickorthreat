# trickorthreat
Halloween Hackathon 2025 - Phantom Phishers 
# Trick or Threat

<p align="center">
  <img src="phantomphish.jpg" alt="Phantom Phishers Team Logo" width="600"/>
</p>

<p align="center">
  <strong>Code Institute Halloween Hackathon 2025</strong><br>
  A phishing detection toolkit that doesn't suck
</p>

---

## What is this?

A Halloween-themed cybersecurity toolkit for detecting and learning about phishing attacks. Check sketchy URLs, take quizzes on fake emails, and compete on the leaderboard.

**Features:**
- 🔍 **URL Scanner** - Check if links are trying to steal your identity
- 🎮 **Phishing Quiz** - Test yourself on realistic fake emails
- 🏆 **Leaderboard** - Compete with other internet strangers

---

## Tech Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- GSAP for animations
- Glassmorphism UI

**Backend:**
- Python / Django
- Django REST Framework
- PostgreSQL

**APIs:**
- PhishTank for URL verification

**Deployment:**
- Heroku (Backend)
- GitHub Pages / Vercel (Frontend)

---

## Team - Phantom Phishers

| Name | Role | GitHub |
|------|------|--------|
| **Kim** | Scrum Master / Frontend | [@kimatron](https://github.com/kimatron) |
| **Dinesh** | Backend Developer | [@sthDINESH](https://github.com/sthDINESH) |
| **Shuayb** | Backend Developer | [@ShuaybAi](https://github.com/ShuaybAi) |
| **Mark** | Design / Content | [@maleeper](https://github.com/maleeper) |
| **Sanchia** | Frontend Developer | [@Chia-Codes](https://github.com/Chia-Codes) |
| **Akram** | Developer | TBD | [@Chia-Codes](https://github.com/AL-MASNAI) |

---

## Quick Start

### Frontend (Landing Page)
```bash
# Just open index.html in your browser
# Or use Python's built-in server:
python -m http.server 8000
```

### Backend (Django)
```bash
# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start server
python manage.py runserver
```

---

## Project Structure

```
trick-or-threat/
├── index.html              # Landing page
├── css/
├── js/
├── api/                    # Backend API
├── backend/                # Django project
└── README.md
```

---

## Contributing

1. Create a feature branch: `git checkout -b yourname/feature-name`
2. Make your changes
3. Push and open a PR
4. Get 1 approval
5. Merge and celebrate 🎃

---

**Built by Team Phantom Phishers**
