import DataObject from 'src/models/DataObject';
import { FuncType } from './FuncType';

// Define a generic interface `Func` that represents a function with a specific input and output type.
export default interface Func<T extends DataObject, R extends FuncType> {
  // Define a method `execute` that takes an input data of type `T` and returns a result of type `R`.
  execute: (data: T) => R;
}
