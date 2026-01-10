export type ComboList = {
  value: string
  label: string
}

export type ResponseData<T> = {
  data: T
}

export type PaginatedApiResponse<T> = {
  data: T
  page: number
  pages: number
  itemsPerPage: number
  hasNext: boolean
  hasPrev: boolean
  currentItemsInPage: number
  totalCount: number
}

// todo: Re-work/delete/re-think the bottom types

export type CommonApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

// export type PaginatedApiResponse<T> = CommonApiResponse<Array<T>> & {
//   page: number
//   pages: number
//   itemsPerPage: number
//   totalCount: number
// }
