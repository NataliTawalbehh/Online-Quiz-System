import DataObject from 'src/models/DataObject';
import { FuncType } from './FuncType';

// Define a generic interface `FuncAsync` that represents an asynchronous function with a specific input and output type.
export default interface FuncAsync<T extends DataObject, R extends FuncType> {
  // Define a method `executeAsync` that takes an input data of type `T` and returns a Promise of type `R`.
  executeAsync: (data?: T) => Promise<R>;
}
