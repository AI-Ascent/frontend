# AI Ascent Frontend

Modern Next.js frontend for AI-powered talent development platform.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## API Endpoints

### Authentication
- `POST /api/login/` - User login

### Feedback Management  
- `POST /api/add-feedback/` - Add feedback
- `POST /api/classify-feedback/` - Classify feedback
- `POST /api/summarise-feedback/` - Summarize feedback

### Onboarding
- `POST /api/onboard/create/` - Create onboarding item
- `POST /api/onboard/get/` - Get personalized onboarding

### Skills
- `POST /api/create-skill/` - Create skill item
- `POST /api/get-skill-recommendations/` - Get skill recommendations

## Project Structure

```
src/
├── app/                 # Pages (dashboard, feedback, onboarding, skills)
├── components/          # Reusable components
├── contexts/           # React contexts (Auth)
└── lib/               # Utilities (API client)
```