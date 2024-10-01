import DataObject from './DataObject';

export interface FilterModel {
  value: any;
  label: string;
  dataType: DataType;
  options?: Array<Option | DataObject> | undefined | null;
  optionsMultiple?: boolean;
  api?: Api;
}

export interface Api {
  endPoint: string;
  loading?: boolean;
  option: Option;
}

export interface Option {
  label: string;
  value: string;
}

export enum DataType {
  STRING = 'STRING',
  NUMBER = 'NUMBER',
  DATE = 'DATE',
  BOOLEAN = 'BOOLEAN',
  ENUM = 'ENUM',
  SELECT = 'SELECT',
  SELECT_API = 'SELECT_API',
}
