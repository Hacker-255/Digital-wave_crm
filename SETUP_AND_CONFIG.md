# Comprehensive Configuration & Setup Guide

## Project: Digital Wave CRM

### Environment Setup

#### 1. Prerequisites
- **Node.js**: 18.x or 20.x (Check: `node --version`)
- **npm**: 9.x or higher (Check: `npm --version`)
- **MongoDB**: Optional (for persistence; gracefully degrades without it)
  - Local: MongoDB running on `localhost:27017`
  - Cloud: MongoDB Atlas connection string

#### 2. Environment Variables

Create a `.env` file in the project root:

```env
# Frontend
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxx

# Backend
PORT=4200
HOST=127.0.0.1
CLIENT_ORIGIN=http://127.0.0.1:5173
MONGODB_URI=mongodb://127.0.0.1:27017/digital-wave-crm
OPENAI_API_KEY=sk_xxxx (optional)
```

#### 3. Installation & Development

```bash
# Install dependencies
npm install

# Type checking
npm run typecheck

# Start development (both client & server)
npm run dev

# Client only (http://localhost:5173)
npm run dev:client

# Server only (http://localhost:4200)
npm run dev:server

# Production build
npm run build

# Preview production build
npm run preview
```

### Architecture Overview

#### Frontend (React + Vite)
- **Location**: `src/`
- **Tech Stack**: React 18, TypeScript, Tailwind CSS, Zustand (state), React Flow
- **Key Components**:
  - `AppShell.tsx` - Main landing & navigation
  - `WorkflowPage.tsx` - Workflow management UI
  - `WorkflowBuilder.tsx` - Visual workflow editor
- **State Management**: Zustand (`src/stores/workflowStore.ts`)
- **API Client**: `src/lib/api.ts`

#### Backend (Express + Node.js)
- **Location**: `server/src/`
- **Tech Stack**: Express, Mongoose, TypeScript
- **Routes**:
  - `GET /api/health` - Health check
  - `GET/POST/PATCH/DELETE /api/workflows` - Workflow CRUD
  - `POST /api/workflows/:id/run` - Execute workflow
  - `POST /api/ai/ask` - AI assistant (OpenAI)
- **Models**: Workflow, WorkflowRun, WorkflowVersion

### Key Features Implemented

✓ Workflow CRUD operations (Create, Read, Update, Delete)
✓ Workflow versioning and restoration
✓ Visual workflow builder with React Flow
✓ Workflow execution engine (node ordering, condition handling)
✓ AI-powered suggestions (OpenAI integration)
✓ Authentication-ready (Clerk integration)
✓ Responsive UI with Tailwind CSS
✓ Fallback/offline support

### Testing & Validation

#### Type Safety
```bash
npm run typecheck
```

#### Build Verification
```bash
npm run build
```

#### Manual Testing Checklist
- [ ] Create a new workflow
- [ ] Edit workflow name and description
- [ ] Add nodes to workflow
- [ ] Connect nodes with edges
- [ ] Save workflow
- [ ] Run workflow
- [ ] View workflow versions
- [ ] Restore previous version
- [ ] Duplicate workflow
- [ ] Toggle workflow status (active/draft)
- [ ] Delete/archive workflow
- [ ] Test AI ask endpoint (if OPENAI_API_KEY set)

### Known Issues & Workarounds

1. **MongoDB Optional**
   - API gracefully degrades if MongoDB is unavailable
   - All operations will return 503 if DB is down
   - Frontend has fallback offline support

2. **Clerk Authentication**
   - Optional (app works without it)
   - If missing, GitHub/Email buttons appear as placeholders

3. **OpenAI API**
   - Optional (AI features fall back to defaults)
   - Requires `OPENAI_API_KEY` environment variable

### File Structure

```
digital-wave-website-main/
├── src/                           # Frontend
│   ├── components/
│   │   ├── AppShell.tsx          # Main layout & landing
│   │   └── workflows/
│   │       └── WorkflowBuilder.tsx # Visual editor
│   ├── pages/
│   │   └── WorkflowPage.tsx       # Workflow management
│   ├── hooks/
│   │   └── useWorkflow.ts         # Workflow state hook
│   ├── stores/
│   │   └── workflowStore.ts       # Zustand state
│   ├── lib/
│   │   ├── api.ts                 # API client
│   │   └── types.ts               # TypeScript types
│   ├── assets/                    # Images, logos
│   ├── App.tsx                    # App component
│   ├── main.tsx                   # React entry
│   ├── vite-env.d.ts              # Vite types
│   └── styles.css                 # Tailwind styles
│
├── server/src/                    # Backend
│   ├── controllers/
│   │   └── workflowController.ts  # Route handlers
│   ├── models/
│   │   ├── Workflow.ts
│   │   ├── WorkflowRun.ts
│   │   └── WorkflowVersion.ts
│   ├── routes/
│   │   ├── workflowRoutes.ts
│   │   └── aiRoutes.ts
│   ├── services/
│   │   └── workflowEngine.ts      # Execution logic
│   └── index.ts                   # Express app entry
│
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite config
├── tailwind.config.ts             # Tailwind config
├── .env                           # Environment (do not commit)
└── index.html                     # HTML entry
```

### Performance Optimization Tips

1. **API Response Caching**
   - Consider adding cache headers to workflow endpoints
   - Cache versioned workflows on the client

2. **Database Indexing**
   - Add indexes to `Workflow.workflowId` for faster queries
   - Index `WorkflowRun.workflowId` and `createdAt`

3. **Bundle Optimization**
   - React Flow is large (~300KB) - consider lazy loading
   - Code split workflow builder component

### Security Best Practices

1. **Environment Variables**
   - Never commit `.env` with real credentials
   - Use `.env.local.example` as template
   - Rotate all API keys periodically

2. **API Security**
   - Add rate limiting to `/api/ai/ask`
   - Validate all request payloads
   - Implement request size limits (currently 2MB)

3. **Database**
   - Use strong MongoDB credentials
   - Enable authentication
   - Consider encryption at rest

4. **CORS**
   - Currently allows configured CLIENT_ORIGIN only
   - Update in production with exact domain

### Deployment

#### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

#### Backend (Heroku/Railway/Render)
```bash
# Ensure .env has production values
npm install
npm run build
node dist/server/src/index.js
```

#### Environment Variables Checklist
- [ ] VITE_CLERK_PUBLISHABLE_KEY
- [ ] MONGODB_URI (production DB)
- [ ] PORT (default 4200)
- [ ] CLIENT_ORIGIN (frontend URL)
- [ ] OPENAI_API_KEY (optional)

### Troubleshooting

#### "Cannot find module 'reactflow'"
```bash
npm install
npm run typecheck
```

#### "MongoDB connection failed"
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- API continues without DB (graceful degradation)

#### "Type errors in WorkflowBuilder"
- Run `npm run typecheck` to see all errors
- Check that `reactflow` package is installed

#### "API not responding"
- Check server logs: `npm run dev:server`
- Verify port 4200 is not in use
- Check `/api/health` endpoint

### Contributors & Support

For issues, questions, or contributions, please refer to the project documentation or create an issue in the repository.
