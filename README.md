# StudyEarn 📚💰

## Empowering African Students to Learn and Earn

## Project Links

- Live Demo: https://studyearn.vercel.app
- Video Presentation: https://youtu.be/PA1qGJnIXes
- Presentation Slides: https://drive.google.com/file/d/1CwmKoz2XXGCVBGCLMVgIlmzOfkQQRvjM/view
---

## Inspiration and Problem Statement

Education costs across Africa are rising rapidly. In Nigeria alone, private school fees have increased by up to 200 percent in the last five years.

Sub Saharan Africa has over 98 million children out of school, while many students who remain enrolled struggle with financial pressure and over indebtedness.

Students are often forced to choose between academic success and financial survival.

StudyEarn was built to solve this problem by turning learning into an opportunity to earn, rather than a financial burden.
---

## What it Does

StudyEarn is a learning platform where users earn real money and points by completing educational activities:

- **Skill-to-Earn**: Complete courses, quizzes, and modules to earn USD and points
- **Wallet System**: Track earnings, withdraw to bank accounts, and manage points
- **Marketplace**: Redeem points for products or upload items to sell
- **Community Support**: Ask questions, share knowledge, and earn through peer learning
- **Leaderboards**: Compete with other learners for top rankings
- **AI Assistant**: Voice-enabled study companion powered by OpenAI
- **Referral Program**: Earn bonuses by inviting friends
- **Opportunities**: Sponsorships, Scholarships, Internships, and Hackathons
- **And more**: Kindly explore additional features on the platform.
---

## Key Features

- Skill to Earn  
- Marketplace  
- Community Support  
- AI Assistant  
- Efficient Withdrawals  
- Leaderboards and Referrals
---

## How it was Built

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion.
- **UI Components**: shadcn/ui with custom design system.
- **Backend**: Lovable Cloud (Supabase) for database, authentication, and edge functions.
- **AI Assistant Integration**: OpenAI for the study assistant and ElevenLabs for text-to-speech.
- **Payments**: Stripe integration for subscriptions.
- **Conversion Rate**: Real-time live exchange rates (USD/NGN) and notifications.
- **Hosting and Deployment**: Vercel.
---

## Technical Documentation

### Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn UI
- OpenAI API (GPT 4o and ElevenLabs for voice)
- Lovable Cloud (Supabase)
- Stripe for payments
- Vercel for deployment
---

### Architecture & Workflow

StudyEarn uses a modular, component-driven architecture optimized for scalability and maintainability:

- **Frontend Components:** Built with React 18, TypeScript, Vite, Tailwind CSS, and Framer Motion for a responsive, smooth UI.
- **AI Assistant:** Communicates with OpenAI API to provide real-time academic support.
- **Marketplace Module:** Manages digital asset uploads, peer-to-peer transactions, and revenue distribution.
- **Wallet System:** Tracks earnings, points, and withdrawals with real-time synchronization to ensure transparency.
- **Backend:** Supabase (Lovable Cloud) handles authentication, database, and edge functions.
- **Deployment:** Vercel for fast, globally accessible hosting.
---

### AI Models and Tools Used

- **OpenAI GPT-4o:** Provides intelligent, context-aware study assistance.  
- **ElevenLabs TTS:** Converts AI responses into voice for the study companion.  
- **Supabase (Lovable Cloud):** Database, authentication, and real-time edge functions.  
- **Stripe API:** Payment processing for subscriptions and withdrawals.  
- **Google Translate API:** Multi-language support for local African dialects.
---

## Project Structure

```bash
src/
 ├─ components/     Reusable UI elements
 ├─ pages/          Feature-specific views such as Marketplace and AI Lab
 ├─ hooks/          Custom React hooks
 ├─ utils/          API helpers and formatting utilities
 ├─ App.tsx         Main routing component
 └─ main.tsx        Application entry point
```
---

## Getting Started

### Prerequisites

- Node.js version 18 or higher
- npm or yarn
---

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>  
cd <project-folder>
````
2. Install dependencies:

```bash
npm install
````
---

### Environment Setup

Set up environment variables in a .env file:

```bash
OPENAI_API_KEY=your_api_key_here
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```
---

### Development

1. Run the development server:

```bash
npm run dev
```

2. The application will be available at:

```bash
http://localhost:5173
```
---

## Challenges We Ran Into

- Implementing secure withdrawal system with bank account verification
- Integrating stripe for plan upgrade purposes
- Managing different database and notification features for each account
- Integrating resend for the wallet support system was initially tricky
- Ensuring real-time sync between earnings and displayed balances
- Integrating voice AI assistant on a free tier account of elevenlabs (limited credits)
---

## Accomplishments and Learnings

- Fully functional earn-while-learning ecosystem
- Real-time currency conversion and withdrawal system
- Voice-enabled AI study assistant
- Comprehensive transaction history with PDF export
- Designing incentive structure that encourages genuine learning
- Integrating multiple AI services (OpenAI, ElevenLabs, Gemini)
- Building secure authentication with 2FA and trusted devices
- Functional referral system with $0.1 bonus per new signup
- Real-time currency exchange updates.
- Accurate live balance updates
- Multiple withdrawal methods (gift cards, bank account, crypto)
- Multi-language support via Google Translate API.
---

## Team Information

### Team EduFund

| Name | Roles | Contact Email |
|----------|----------|----------|
| OLADEPO Caleb Olugbenga | Team Lead and Full-Stack Developer | caleboladepo@gmail.com |
| OLAWALE Ayanfe John | Business Analyst and AI/ML Engineer | ayanfejohn349@gmail.com |
---

## What’s Next for StudyEarn

- Expanding language support to over 1,000 local African dialects using AI.
- Integrating blockchain for faster and borderless student payouts.
- Partnering with African universities for official course certification.
- Building Mobile App for Native iOS and Android versions.
- Enabling Offline Access (offline study mode for students.
- Integrating deeper learning insights and progress predictions.
- Global Expansion: Multi-currency support and more localized content.
- Enable transferrable points among students.
---

## License

This project is licensed for academic, research, and demonstration purposes.
