import DataObject from 'src/models/DataObject';
import { LocalStorage } from 'quasar';
import FuncAsync from './FuncAsync';

interface User {
  username: string;
  email: string;
  password: string;
  isTeacher: boolean;
  role: 'student' | 'teacher';
}

export default class GetUsers implements FuncAsync<DataObject, User[]> {
  async executeAsync(options?: DataObject): Promise<User[]> {
    try {
      if (!options) {
        options = {};
      }

      const usersString = (LocalStorage.getItem('users') || []) as User[];

      if (usersString) {
        const quizzes = usersString;
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
