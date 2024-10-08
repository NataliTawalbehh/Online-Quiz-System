import DataObject from 'src/models/DataObject';
import { LocalStorage } from 'quasar';
import FuncAsync from './FuncAsync';
import {QuizResults} from 'src/models/Test'

export default class GetAllQuizResults implements FuncAsync<DataObject, QuizResults[]> {
  async executeAsync(options?: DataObject): Promise<QuizResults[]> {
    try {
      if (!options) {
        options = {};
      }

      // جلب جميع نتائج الاختبارات من LocalStorage
      const allQuizResults = (LocalStorage.getItem('allQuizResults') || {}) as Record<string, QuizResults>;

      // إذا كان هناك نتائج، نعيد النتائج كقائمة (array)
      if (Object.keys(allQuizResults).length > 0) {
        const quizzes = Object.values(allQuizResults);
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

