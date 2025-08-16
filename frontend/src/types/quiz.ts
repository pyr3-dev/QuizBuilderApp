export enum QuestionType {
  BOOLEAN = 'BOOLEAN',
  INPUT = 'INPUT',
  CHECKBOX = 'CHECKBOX',
}

export interface Question {
  id?: string;
  text: string;
  type: QuestionType;
  options?: string[];
  correctAnswers?: string[];
  order?: number;
}

export interface Quiz {
  id?: string;
  title: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  questions: Question[];
}

export interface QuizListItem {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  _count: {
    questions: number;
  };
}