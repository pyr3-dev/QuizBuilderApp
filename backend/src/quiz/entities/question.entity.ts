import { QuestionType } from '../dto/create-quiz.dto';

export class Question {
  id: string;
  text: string;
  type: QuestionType;
  options: string[];
  correctAnswers: string[];
  quizId: string;
  order: number;
}
