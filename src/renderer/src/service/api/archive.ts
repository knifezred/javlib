import { request } from '../request'
export function fetchArchivePagedList(params?: Dto.UserSearchParams) {
  return request<Dto.UserList>({
    url: '/archive/list',
    method: 'post',
    data: params
  })
}

export function findArchive(id: number) {
  return request<Dto.UserDTO>({
    url: `/archive/${id}`,
    method: 'get'
  })
}

export function createArchive(params: Dto.UserModifyDTO) {
  return request<boolean>({
    url: '/archive',
    method: 'post',
    data: params
  })
}

export function updateArchive(params: Dto.UserModifyDTO) {
  return request<boolean>({
    url: `/archive/${params.id}`,
    method: 'post',
    data: params
  })
}

export function deleteArchive(id: number) {
  return request<boolean>({
    url: `/archive/${id}`,
    method: 'delete'
  })
}

export function batchDeleteArchive(ids: number[]) {
  return request<boolean>({
    url: `/archive/batch-delete`,
    method: 'delete',
    data: { ids }
  })
}
