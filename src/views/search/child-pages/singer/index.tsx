import React, { memo, useEffect } from 'react'
import type { FC } from 'react'
import { useLocation } from 'react-router-dom'
import qs from 'query-string'
import { shallowEqual, useSelector } from 'react-redux'

import SingerItem from './c-cpns/singer-item'
import { SingerWrapper } from './style'

import { useAppDispatch } from '@/store'
import { fetchSearchSingerListAction, ISearchSinger } from '../../store/search'
import { IRootState } from '@/store'

const Singer: FC = () => {
  const location = useLocation()
  const { type, song } = qs.parse(location.search) as {
    type?: string | number
    song?: string
  }

  const dispatch = useAppDispatch()

  // 获取歌手列表（匹配 search.ts 的 state 结构）
  const { singerList } = useSelector(
    (state: IRootState) => ({
      singerList: state.search.singerList as ISearchSinger[]
    }),
    shallowEqual
  )

  useEffect(() => {
    const searchType = type ? Number(type) : 100 
    const searchSong = song || ''

    if (searchSong) {
      dispatch(fetchSearchSingerListAction(searchSong))
    }
  }, [dispatch, song, type])

  return (
    <SingerWrapper>
      {singerList.map((item) => (
        <SingerItem
          key={item.id}
          coverPic={item.picUrl || ''}
          singer={item.name}
        />
      ))}
    </SingerWrapper>
  )
}

export default memo(Singer)
