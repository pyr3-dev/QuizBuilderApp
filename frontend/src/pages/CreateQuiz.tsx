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
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="glass-card p-8 mb-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-3">Create New Quiz</h1>
          <p className="text-gray-400 text-lg">Build an interactive quiz with multiple question types</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Quiz Title *
              </label>
              <input
                {...register('title')}
                type="text"
                className="w-full px-4 py-3 bg-mux-putty border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-mux-orange focus:border-transparent text-white placeholder-gray-500 transition-all duration-200"
                placeholder="Enter an engaging quiz title..."
              />
              {errors.title && (
                <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{errors.title.message}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="w-full px-4 py-3 bg-mux-putty border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-mux-orange focus:border-transparent text-white placeholder-gray-500 transition-all duration-200 resize-none"
                placeholder="Describe what this quiz is about (optional)..."
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Questions</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="bg-mux-gradient text-white px-6 py-3 rounded-lg hover:scale-105 transition-all duration-200 font-medium neon-glow flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Question</span>
              </button>
            </div>

            {fields.map((field, index) => (
              <div key={field.id} className="glass-card p-6 mb-6 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-mux-gradient rounded-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-medium text-white">Question {index + 1}</h3>
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(index)}
                      className="text-gray-500 hover:text-red-400 transition-colors duration-200 p-2 rounded-lg hover:bg-red-500/10"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Question Text *
                    </label>
                    <input
                      {...register(`questions.${index}.text`)}
                      type="text"
                      className="w-full px-4 py-3 bg-mux-light-putty border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-mux-pink focus:border-transparent text-white placeholder-gray-400 transition-all duration-200"
                      placeholder="What would you like to ask?"
                    />
                    {errors.questions?.[index]?.text && (
                      <p className="text-red-400 text-sm mt-2 flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errors.questions[index]?.text?.message}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Question Type *
                    </label>
                    <select
                      {...register(`questions.${index}.type`)}
                      className="w-full px-4 py-3 bg-mux-light-putty border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-mux-pink focus:border-transparent text-white transition-all duration-200"
                    >
                      <option value={QuestionType.BOOLEAN} className="bg-mux-putty">True/False</option>
                      <option value={QuestionType.INPUT} className="bg-mux-putty">Short Answer</option>
                      <option value={QuestionType.CHECKBOX} className="bg-mux-putty">Multiple Choice</option>
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

          <div className="flex justify-end space-x-4 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={() => navigate('/quizzes')}
              className="px-8 py-3 border border-white/20 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 focus:outline-none transition-all duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-mux-gradient text-white rounded-lg hover:scale-105 focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-semibold neon-glow flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Create Quiz</span>
                </>
              )}
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
    <div className="bg-mux-charcoal/50 p-4 rounded-lg border border-white/5">
      <label className="text-sm font-medium text-gray-300 mb-4 flex items-center space-x-2">
        <svg className="w-4 h-4 text-mux-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Answer Options</span>
      </label>
      <div className="space-y-3">
        {options.map((option: string, optionIndex: number) => (
          <div key={optionIndex} className="flex items-center space-x-3 group">
            <div className="w-2 h-2 bg-mux-pink rounded-full flex-shrink-0"></div>
            <input
              type="text"
              value={option}
              readOnly
              className="flex-1 px-3 py-2 bg-mux-light-putty border border-white/10 rounded-md text-white text-sm"
            />
            <button
              type="button"
              onClick={() => removeOption(optionIndex)}
              className="text-gray-500 hover:text-red-400 transition-colors duration-200 opacity-0 group-hover:opacity-100 p-1 rounded"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        <div className="flex items-center space-x-3 pt-2 border-t border-white/5">
          <div className="w-2 h-2 bg-gray-500 rounded-full flex-shrink-0"></div>
          <input
            type="text"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addOption())}
            placeholder="Type new option..."
            className="flex-1 px-3 py-2 bg-mux-light-putty border border-white/10 rounded-md focus:outline-none focus:ring-2 focus:ring-mux-cyan focus:border-transparent text-white placeholder-gray-500 text-sm transition-all duration-200"
          />
          <button
            type="button"
            onClick={addOption}
            className="bg-mux-cyan text-white px-4 py-2 rounded-md hover:bg-mux-cyan/80 transition-colors duration-200 text-sm font-medium"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}