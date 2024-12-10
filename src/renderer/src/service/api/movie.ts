import { request } from '../request'

export function fetchMoviePagedList(params: Dto.MovieSearchOption) {
  return request<Dto.MovieList>({
    url: '/movie/list',
    method: 'post',
    data: params
  })
}
export function findAllActress() {
  return request<Array<Dto.DbMovie>>({
    url: '/movie/all_actress',
    method: 'post'
  })
}

export function findAllStudio() {
  return request<Array<Dto.DbMovie>>({
    url: '/movie/all_studio',
    method: 'post'
  })
}
export function findAllSeries() {
  return request<Array<Dto.DbMovie>>({
    url: '/movie/all_series',
    method: 'post'
  })
}
export function findAllDirector() {
  return request<Array<Dto.DbMovie>>({
    url: '/movie/all_director',
    method: 'post'
  })
}
export function findAllTags() {
  return request<Array<Dto.DbMovie>>({
    url: '/movie/all_tags',
    method: 'post'
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
    url: `/movie_total_count`,
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
