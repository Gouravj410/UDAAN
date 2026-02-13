export interface PaginationParams {
  page: number;
  limit: number;
  sort?: string;
  order?: 'ASC' | 'DESC';
}

export interface FilterParams {
  [key: string]: string | number | boolean | undefined;
}

export class QueryBuilder {
  static buildOffset(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static calculateTotalPages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }

  static validatePagination(page: number, limit: number): void {
    if (page < 1) throw new Error('Page must be >= 1');
    if (limit < 1 || limit > 100) throw new Error('Limit must be between 1 and 100');
  }
}
