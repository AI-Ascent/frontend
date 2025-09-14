# AI Ascent Frontend

Modern Next.js frontend for AI-powered enterprise talent development platform.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

### Core Pages
- **Dashboard**: Overview with metrics and quick actions
- **Feedback**: AI-powered feedback analysis and classification
- **Onboarding**: Interactive onboarding management with progress tracking
- **Skills**: Personalized skill recommendations and development paths
- **Mentors**: AI-powered mentor matching based on improvement areas
- **Ask**: AI coordinator that leverages all specialized agents
- **Admin**: Onboarding item creation and system management

### AI Agents
- **Feedback Agent**: Sentiment analysis and bias filtering
- **Onboard Agent**: Semantic search and personalized onboarding
- **Skill Agent**: Learning path recommendations and resource curation
- **Mentor Agent**: Vector similarity matching for mentorship
- **Coordinator Agent**: Master AI coordinator orchestrating all agents

## Logo Implementation

The AI Ascent logo is integrated throughout the application:

- **Navigation**: Image logo with "AI Ascent" text
- **Landing Page**: Header logo with company branding
- **Favicon**: Browser tab icon
- **Location**: `/public/images/logo.png`

Logo specifications:
- Format: PNG, JPG, or SVG
- Recommended size: 40x40px for navigation, 200x80px for landing page
- Styling: Rounded corners with shadow effects

## JWT Authentication

Enterprise-grade authentication system:

- **Token Storage**: Access tokens stored in localStorage
- **Auto-Authorization**: Bearer tokens automatically included in API requests
- **Session Management**: Token validation on app initialization
- **Secure Logout**: Complete token cleanup on logout

### User Data Structure
```typescript
interface User {
  id: number;
  email: string;
  job_title: string;
  specialization: string;
  name?: string; // For backward compatibility
}
```

## API Endpoints

### Authentication
- `POST /api/login/` - User authentication with JWT
  - Request: `{ "email": "user@example.com", "password": "password" }`
  - Response: `{ "message": "Authentication successful.", "access_token": "jwt_token", "user": {...} }`

### Feedback Management  
- `POST /api/add-feedback/` - Add employee feedback
- `POST /api/classify-feedback/` - Classify feedback sentiment and type
- `POST /api/summarise-feedback/` - Generate insights and recommendations

### Onboarding
- `POST /api/onboard/create/` - Create new onboarding items (Admin)
- `POST /api/onboard/get/` - Get personalized onboarding checklist

### Skills
- `POST /api/create-skill/` - Create skill development items
- `POST /api/get-skill-recommendations/` - Get AI-powered skill recommendations

### Mentorship
- `POST /api/find-mentors/` - Find mentors based on improvement areas

## Development Team

**Developed by:**
- **Chanwoo Song** (Data Science @ NTU) - [GitHub](https://github.com/chanthr)
- **Yash Raj** (Computer Science @ NTU) - [GitHub](https://github.com/ryash072007)
- **Nestor Zhang Ruizhe** (Computer Science @ NTU) - [GitHub](https://github.com/Nestor-os)
- **Adrian** (Data Science @ NTU)
- **Yanxi** (Computer Science @ NTU)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Main dashboard with metrics
│   ├── feedback/          # Feedback analysis page
│   ├── onboarding/        # Onboarding management
│   ├── skills/           # Skill development recommendations
│   ├── mentors/          # Mentor matching
│   ├── assistant/        # AI coordinator (Ask page)
│   ├── admin/           # Admin panel for system management
│   ├── login/           # Authentication page
│   └── page.tsx         # Landing page
├── components/           # Reusable UI components
│   └── Navigation.tsx    # Main navigation component
├── contexts/            # React contexts
│   └── AuthContext.tsx   # Authentication state management
└── lib/                 # Utilities and services
    └── api.ts           # API client with JWT support
```

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Authentication**: JWT with localStorage
- **Icons**: Heroicons
- **Deployment**: Vercel-ready