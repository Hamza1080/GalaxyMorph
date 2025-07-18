for backend
pip install flask flask-cors tensorflow numpy pillow opencv-python pandas scikit-learn langchain-google-genai langchain-community faiss-cpu

for frontend:
npm install


npx create-next-app@latest frontend
or
npx create-next-app@latest galaxy-frontend
(when prompted)
Would you like to use TypeScript? → Yes
Would you like to use ESLint? → Yes
Would you like to use Tailwind CSS? → Yes
Would you like to use `src/` directory? → No
Would you like to use App Router? → Yes
Would you like to customize the default import alias? → No


cd frontend or cd galaxy-frontend
npm install lucide-react @radix-ui/react-tabs @radix-ui/react-slot class-variance-authority clsx tailwind-merge tailwindcss-animate
npx shadcn@latest init
(when prompted)
### Detailed Guide to Set Up and Run the Frontend

Let me provide a complete, step-by-step guide to set up and run the Next.js frontend from scratch.

## Step 1: Create a New Next.js Project

First, let's create a fresh Next.js project:

```shellscript
# Create a new Next.js project
npx create-next-app@latest galaxy-frontend
```

When prompted, select the following options:

- Would you like to use TypeScript? → Yes
- Would you like to use ESLint? → Yes
- Would you like to use Tailwind CSS? → Yes
- Would you like to use `src/` directory? → No
- Would you like to use App Router? → Yes
- Would you like to customize the default import alias? → No


## Step 2: Navigate to the Project Directory

```shellscript
cd galaxy-frontend
```

## Step 3: Install Required Dependencies

```shellscript
# Install UI components and icons
npm install lucide-react @radix-ui/react-slot @radix-ui/react-tabs class-variance-authority clsx tailwind-merge tailwindcss-animate
```

## Step 4: Set Up shadcn/ui Components

We need to set up the shadcn/ui components:

```shellscript
# Install shadcn CLI
npx shadcn@latest init
```

When prompted, select:

- Would you like to use TypeScript? → Yes
- Which style would you like to use? → Default
- Which color would you like to use as base color? → Slate
- Where is your global CSS file? → app/globals.css
- Do you want to use CSS variables? → Yes
- Where is your tailwind.config.js located? → tailwind.config.ts
- Configure the import alias for components? → @/components
- Configure the import alias for utils? → @/lib/utils
- Are you using React Server Components? → Yes
npx shadcn@latest add button card input tabs

# Create components directory
mkdir -p components

-> Run backend
cd backend
python app.py




-> on seprate terminal
cd frontend
npm run dev