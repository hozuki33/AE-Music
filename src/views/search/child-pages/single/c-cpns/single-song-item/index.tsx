import React, { memo } from 'react'
import type { FC, MouseEvent } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

import { PlayCircleOutlined } from '@ant-design/icons'
import { message } from 'antd'

import { useAppDispatch } from '@/store'
import { fetchCurrentSongAction } from '@/views/discover/c-views/player/store/player' // 匹配 player.ts 的 action 名称
import { IRootState } from '@/store'

import { useAddPlaylist } from '@/hooks/change-music'

import { SingleSongItemWrapper } from './style'

interface ISingleSongItemProps {
  songId: number
  songName: string
  singer: string
  album: string
  duration: string
}

const SingleSongItem: FC<ISingleSongItemProps> = (props) => {
  const { songId, songName, singer, album, duration } = props

  const dispatch = useAppDispatch()

  const { playlist } = useSelector(
    (state: IRootState) => ({
      playlist: state.player.playSongList
    })
    // shallowEqual
  )

  const playMusic = () => {
    dispatch(fetchCurrentSongAction(songId))

    const audioElement = document.getElementById(
      'audio'
    ) as HTMLAudioElement | null
    if (audioElement) {
      audioElement.autoplay = true
    }
  }

  const addPlaylist = useAddPlaylist(playlist, message)

  const handleAddPlaylist = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    addPlaylist(e, songId)
  }

  return (
    <SingleSongItemWrapper>
      <div className="song-name">
        <PlayCircleOutlined onClick={playMusic} />
        <em onClick={playMusic}>{songName}</em>
        <button
          className="sprite_icon2 btn addto"
          onClick={handleAddPlaylist}
        ></button>
        {/* 替代button  <a
          href="/discover/recommend"
          className="sprite_icon2 btn addto"
          onClick={handleAddPlaylist}
          // 添加空的 onClick 阻止默认跳转
          onClick={(e) => {
            e.preventDefault()
            handleAddPlaylist(e as unknown as MouseEvent<HTMLButtonElement>)
          }}
        ></a> */}
      </div>
      <NavLink to="/discover/song" className="singer" onClick={playMusic}>
        {singer}
      </NavLink>
      <div className="text-nowrap album">《{album}》</div>
      <div className="text-nowrap duration">{duration}</div>
    </SingleSongItemWrapper>
  )
}

export default memo(SingleSongItem)
