import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { QuestionType } from '../types/quiz';

const questionSchema = z.object({
  text: z.string().min(1, 'Question text is required'),
  type: z.enum([QuestionType.BOOLEAN, QuestionType.INPUT, QuestionType.CHECKBOX]),
  options: z.array(z.string()).optional(),
  correctAnswers: z.array(z.string()).optional(),
});

const quizSchema = z.object({
  title: z.string().min(1, 'Quiz title is required'),
  description: z.string().optional(),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
});

type QuizFormData = z.infer<typeof quizSchema>;

export default function CreateQuiz() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: '',
      description: '',
      questions: [{ text: '', type: QuestionType.BOOLEAN, options: [], correctAnswers: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const watchedQuestions = watch('questions');

  const onSubmit = async (data: QuizFormData) => {
    setIsSubmitting(true);
    try {
      const processedData = {
        ...data,
        questions: data.questions.map((question, index) => ({
          ...question,
          order: index,
          options: question.type === QuestionType.CHECKBOX ? question.options || [] : [],
          correctAnswers: question.correctAnswers || [],
        })),
      };

      await api.createQuiz(processedData);
      navigate('/quizzes');
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    append({ text: '', type: QuestionType.BOOLEAN, options: [], correctAnswers: [] });
  };

  const removeQuestion = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Quiz</h1>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quiz Title *
            </label>
            <input
              {...register('title')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter quiz title"
            />
            {errors.title && (
              <p className="text-red-600 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              {...register('description')}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter quiz description (optional)"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-gray-900">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Add Question
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-md font-medium text-gray-800">Question {index + 1}</h3>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text *
                    </label>
                    <input
                      {...register(`questions.${index}.text`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter question text"
                    />
                    {errors.questions?.[index]?.text && (
                      <p className="text-red-600 text-sm mt-1">
                        {errors.questions[index]?.text?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Type *
                    </label>
                    <select
                      {...register(`questions.${index}.type`)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value={QuestionType.BOOLEAN}>True/False</option>
                      <option value={QuestionType.INPUT}>Short Answer</option>
                      <option value={QuestionType.CHECKBOX}>Multiple Choice</option>
                    </select>
                  </div>

                  {watchedQuestions[index]?.type === QuestionType.CHECKBOX && (
                    <CheckboxOptions
                      questionIndex={index}
                      register={register}
                      watch={watch}
                    />
                  )}
                </div>
              </div>
            ))}

            {errors.questions && (
              <p className="text-red-600 text-sm">{errors.questions.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/quizzes')}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Quiz'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CheckboxOptions({
  questionIndex,
  register,
  watch,
}: {
  questionIndex: number;
  register: ReturnType<typeof useForm<QuizFormData>>['register'];
  watch: ReturnType<typeof useForm<QuizFormData>>['watch'];
}) {
  const [newOption, setNewOption] = useState('');
  const options = watch(`questions.${questionIndex}.options`) || [];

  const addOption = () => {
    if (newOption.trim()) {
      const currentOptions = watch(`questions.${questionIndex}.options`) || [];
      register(`questions.${questionIndex}.options`, {
        value: [...currentOptions, newOption.trim()],
      });
      setNewOption('');
    }
  };

  const removeOption = (optionIndex: number) => {
    const currentOptions = watch(`questions.${questionIndex}.options`) || [];
    const newOptions = currentOptions.filter((_: string, idx: number) => idx !== optionIndex);
    register(`questions.${questionIndex}.options`, { value: newOptions });
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Answer Options
      </label>
      <div className="space-y-2">
        {options.map((option: string, optionIndex: number) => (
          <div key={optionIndex} className="flex items-center space-x-2">
            <input
              type="text"
              value={option}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
            />
            <button
              type="button"
              onClick={() => removeOption(optionIndex)}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </button>
          </div>
        ))}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
            placeholder="Add option"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={addOption}
            className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}