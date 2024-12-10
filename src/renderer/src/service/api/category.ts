import { request } from '../request'

export function fetchCategoryPagedList(params?: Dto.DbCategoryQuery) {
  return request<Dto.CategoryList>({
    url: '/category/list',
    method: 'post',
    data: params
  })
}

export function getCategoryTotalCount(type: string) {
  return request<number>({
    url: `/category/count/${type}`,
    method: 'get'
  })
}

export function findCategory(key: string) {
  return request<Dto.DbCategory>({
    url: `/category/${key}`,
    method: 'get'
  })
}

export function createCategory(params: Dto.DbCategory) {
  return request<boolean>({
    url: '/category',
    method: 'post',
    data: params
  })
}

export function updateCategory(params: Dto.DbCategory) {
  return request<boolean>({
    url: `/category/${params.key}`,
    method: 'post',
    data: params
  })
}

export function deleteCategory(key: string) {
  return request<boolean>({
    url: `/category/${key}`,
    method: 'delete'
  })
}
