import { request } from '../request'

export function fetchMoviePagedList(params: Dto.DbMovieQuery) {
  return request<Dto.MovieList>({
    url: '/movie/list',
    method: 'post',
    data: params
  })
}

export function getTotalFileSize() {
  return request<number>({
    url: `/movie_total_file_size`,
    method: 'get'
  })
}
export function getTotalVideoCount() {
  return request<number>({
    url: `/movie_total_video_count`,
    method: 'get'
  })
}

export function findMovie(num: string) {
  return request<Dto.DbMovie>({
    url: `/movie/${num}`,
    method: 'get'
  })
}

export function createMovie(params: Dto.DbMovie) {
  return request<boolean>({
    url: '/movie',
    method: 'post',
    data: params
  })
}

export function updateMovie(params: Dto.DbMovie) {
  return request<boolean>({
    url: `/movie/${params.num}`,
    method: 'post',
    data: params
  })
}

export function deleteMovie(num: string) {
  return request<boolean>({
    url: `/movie/${num}`,
    method: 'delete'
  })
}
