import DataObject from './DataObject';

// export interface Options {
//   text: string;
//   correct: boolean;
// }
// export interface Question {
//   question: string;
//   multipleChoices: boolean;
//   point:number;
//   options: Options []
// }
// export interface StudentInfo {
//   username: string;
//   email: string;
//   resultQuiz:[]
// }

// export interface ResultQuiz{
//   id: number;
//   date: string;
//   description: string;
//   name: string;
//   teacher: string;//local storage
//   points: number;
//   students: number;
//   start: string;
//   end: string;
//   status: string;
//   totalQuestion: number;
//   totalPoint:number
//   questions:Question[]

// }

// export interface Quiz extends DataObject {
//   id: number;
//   date: string;
//   description: string;
//   name: string;
//   teacher: string;//local storage
//   points: number;
//   students: number;
//   studentInfo:string;//array of object
//   start: string;
//   end: string;
//   status: string;
//   totalQuestion: number;
//   totalPoint:number
//   questions:Question[]
// }

export interface Question {
  question:string;
  multipleChoices: boolean;
  point:number;
  options: {
    text: string;
    correct: boolean;
  }[];

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
  }

  interface User {
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
  }[];}
