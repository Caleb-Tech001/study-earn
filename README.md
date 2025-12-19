# StudyEarn 📚💰

## Empowering African Students to Learn and Earn

## Project Links

- Live Demo: https://studyearn.vercel.app
- Video Presentation: https://youtu.be/PA1qGJnIXes
- Presentation Slides: https://drive.google.com/file/d/1CwmKoz2XXGCVBGCLMVgIlmzOfkQQRvjM/view

## Inspiration and Problem Statement

Education costs across Africa are rising rapidly. In Nigeria alone, private school fees have increased by up to 200 percent in the last five years.

Sub Saharan Africa has over 98 million children out of school, while many students who remain enrolled struggle with financial pressure and over indebtedness.

Students are often forced to choose between academic success and financial survival.

StudyEarn was built to solve this problem by turning learning into an opportunity to earn, rather than a financial burden.

## Key Features

- Skill to Earn  
  Complete courses and quizzes to earn USD and reward points.

- Marketplace  
  Upload study notes or past questions and earn 90 percent of every sale.  
  Platform commission is 10 percent.

- Community Support  
  Peer to peer learning hub where knowledge sharing is rewarded.

- AI Assistant  
  Voice enabled study companion powered by OpenAI for complex academic topics.

- Efficient Withdrawals  
  Real time balance updates and fast payouts for student earnings.

- Leaderboards and Referrals  
  Gamified competition and referral rewards to grow the community.

## Technical Documentation

### Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn UI
- OpenAI API (GPT 4o and ElevenLabs for voice)
- Vercel for deployment

## Architecture and Workflow

StudyEarn uses a modular, component driven architecture.

The AI Assistant interacts with the OpenAI API to provide real time academic support.  
The Marketplace manages digital asset uploads, peer to peer transactions, and earnings distribution.  
Real time balance synchronization ensures transparency for all users.

## Project Structure

```bash
src/

├─ components/     Reusable UI elements
├─ pages/          Feature specific views such as Marketplace and AI Lab
├─ hooks/          Custom React hooks
├─ utils/          API helpers and formatting utilities
├─ App.tsx         Main routing component
└─ main.tsx        Application entry point
