import { request } from '../request'

export function fetchActressPagedList(params?: Dto.ActressSearchOption) {
  return request<Dto.ActressList>({
    url: '/actress/list',
    method: 'post',
    data: params
  })
}

export function findActress(name: string) {
  return request<Dto.DbActress>({
    url: `/actress/${name}`,
    method: 'get'
  })
}

export function createActress(params: Dto.DbActress) {
  return request<boolean>({
    url: '/actress',
    method: 'post',
    data: params
  })
}

export function updateActress(params: Dto.DbActress) {
  return request<boolean>({
    url: `/actress/${params.name}`,
    method: 'post',
    data: params
  })
}

export function deleteActress(name: string) {
  return request<boolean>({
    url: `/actress/${name}`,
    method: 'delete'
  })
}
