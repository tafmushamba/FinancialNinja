# UK Financial Literacy Platform

A comprehensive platform designed to improve financial literacy for UK teens and adults, focusing on age-appropriate educational content.

## Core Financial Topics

The platform covers six essential areas of financial literacy with UK-specific information:

1. **Budgeting**: Creating and managing budgets, tracking income and expenses, and setting financial priorities within the UK context.

2. **Saving**: Building emergency funds, saving strategies, and understanding UK savings products like ISAs and Premium Bonds.

3. **Investing**: UK investment options including stocks, bonds, funds, property, and pensions, along with concepts like risk, returns, and compound interest.

4. **Credit**: Understanding UK credit scores, borrowing responsibly, managing credit cards, and different types of loans available in the UK.

5. **Taxes**: Introduction to the UK tax system including income tax, National Insurance, Council Tax, VAT, and tax-efficient strategies.

6. **Debt Management**: How to manage and repay debts, avoid excessive borrowing, and understand UK-specific debt solutions.

## Platform Features

- **Personalized Learning Paths**: Content tailored to different knowledge levels and age groups
- **Interactive Lessons**: Engaging lessons with real-life UK examples and scenarios
- **Progress Tracking**: Monitor learning progress through modules and quizzes
- **Financial Tools**: Practical budgeting and financial planning tools built for UK users
- **Achievements System**: Gamified elements to encourage continued learning
- **AI Assistant**: Personalized guidance for financial questions
- **Mobile Responsive**: Access content on any device

## Technology Stack

- Frontend: React with TypeScript
- Backend: Node.js
- Database: PostgreSQL with Drizzle ORM
- Styling: Tailwind CSS
- Authentication: JWT-based auth system

## Educational Approach

The platform follows a progressive learning approach:

1. **Foundational Knowledge**: Basic concepts suitable for beginners and younger users
2. **Practical Application**: Real-world examples and exercises based on UK financial products and systems
3. **Advanced Concepts**: More complex topics for those ready to deepen their understanding
4. **Continuous Assessment**: Quizzes and challenges to reinforce learning

## UK Focus

All content is specifically tailored to the UK financial system, including:
- UK-specific financial products and services (ISAs, Premium Bonds, etc.)
- UK tax system and regulations
- References to UK financial institutions and regulators (FCA, Bank of England, etc.)
- UK-based case studies and examples
- Currency in GBP (£)
- UK terminology and spelling

## 🚀 Overview

MoneyMind is a comprehensive financial education platform designed to help users build financial literacy through interactive learning modules, simulated financial games, and personalized tracking tools. The application features a modern UI with terminal aesthetics and neon accents, similar to Zogo.com.

## ✨ Features

- **Interactive Dashboard**: Personalized overview of your learning progress and financial stats
- **Learning Modules**: Step-by-step financial education content with interactive quizzes
- **Finance Tracker**: Monitor your income, expenses, and budgets
- **Financial Game**: Practice financial decision-making in a risk-free environment
- **Rewards Marketplace**: Earn points by completing modules and redeem them for gift cards
- **AI Assistant**: Get personalized financial advice powered by a large language model
- **Achievements System**: Earn badges and track your progress
- **User Settings**: Customize your experience with personalized settings

## 🎁 Rewards System

The rewards system allows users to:
- Earn points by completing financial literacy modules and quizzes
- Track progress toward reward milestones
- Redeem points for gift cards from popular brands ($5, $10, $15, $25 values)
- Filter rewards by category and value
- View redeemable rewards and rewards in progress

## 🔧 Tech Stack

### Frontend
- React
- TypeScript
- TanStack Query (React Query) for data fetching
- Tailwind CSS for styling
- Framer Motion for animations
- Shadcn/ui components
- Chart.js for data visualization

### Backend
- Node.js
- Express
- Passport.js for authentication
- Mistral AI integration

## 🏗️ Project Structure

```
/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React context providers
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utility functions and API client
│   │   ├── pages/       # Main application views
│   │   └── App.tsx      # Main application component
│   └── package.json     # Frontend dependencies
│
├── server/              # Backend Express server
│   ├── data/            # Mock data for development
│   ├── services/        # Business logic and external service integrations
│   ├── auth.ts          # Authentication logic
│   ├── routes.ts        # API route definitions
│   └── storage.ts       # Data persistence layer
│
└── shared/              # Shared code between frontend and backend
    └── schema/          # TypeScript interfaces and type definitions
```

## 🖌️ Design System

MoneyMind features a hackathon/terminal-inspired design system with:

- Dark theme with neon accents (primary: neon green)
- Glass-effect cards with backdrop blur
- Glowing borders and interactive elements
- Terminal-style typography and elements
- Fluid animations and transitions

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🚀 Running the Application

To start both the backend and frontend servers with the frontend running on port 3000 (similar to `next dev -p 3000`), use the following command from the root directory:

```bash
npm run dev:all
```

This will launch:
- The backend server on port 3001
- The frontend client on port 3000

You can then access the application in your browser at `http://localhost:3000`.

## 🚀 Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/moneymind.git
cd moneymind
```

2. Install dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Start the development servers
```bash
# Terminal 1: Start the backend server
cd server
npm run dev

# Terminal 2: Start the frontend development server
cd client
npm run dev
```

4. Open your browser and navigate to http://localhost:3000

## 🔐 Authentication

The application includes a full authentication system with:
- User login/registration
- Session management
- Protected routes
- User profile management

## 📚 Accessibility

- Proper color contrast for readability
- Keyboard navigation support
- Semantic HTML structure
- ARIA attributes for screen readers
- Focus management for interactive elements

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details. 