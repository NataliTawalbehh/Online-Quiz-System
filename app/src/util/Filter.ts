import DataObject from 'src/models/DataObject';
import { Option } from 'src/models/FilterModel';

export default interface Filter {
  page?: number;
  limit?: number;
  order_by?: OrderBy;
  group_by?: string;
  select?: string[];
  where?: Where[];
  relations?: string[];
  extra: DataObject;
  ignorePaginationCount?: boolean;
  count?: boolean;
}

export interface Where {
  by: string;
  operator: string | Option;
  value: string[] | string | number | boolean | Date | null | any;
  or?: Where[];
}

export interface OrderBy {
  by: string;
  order: 'ASC' | 'DESC';
}
