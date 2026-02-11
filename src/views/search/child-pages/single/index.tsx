import React, { memo, useEffect } from 'react'
import type { FC } from 'react'
import { useLocation } from 'react-router-dom'
import { shallowEqual, useSelector } from 'react-redux'
import qs from 'query-string'

import { formatMinuteSecond } from '@/utils/format'

import { useAppDispatch } from '@/store'
import { fetchSearchSongListAction, ISearchSong } from '../../store/search'
import { IRootState } from '@/store'

// 样式和组件导入
import { SingleSongWrapper } from './style'
import SingleSongItem from './c-cpns/single-song-item'

interface ISingleProps {
  [key: string]: any
}

const Single: FC<ISingleProps> = (props) => {
  const location = useLocation()
  const { song, type } = qs.parse(location.search) as {
    song?: string
    type?: string | number
  }

  const dispatch = useAppDispatch()

  const { searchSongList } = useSelector(
    (state: IRootState) => ({
      searchSongList: state.search.searchSongList as ISearchSong[]
    }),
    shallowEqual
  )

  // 根据歌曲名字发送网络请求
  useEffect(() => {
    // 参数校验和类型转换
    if (!song) return

    const searchType = type ? Number(type) : 1
    const searchSong = song.toString().trim()

    dispatch(fetchSearchSongListAction(searchSong))
  }, [dispatch, song, type])

  return (
    <SingleSongWrapper>
      {searchSongList.map((item) => (
        <SingleSongItem
          key={item.id}
          songId={item.id}
          songName={item.name}
          singer={item.artists[0]?.name || '未知歌手'}
          album={item.album?.name || '未知专辑'}
          duration={formatMinuteSecond(item.duration || 0)}
        />
      ))}
    </SingleSongWrapper>
  )
}

export default memo(Single)
