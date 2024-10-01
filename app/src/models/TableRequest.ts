export default interface TableRequest {
  /**
   * Pagination object
   */
  pagination: Pagination;
  /**
   * String/Object to filter table with (the 'filter' prop)
   */
  filter?: string | any;
  /**
   * Function to get a cell value
   * @param col Column name from column definitions
   * @param row The row object
   * @returns Parsed/Processed cell value
   */
  getCellValue: (col: any, row: any) => any;
}

export interface Pagination {
  /**
   * Column name (from column definition)
   */
  sortBy: string;
  /**
   * Is sorting in descending order?
   */
  descending: boolean;
  /**
   * Page number (1-based)
   */
  page: number;
  /**
   * How many rows per page? 0 means Infinite
   */
  rowsPerPage: number;

  rowsNumber?: number;
}
