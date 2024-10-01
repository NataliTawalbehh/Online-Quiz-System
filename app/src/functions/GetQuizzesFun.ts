import DataObject from 'src/models/DataObject';
import { LocalStorage } from 'quasar';
import FuncAsync from './FuncAsync';

interface Question {

  question:string;
  multipleChoices: boolean;
  point:number;
  options: {
    text: string;
    correct: boolean;
  };

  }


  interface Quiz {
  id: number;
  date: string;
  description: string;
  name: string;
  teacher: string;
  points: number;
  students: number;
  start: string;
  end: string;
  status: string;
  totalQuestion:number;
  questions:Question[]
  }



export default class GetQuizzesFun implements FuncAsync<DataObject, Quiz[]> {
  async executeAsync(options?: DataObject): Promise<Quiz[]> {
    try {

      if (!options) {
        options = {};
      }

      const quizzesString = (LocalStorage.getItem('quizzes') || []) as Quiz[];

      if (quizzesString) {
        const quizzes = quizzesString;
        console.log('Parsed quizzes:', quizzes);
        return quizzes;
      } else {
        console.log('There are no quizzes in LocalStorage');
        return [];
      }
    } catch (error) {
      // Log any errors that occur during execution
      console.error('Error - ', error);
      // Return a rejected Promise with the error
      return Promise.reject(error);
    }
  }
}


