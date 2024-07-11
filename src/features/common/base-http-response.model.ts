export interface IBaseHttpResponse<T> {
  data: T;
  message: string;
  code: number;
}

export interface IBaseHttpResponseList<T> {
  data: {
    items: T[];
    meta: {
      totalItems: number;
      itemCount: number;
      itemsPerPage: number;
      totalPages: number;
      currentPage: number;
    };
  };
  message: string;
  code: number;
}
