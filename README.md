# Finance Expense Tracker App

A full-stack web application for tracking personal and business expenses, built with FastAPI (Python) for the backend and Next.js (React + TypeScript) for the frontend.
 and PostgreSQL as the database (via Supabase or your own Postgres instance).

---

## Features

- User authentication (JWT, secure login/signup)
- Add, edit, delete, and view expenses
- Categorize expenses
- Analytics dashboard (monthly totals, category breakdowns)
- Responsive, modern UI with Tailwind CSS
- Secure handling of sensitive data (no secrets in repo)

---

## Folder Structure

```
Finance_Expense_Tracker_app/
│
├── backend/                # FastAPI backend
│   ├── alembic/            # Database migrations
│   ├── app/                # Main backend application
│   │   ├── api/            # API routes
│   │   │   ├── deps.py     # Dependency overrides
│   │   │   └── v1/         # Versioned API endpoints
│   │   │       └── endpoints/
│   │   │           ├── analytics.py
│   │   │           ├── auth.py
│   │   │           ├── categories.py
│   │   │           ├── expenses.py
│   │   │           └── users.py
│   │   ├── core/           # Config, DB, security
│   │   ├── crud/           # DB operations (CRUD)
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── tests/              # Backend tests
│   ├── requirements.txt    # Backend dependencies
│   └── alembic.ini         # Alembic config
│
├── frontend/               # Next.js frontend
│   ├── public/             # Static assets
│   ├── src/                # Source code
│   │   ├── app/            # Next.js app directory
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # API, auth, utils
│   │   ├── types/          # TypeScript types
│   │   └── ...             # Other frontend code
│   ├── package.json        # Frontend dependencies
│   ├── tailwind.config.js  # Tailwind CSS config
│   └── next.config.js      # Next.js config
│
├── docker-compose.yml      # Multi-container orchestration
├── requirements.txt        # Project-level dependencies
└── README.md               # Project documentation
```

---

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- Docker (optional, for containerized setup)

### Backend Setup (FastAPI)
1. Create a virtual environment:
   ```bash
   python -m venv .venv
   & .venv\Scripts\activate  # Windows
   # or
   source .venv/bin/activate # Linux/Mac
   ```
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Set up environment variables:
   - Copy `backend/.env.example` to `backend/.env` and fill in your secrets (DB URL, JWT secret, etc.)
4. Run database migrations:
   ```bash
   cd backend
   alembic upgrade head
   ```
5. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

### Frontend Setup (Next.js)
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Set up environment variables:
   - Copy `frontend/.env.example` to `frontend/.env.local` and set `NEXT_PUBLIC_API_URL=/api/v1`
3. Start the frontend server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Docker Setup (Optional)
1. Copy `.env.example` files and fill in secrets for both backend and frontend.
2. Run:
   ```bash
   docker-compose up --build
   ```

---

## Security & Best Practices
- **Sensitive files** (like `.env`, DB credentials, secrets) are excluded via `.gitignore` and never committed.
- Always use environment variables for secrets.
- Use HTTPS in production.

---

## License
MIT License

---

## Author
- Developed by [Ali Sajid]
- AI Engineer | Deep Learning | Computer Vision | GEN AI
- Contributions welcome!
