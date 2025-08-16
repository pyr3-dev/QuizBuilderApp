import { Question } from './question.entity';

export class Quiz {
  id: string;
  title: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  questions: Question[];
}
