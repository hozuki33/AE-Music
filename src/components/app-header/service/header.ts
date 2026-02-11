import hyRequest from '@/service'

export function getSearchSongData(keywords: string, limit = 6, type = 1) {
  return hyRequest.get({
    url: '/search',
    params: {
      keywords,
      limit,
      type
    }
  })
}
