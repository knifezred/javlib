import { request } from '../request'
export function fetchUserPagedList(params?: Dto.UserSearchParams) {
  return request<Dto.UserList>({
    url: '/user/list',
    method: 'post',
    data: params
  })
}

export function findUser(id: number) {
  return request<Dto.UserDTO>({
    url: `/user/${id}`,
    method: 'get'
  })
}

export function createUser(params: Dto.UserModifyDTO) {
  return request<boolean>({
    url: '/user',
    method: 'post',
    data: params
  })
}

export function updateUser(params: Dto.UserModifyDTO) {
  return request<boolean>({
    url: `/user/${params.id}`,
    method: 'post',
    data: params
  })
}

export function deleteUser(id: number) {
  return request<boolean>({
    url: `/user/${id}`,
    method: 'delete'
  })
}

export function batchDeleteUser(ids: number[]) {
  return request<boolean>({
    url: `/user/batch-delete`,
    method: 'delete',
    data: { ids }
  })
}
