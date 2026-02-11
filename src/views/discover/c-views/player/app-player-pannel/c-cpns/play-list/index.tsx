import React, { memo, FC } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import classNames from 'classnames'
import { ISong } from '../../../store/player'
import { IRootState } from '@/store'
//IPlayerState
import { formatMinuteSecond } from '@/utils/format'
import { PlayListWrapper } from './style'

interface PlayListProps {}

const PlayList: FC<PlayListProps> = memo(() => {
  const { playSongList, currentSongIndex } = useSelector(
    (state: IRootState) => ({
      playSongList: state.player.playSongList,
      currentSongIndex: state.player.currentSongIndex
    }),
    shallowEqual
  )

  const safePlayList = playSongList || []
  const safeCurrentIndex = currentSongIndex ?? -1

  return (
    <PlayListWrapper>
      {safePlayList.map((item: ISong, index: number) => {
        const singerName = item.ar?.[0]?.name || '未知歌手'
        const duration = item.dt ? formatMinuteSecond(item.dt) : '00:00'

        return (
          <div
            key={item.id}
            className={classNames('play-item', {
              active: safeCurrentIndex === index
            })}
          >
            <div className="left">{item.name}</div>
            <div className="right">
              <span className="singer">{singerName}</span>
              <span className="duration">{duration}</span>
              <span className="sprite_playlist link"></span>
            </div>
          </div>
        )
      })}
    </PlayListWrapper>
  )
})

export default PlayList
