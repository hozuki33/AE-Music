import React, { memo, FC } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import { ISong } from '../../../store/player'
import { IRootState } from '@/store'

import { HeaderWrapper, HeaderLeft, HeaderRight } from './style'

interface PlayHeaderProps {
  onClearPlayList: () => void
}

const PlayHeader: FC<PlayHeaderProps> = memo(({onClearPlayList}) => {
  const { playSongList, currentSong } = useSelector(
    (state: IRootState) => ({
      playSongList: state.player.playSongList,
      currentSong: state.player.currentSong
    }),
    shallowEqual
  )
  

  const safePlayList = playSongList || []
  const safeCurrentSong = currentSong || ({ name: '暂无歌曲' } as ISong)

  return (
    <HeaderWrapper>
      <HeaderLeft>
        <h3>播放列表({safePlayList.length})</h3>
        <div className="operator">
          <button>
            <i className="sprite_playlist icon favor"></i>
            收藏全部
          </button>
          <button onClick={onClearPlayList} disabled={safePlayList.length === 0}>
            <i className="sprite_playlist icon remove"></i>
            清除
          </button>
        </div>
      </HeaderLeft>
      <HeaderRight>{safeCurrentSong.name}</HeaderRight>
    </HeaderWrapper>
  )
})

export default PlayHeader
