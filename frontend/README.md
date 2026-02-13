# U.D.A.A.N Frontend

U.D.A.A.N (Universal Digital Architecture for Accessible Nirmaan) Platform Frontend - React + Vite + TypeScript

## Technology Stack

- **UI Framework**: React 18
- **Build Tool**: Vite 5
- **Language**: TypeScript
- **Routing**: React Router
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **CSS**: Inline styles with CSS-in-JS support

## Project Structure

```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page components
│   ├── services/       # API service layer
│   ├── hooks/          # Custom React hooks
│   ├── context/        # Zustand stores
│   ├── types/          # TypeScript types
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Entry point
├── index.html         # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Environment Setup

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

```bash
npm run dev
```

App runs on `http://localhost:5173`

### Production Build

```bash
npm run build
npm preview
```

## Available Pages

- `/` - Home page
- `/login` - User login
- `/signup` - User registration
- `/dashboard` - User dashboard (protected)

## API Integration

### User Management

- Create user account
- List users (paginated)
- Get user details
- Update user profile
- Delete user

### Citizen Profiles

- Create citizen profile
- List profiles (paginated)
- Get profile details
- Update profile
- Delete profile

## Authentication

- Token stored in localStorage
- Auto-refresh on 401 responses
- Protected routes with authentication check

## Components

### Reusable Components

- `Layout` - Page wrapper with header/footer
- `Card` - Content container
- `Button` - Customizable button (primary, secondary, danger)
- `FormInput` - Text input with label and error display
- `Table` - Data table with configurable columns

### Custom Hooks

- `useUsers()` - User CRUD operations
- `useProfiles()` - Citizen profile operations
- `useLoading()` - Loading state and error handling
- `useAuthStore()` - Authentication state management

## Testing

```bash
npm test
npm test:ui
```

## Contributing

1. Follow TypeScript strict mode
2. Use functional components with hooks
3. Keep components small and focused
4. Add PropTypes or TypeScript interfaces
5. Write tests for new features

## License

Proprietary
