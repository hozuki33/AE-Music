import hyRequest from '@/service'

export function getSongDetail(ids: number) {
  return hyRequest.get({
    url: '/song/detail',
    params: {
      ids
    }
  })
}
export function getSongLyric(id: number) {
  return hyRequest.get({
    url: '/lyric',
    params: {
      id
    }
  })
}

/**
 * 获取歌曲 URL
 * @param id 歌曲 ID
 * @param br 码率（默认 999000 = 最大码率）
 * @returns 播放 URL + 试听信息
 */
export function getSongPlayUrl(id: number, br = 999000) {
  return hyRequest.get({
    url: '/song/url',
    params: { id, br }
  })
}