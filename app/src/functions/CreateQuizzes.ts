import DataObject from 'src/models/DataObject';
import { LocalStorage } from 'quasar';
import FuncAsync from './FuncAsync';
import {Quiz} from 'src/models/QuizzesModel'
// interface Question {
//   question: string;
//   multipleChoices: boolean;
//   point: number;
//   options: {
//     text: string;
//     correct: boolean;
//   }[];
// }

// interface Quiz {
//   id: number;
//   date: string;
//   description: string;
//   name: string;
//   teacher: string;
//   points: number;
//   students: number;
//   start: string;
//   end: string;
//   status: string;
//   totalQuestion: number;
//   totalPoint: number;
//   questions: Question[];
// }

export default class CreateQuizzes implements FuncAsync<DataObject, Quiz[]> {
  async executeAsync(options?: DataObject): Promise<Quiz[]> {
    try {
      if (!options || !Array.isArray(options.quizzes)) {
        console.error('No quizzes provided to Create or quizzes is not an array.');
        return [];
      }

      LocalStorage.set('quizzes', options.quizzes);

      console.log('Quizzes Create successfully:', options.quizzes);
      return options.quizzes;
    } catch (error) {
      // Log any errors that occur during execution
      console.error('Error - ', error);
      // Return a rejected Promise with the error
      return Promise.reject(error);
    }
  }
}
