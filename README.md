# StudyEarn 📚💰

## Empowering African Students to Learn and Earn

## 🔗 Project Links

- **Live Demo:** [https://studyearn.vercel.app](https://studyearn.vercel.app)
- **Video Presentation:** [Insert YouTube Link Here]
- **Presentation Slides:** [Insert Slides Link Here]

## 💡 Inspiration and Problem Statement

Education costs across Africa are rising rapidly. In Nigeria alone, private school fees have increased by up to **200 percent** in the last five years.

Sub-Saharan Africa has over **98 million children** out of school, while many students who remain enrolled struggle with financial pressure and over-indebtedness. Students are often forced to choose between academic success and financial survival.

**StudyEarn** was built to solve this problem by turning learning into an opportunity to earn, rather than a financial burden.

## 🚀 Key Features

* **Skill to Earn** Complete courses and quizzes to earn USD and reward points.
* **Marketplace** Upload study notes or past questions and earn 90 percent of every sale. (Platform commission is 10 percent).
* **Community Support** Peer-to-peer learning hub where knowledge sharing is rewarded.
* **AI Assistant** Voice-enabled study companion powered by OpenAI for complex academic topics.
* **Efficient Withdrawals** Real-time balance updates and fast payouts for student earnings.
* **Leaderboards and Referrals** Gamified competition and referral rewards to grow the community.

## 🛠️ Technical Documentation

### Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn UI
- **AI Integration:** OpenAI API (GPT-4o and Whisper for voice)
- **Deployment:** Vercel

### Architecture and Workflow

StudyEarn uses a modular, component-driven architecture. 

1.  **AI Integration:** The AI Assistant interacts with the OpenAI API to provide real-time academic support.  
2.  **Marketplace Engine:** Manages digital asset uploads, peer-to-peer transactions, and earnings distribution.  
3.  **State Management:** Real-time balance synchronization ensures transparency for all users.

### Project Structure

```text
src/
 ├─ components/     # Reusable UI elements
 ├─ pages/          # Feature specific views (Marketplace, AI Lab, etc.)
 ├─ hooks/          # Custom React hooks
 ├─ utils/          # API helpers and formatting utilities
 ├─ App.tsx         # Main routing component
 └─ main.tsx        # Application entry point
