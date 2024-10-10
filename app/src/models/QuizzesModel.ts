import DataObject from './DataObject';

export interface Question {
  question:string;
  multipleChoices: boolean;
  point:number;
  options: {
    text: string;
    correct: boolean;
  }[];

  }


export interface Quiz extends DataObject {
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
  };
