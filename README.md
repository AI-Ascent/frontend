# AI Ascent Frontend

Modern Next.js frontend for AI-powered enterprise talent development platform with comprehensive admin management and user experience features.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

### Core User Pages
- **Dashboard**: Overview with metrics and quick actions
- **Feedback**: AI-powered feedback analysis, classification, and summarization
- **Onboarding**: Interactive onboarding management with progress tracking and finalization
- **Skills**: Personalized skill recommendations and development paths
- **Interested Skills**: Personal skill tracking and learning roadmap
- **Mentors**: AI-powered mentor matching based on improvement areas
- **Ask**: AI coordinator that leverages all specialized agents

### Admin Management System
- **Admin Dashboard**: KPI monitoring, skill trends, and feedback analytics
- **Admin Login**: Secure admin authentication portal
- **Onboarding Management**: Create and manage onboarding catalog items
- **Skill Management**: Create and manage skill catalog items with resources

### AI Agents Integration
- **Feedback Agent**: Sentiment analysis, bias filtering, and PII redaction
- **Onboard Agent**: Semantic search and personalized onboarding with interactive checklists
- **Skill Agent**: Learning path recommendations and resource curation
- **Mentor Agent**: Vector similarity matching for mentorship
- **Coordinator Agent**: Master AI coordinator orchestrating all agents

## Authentication System

### User Authentication
Enterprise-grade authentication with role-based access:

- **Token Storage**: JWT access tokens stored in localStorage
- **Auto-Authorization**: Bearer tokens automatically included in API requests
- **Session Management**: Token validation on app initialization
- **Role-Based Access**: Admin vs regular user permissions

### User Data Structure
```typescript
interface User {
  id: number;
  email: string;
  job_title: string;
  specialization: string;
  is_admin: boolean;  // Admin privilege flag
  name?: string;      // For backward compatibility
}
```

### Admin Authentication Flow
1. Admin users login through `/admin-login`
2. System checks `is_admin` flag from backend response
3. Admin users redirected to `/admin-dashboard`
4. Non-admin users redirected to regular `/login` with access denied message

## API Integration

### Authentication Endpoints
- `POST /api/login/` - User authentication with JWT and admin status
  - Request: `{ "email": "user@example.com", "password": "password" }`
  - Response: `{ "message": "Authentication successful.", "access_token": "jwt_token", "user": {...} }`

### Feedback Management
- `POST /api/add-feedback/` - Add employee feedback
- `POST /api/classify-feedback/` - Classify feedback sentiment and type
- `POST /api/summarise-feedback/` - Generate insights and recommendations

### Onboarding System
- `POST /api/onboard/create/` - Create new onboarding items (Admin)
- `POST /api/onboard/get/` - Get personalized onboarding checklist
- `POST /api/onboard/update/` - Update onboarding items (Admin)
- `POST /api/onboard/list/` - List all onboarding items (Admin)
- `POST /api/onboard/delete/` - Delete onboarding items (Admin)
- `POST /api/onboard/finalize/` - Finalize onboarding plan
- `POST /api/onboard/mark-checklist/` - Mark checklist items as completed
- `POST /api/onboard/check-finalization/` - Check finalization status
- `POST /api/onboard/get-finalized/` - Get finalized onboarding data

### Skills & Learning
- `POST /api/create-skill/` - Create skill development items (Admin)
- `POST /api/get-skill-recommendations/` - Get AI-powered skill recommendations
- `POST /api/update-skill/` - Update skill items (Admin)
- `POST /api/list-skills/` - List all skill items (Admin)
- `POST /api/delete-skill/` - Delete skill items (Admin)
- `POST /api/add-interested-skill/` - Add skills to personal interested list
- `POST /api/list-interested-skills/` - Get user's interested skills
- `POST /api/delete-interested-skill/` - Remove skills from interested list

### Mentorship
- `POST /api/find-mentors/` - Find mentors based on improvement areas

### Admin Analytics
- `POST /api/admin/kpi-data/` - Get KPI metrics and analytics
- `POST /api/admin/global-skill-trends/` - Get global skill trend data
- `POST /api/admin/global-negative-feedback-trends/` - Get negative feedback trends

## Key Features

### Onboarding Management
- **Interactive Checklists**: Users can mark tasks as completed with real-time progress tracking
- **Finalization System**: Once finalized, users cannot update the onboarding plan but can continue marking tasks
- **Progress Tracking**: Visual progress bars and completion percentages
- **Resource Access**: Curated resources for each onboarding item

### Skill Development Workflow
1. **Skill Discovery**: Users search for skills using the skill agent
2. **Add to Interested List**: Users can add recommended skills to their personal list
3. **Learning Roadmap**: Track progress and access resources for interested skills
4. **Admin Management**: HR admins can create and manage skill catalog items

### Admin Dashboard Features
- **KPI Monitoring**: Onboarding completion rates, feedback counts, PII redaction, security violations
- **Trend Analysis**: Global skill trends and negative feedback patterns
- **Data Visualization**: Charts and metrics for organizational insights
- **Real-time Updates**: Live data from backend analytics

### Error Handling & User Experience
- **Comprehensive Error Handling**: Specific handling for rate limits, AI agent errors, network issues
- **Toast Notifications**: User-friendly success and error messages
- **Loading States**: Progress indicators for all async operations
- **Fallback Responses**: Graceful degradation when AI agents are unavailable

## Project Structure

```
src/
├── app/                           # Next.js App Router pages
│   ├── dashboard/                # Main dashboard with metrics
│   ├── feedback/                 # Feedback analysis page
│   ├── onboarding/               # Interactive onboarding management
│   ├── skills/                   # Skill recommendations and discovery
│   ├── interested-skills/        # Personal skill tracking
│   ├── mentors/                  # Mentor matching
│   ├── assistant/                # AI coordinator (Ask page)
│   ├── admin/                    # Admin panel navigation
│   ├── admin-login/              # Admin authentication portal
│   ├── admin-dashboard/          # Admin analytics and KPI dashboard
│   ├── admin-onboarding/         # Admin onboarding management
│   ├── admin-skills/             # Admin skill management
│   ├── login/                    # User authentication page
│   └── page.tsx                  # Landing page
├── components/                   # Reusable UI components
│   ├── Navigation.tsx            # Main navigation component
│   └── Toast.tsx                 # Global toast notification system
├── contexts/                     # React contexts
│   ├── AuthContext.tsx           # User authentication state management
│   └── AdminAuthContext.tsx     # Admin authentication wrapper
├── hooks/                        # Custom React hooks
│   └── useApiWithToast.ts        # API calls with toast notifications
└── lib/                         # Utilities and services
    └── api.ts                   # Comprehensive API client with JWT support
```

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: React Context API
- **Authentication**: JWT with localStorage
- **Icons**: Heroicons
- **UI Components**: Custom components with modern design
- **API Client**: Centralized fetch-based client with error handling
- **Deployment**: Vercel-ready

## Backend Integration

The frontend integrates with a comprehensive backend API that includes:

- **AI Agents**: LangChain-powered agents for feedback, onboarding, skills, mentorship, and coordination
- **HuggingFace Models**: Embeddings, sentiment analysis, hate speech detection, prompt injection detection
- **Database**: User management, feedback storage, onboarding tracking, skill catalogs
- **Analytics**: KPI tracking, trend analysis, organizational insights

## Development Team

**Developed by:**
- **Chanwoo Song** (Data Science @ NTU) - [GitHub](https://github.com/chanthr)
- **Yash Raj** (Computer Science @ NTU) - [GitHub](https://github.com/ryash072007)
- **Nestor Zhang Ruizhe** (Computer Science @ NTU) - [GitHub](https://github.com/Nestor-os)
- **Adrian** (Data Science @ NTU)
- **Yanxi** (Computer Science @ NTU)

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   npm start
   ```

4. **Access the Application**
   - Main App: [http://localhost:3000](http://localhost:3000)
   - Admin Portal: [http://localhost:3000/admin-login](http://localhost:3000/admin-login)

## Usage Guide

### For Regular Users
1. Login through the main login page
2. Access personalized onboarding, skill recommendations, and feedback analysis
3. Use the AI coordinator for comprehensive assistance
4. Track interested skills and build learning roadmaps

### For Admin Users
1. Login through the admin portal (`/admin-login`)
2. Access admin dashboard for organizational insights
3. Manage onboarding catalogs and skill items
4. Monitor KPI metrics and trends

## Contributing

This project follows modern React and Next.js best practices with comprehensive TypeScript typing and error handling.