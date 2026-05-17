# 🚀 Jooblie - Modern Job Portal Platform

A comprehensive job portal platform built with React, TypeScript, and Tailwind CSS. Jooblie connects job seekers with recruiters through an intuitive and responsive interface.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Pages & Routes](#pages--routes)
- [Components](#components)
- [Styling](#styling)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)

---

## ✨ Features

### For Job Seekers
- 🔍 Browse and search job listings
- 📝 Apply for jobs with one click
- 📊 Track application status in dashboard
- 💼 View personalized job recommendations
- 👤 Manage profile and resume
- 🌙 Dark/Light mode support

### For Recruiters
- 📢 Post and manage job listings
- 👥 View and manage applicants
- 🏢 Company profile management
- 📈 Dashboard with analytics
- ✏️ Edit and update job postings

### General Features
- 📱 100% Responsive design (Mobile, Tablet, Desktop)
- 🎨 Modern UI with smooth animations
- 🌓 Dark/Light theme toggle
- 🔐 Authentication system (Login/Register)
- 🎯 Role-based access (Job Seeker / Recruiter)
- ⚡ Fast performance with Vite
- 🎭 Framer Motion animations

---

## 🛠️ Tech Stack

### Frontend Framework
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool and dev server

### Styling
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Framer Motion 12.34.0** - Animation library
- **Lucide React** - Icon library

### UI Components
- **Radix UI** - Accessible component primitives
- **shadcn/ui** - Re-usable component collection
- **Recharts** - Chart library for analytics

### Routing & State
- **React Router DOM 6.30.1** - Client-side routing
- **TanStack Query 5.83.0** - Server state management
- **React Hook Form 7.61.1** - Form handling

### Development Tools
- **ESLint** - Code linting
- **Vitest** - Unit testing
- **TypeScript ESLint** - TypeScript linting

---

## 📁 Project Structure

```
jooblie/
├── public/
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components (50+ components)
│   │   ├── AnimatedSection.tsx
│   │   ├── Chatbot.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   ├── contexts/
│   │   └── ThemeContext.tsx # Dark/Light mode context
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-toast.ts
│   │   └── useAuth.ts
│   ├── lib/
│   │   └── utils.ts         # Utility functions
│   ├── pages/
│   │   ├── dashboard/       # Job Seeker dashboard pages
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── DashboardIndex.tsx
│   │   │   ├── Applications.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── Recommendations.tsx
│   │   │   └── Resume.tsx
│   │   ├── recruiter/       # Recruiter dashboard pages
│   │   │   ├── RecruiterLayout.tsx
│   │   │   ├── RecruiterDashboard.tsx
│   │   │   ├── RecruiterJobs.tsx
│   │   │   ├── CreateJob.tsx
│   │   │   └── CompanyPage.tsx
│   │   ├── Index.tsx        # Landing page
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Jobs.tsx
│   │   ├── JobDetail.tsx
│   │   ├── Companies.tsx
│   │   ├── Pricing.tsx
│   │   └── NotFound.tsx
│   ├── App.tsx              # Main app component with routes
│   ├── main.tsx             # App entry point
│   ├── index.css            # Global styles
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/iahmadiqbal/jooblie.git
cd jooblie
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Open in browser**
```
http://localhost:8080
```

---

## 📜 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build for development
npm run build:dev

# Preview production build
npm run preview

# Run linting
npm run lint

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

---

## 🗺️ Pages & Routes

### Public Routes
| Route | Page | Description |
|-------|------|-------------|
| `/` | Index | Landing page with hero section |
| `/login` | Login | User authentication |
| `/register` | Register | New user registration |
| `/jobs` | Jobs | Browse all job listings |
| `/jobs/:id` | JobDetail | Individual job details |
| `/companies` | Companies | Browse companies |
| `/pricing` | Pricing | Pricing plans |

### Job Seeker Routes (Protected)
| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | DashboardIndex | Main dashboard overview |
| `/dashboard/applications` | Applications | Track job applications |
| `/dashboard/recommendations` | Recommendations | AI-powered job suggestions |
| `/dashboard/profile` | Profile | Edit user profile |
| `/dashboard/resume` | Resume | Manage resume |

### Recruiter Routes (Protected)
| Route | Page | Description |
|-------|------|-------------|
| `/recruiter` | RecruiterDashboard | Recruiter overview |
| `/recruiter/jobs` | RecruiterJobs | Manage job postings |
| `/recruiter/create-job` | CreateJob | Post new job |
| `/recruiter/company` | CompanyPage | Company profile |

---

## 🎨 Components

### Core Components
- **Navbar** - Responsive navigation with mobile menu
- **Footer** - Site footer with links
- **AnimatedSection** - Scroll-triggered animations
- **Chatbot** - AI assistant (UI ready)

### UI Components (50+ from shadcn/ui)
- Accordion, Alert, Avatar, Badge, Button
- Card, Carousel, Chart, Checkbox, Dialog
- Dropdown, Form, Input, Label, Select
- Sheet, Sidebar, Skeleton, Slider, Switch
- Table, Tabs, Toast, Tooltip, and more...

### Layout Components
- **DashboardLayout** - Job seeker dashboard wrapper
- **RecruiterLayout** - Recruiter dashboard wrapper

---

## 🎨 Styling

### Design System
- **Primary Color**: Yellow (#FFD523)
- **Secondary Color**: Gold (#F9C900)
- **Fonts**: 
  - Headings: Space Grotesk
  - Body: Inter
- **Theme**: Dark/Light mode support

### Responsive Breakpoints
```css
sm: 640px   /* Mobile */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large Desktop */
```

### Key Features
- Pure Tailwind CSS utility classes
- No custom CSS classes
- Consistent spacing and typography
- Smooth transitions and animations
- Glass morphism effects

---

## 🌐 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Deploy automatically

### Manual Build
```bash
npm run build
```
Output will be in `dist/` folder

---

## 🔮 Future Enhancements

### Backend Integration (Planned)
- [ ] REST API integration
- [ ] User authentication with JWT
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] File upload for resumes
- [ ] Email notifications
- [ ] Payment gateway integration

### Frontend Features (Planned)
- [ ] Advanced job filters
- [ ] Real-time chat between recruiter and applicant
- [ ] Video interview scheduling
- [ ] Resume builder
- [ ] Skill assessment tests
- [ ] Company reviews and ratings
- [ ] Salary insights
- [ ] Job alerts via email

### UI/UX Improvements (Planned)
- [ ] Loading skeletons
- [ ] Empty states
- [ ] Form validation with error messages
- [ ] Toast notifications
- [ ] Infinite scroll for job listings
- [ ] Advanced search with autocomplete

---

## 👨‍💻 Development Notes

### Current Status
- ✅ Frontend: 75% Complete
- ⏳ Backend: Not Started
- ✅ Responsive Design: 100% Complete
- ✅ Dark/Light Mode: Implemented
- ⏳ Authentication: UI Ready (Backend Pending)

### Known Issues
- Backend API integration pending
- Authentication is UI-only (no real auth)
- Data is static/mock data
- File uploads not functional yet

---

## 📝 License

This project is private and proprietary.

---

## 🤝 Contributing

This is a private project. For any queries, contact the repository owner.

---

## 📧 Contact

**Developer**: Ahmad Iqbal  
**GitHub**: [@iahmadiqbal](https://github.com/iahmadiqbal)  
**Project Link**: [https://github.com/iahmadiqbal/jooblie](https://github.com/iahmadiqbal/jooblie)

---

## 🙏 Acknowledgments

- [React](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

---

**Made with ❤️ by Ahmad Iqbal**
