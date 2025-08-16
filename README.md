# Quiz Builder Application

A full-stack quiz creation platform where users can create custom quizzes with various question types, view all available quizzes, and view detailed quiz information.

## Features

- **Create Quizzes**: Build quizzes with multiple question types
- **Question Types**: 
  - Boolean (True/False)
  - Input (Short text answer)
  - Checkbox (Multiple choice)
- **Quiz Management**: View all quizzes, see quiz details, and delete quizzes
- **Responsive Design**: Mobile-friendly interface
- **Real-time Validation**: Form validation with error handling

## Tech Stack

### Backend
- **Node.js** with **NestJS** framework
- **TypeScript** for type safety
- **PostgreSQL** database
- **Prisma** ORM for database management
- **Class Validator** for input validation

### Frontend
- **React** with **TypeScript**
- **Vite** for fast development and building
- **React Router** for navigation
- **React Hook Form** with **Zod** for form management
- **Tailwind CSS** for styling

## Project Structure

```
quiz-builder/
├── backend/                 # NestJS API server
│   ├── src/
│   │   ├── quiz/           # Quiz module
│   │   │   ├── dto/        # Data Transfer Objects
│   │   │   ├── entities/   # Entity definitions
│   │   │   ├── quiz.controller.ts
│   │   │   ├── quiz.service.ts
│   │   │   └── quiz.module.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── .env.example
│   └── package.json
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── types/         # TypeScript type definitions
│   │   └── App.tsx
│   ├── .env.example
│   └── package.json
└── README.md
```

## Prerequisites

- **Node.js** (version 18 or higher)
- **PostgreSQL** database
- **npm** or **yarn** package manager

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd quiz-builder
```

### 2. Database Setup

1. Install and start PostgreSQL
2. Create a new database named `quiz_builder`
3. Create a user with appropriate permissions

```sql
CREATE DATABASE quiz_builder;
CREATE USER quiz_user WITH PASSWORD 'quiz_password';
GRANT ALL PRIVILEGES ON DATABASE quiz_builder TO quiz_user;
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials
# DATABASE_URL="postgresql://quiz_user:quiz_password@localhost:5432/quiz_builder?schema=public"

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Start the development server
npm run start:dev
```

The backend will be available at `http://localhost:3000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:3000

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

## API Endpoints

### Quiz Endpoints

- `POST /quizzes` - Create a new quiz
- `GET /quizzes` - Get all quizzes (summary)
- `GET /quizzes/:id` - Get quiz details
- `DELETE /quizzes/:id` - Delete a quiz

### Request/Response Examples

#### Create Quiz
```json
POST /quizzes
{
  "title": "Sample Quiz",
  "description": "A sample quiz for testing",
  "questions": [
    {
      "text": "Is TypeScript a superset of JavaScript?",
      "type": "BOOLEAN",
      "correctAnswers": ["true"]
    },
    {
      "text": "What is your favorite programming language?",
      "type": "INPUT"
    },
    {
      "text": "Which of these are JavaScript frameworks?",
      "type": "CHECKBOX",
      "options": ["React", "Vue", "Angular", "Django"],
      "correctAnswers": ["React", "Vue", "Angular"]
    }
  ]
}
```

## Sample Quiz Creation

To create a sample quiz for testing:

1. Navigate to the **Create Quiz** page
2. Fill in the quiz title and description
3. Add questions with different types:
   - **Boolean**: "Is the Earth round?"
   - **Input**: "What is the capital of France?"
   - **Checkbox**: "Which are programming languages?" with options: Python, JavaScript, HTML, CSS
4. Submit the form
5. View the created quiz in the quiz list

## Development

### Running Tests

```bash
# Backend tests
cd backend
npm run test

# Frontend tests (if implemented)
cd frontend
npm run test
```

### Code Quality

```bash
# Backend linting
cd backend
npm run lint

# Frontend linting
cd frontend
npm run lint
```

### Database Management

```bash
# View database in Prisma Studio
cd backend
npx prisma studio

# Reset database
npx prisma db reset

# Apply schema changes
npx prisma db push
```

## Production Deployment

### Backend Deployment

1. Set up a PostgreSQL database
2. Configure environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Build the application: `npm run build`
5. Start the production server: `npm run start:prod`

### Frontend Deployment

1. Configure the API base URL in environment variables
2. Build the application: `npm run build`
3. Serve the `dist` folder using a web server

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists

2. **Frontend API Connection Issues**
   - Verify backend is running on port 3000
   - Check CORS configuration
   - Verify API base URL in frontend `.env`

3. **Prisma Issues**
   - Run `npx prisma generate` after schema changes
   - Use `npx prisma db reset` to reset database

## Personal Touches

- **Enhanced UI/UX**: Clean, modern design with Tailwind CSS
- **Form Validation**: Comprehensive validation with error messages
- **Loading States**: Loading indicators for better user experience
- **Responsive Design**: Mobile-friendly interface
- **Dynamic Forms**: Add/remove questions and options dynamically
- **Delete Confirmation**: Confirmation dialogs for destructive actions
- **Error Handling**: Proper error handling and user feedback

## License

This project is for assessment purposes.