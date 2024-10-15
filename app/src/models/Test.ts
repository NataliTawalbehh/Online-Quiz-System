import DataObject from './DataObject';

export interface Question {
  question:string;
  multipleChoices: boolean;
  point:number;
  options: {
    text: string;
    correct: boolean;
  }[];
  startTime: string; // وقت بداية السؤال
  endTime: string;
  }


  export interface Quiz {
  id: number;
  date: string;
  description: string;
  name: string;
  teacher: string;//local storage
  points: number;
  students: number;
  start: string;
  end: string;
  status: string;
  totalQuestion: number;
  totalPoint:number
  questions:Question[]
  quizStartedAt?: number;
  }

  export interface User {
    username: string;
    email: string;
    password: string;
    isTeacher: boolean;
    role: string;
  }
export interface QuizResults extends DataObject {
  name: User;
  quizzes: {
    quiz: Quiz;
    score: number;
    questions: Question[];
    answer: DataObject;
    selectedOption: DataObject;
    startTimeQuiz: string;
    endTimeQuiz: string;
    name: string;
  }[];}
