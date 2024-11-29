import { request } from '../request'

export function fetchStoragePagedList(params?: Dto.DbStorage) {
  return request<Dto.UserList>({
    url: '/storage/list',
    method: 'post',
    data: params
  })
}

export function findStorage(key: string) {
  return request<Dto.DbStorage>({
    url: `/storage/${key}`,
    method: 'get'
  })
}

export function createStorage(params: Dto.DbStorage) {
  return request<boolean>({
    url: '/storage',
    method: 'post',
    data: params
  })
}

export function updateStorage(params: Dto.DbStorage) {
  return request<boolean>({
    url: `/storage/${params.key}`,
    method: 'post',
    data: params
  })
}

export function deleteStorage(key: string) {
  return request<boolean>({
    url: `/storage/${key}`,
    method: 'delete'
  })
}
