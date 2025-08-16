import type { Quiz, QuizListItem } from "../types/quiz";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const api = {
  async createQuiz(quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quiz> {
    const response = await fetch(`${API_BASE_URL}/quizzes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(quiz),
    });

    if (!response.ok) {
      throw new Error('Failed to create quiz');
    }

    return response.json();
  },

  async getQuizzes(): Promise<QuizListItem[]> {
    const response = await fetch(`${API_BASE_URL}/quizzes`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch quizzes');
    }

    return response.json();
  },

  async getQuiz(id: string): Promise<Quiz> {
    const response = await fetch(`${API_BASE_URL}/quizzes/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch quiz');
    }

    return response.json();
  },

  async deleteQuiz(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/quizzes/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete quiz');
    }
  },
};