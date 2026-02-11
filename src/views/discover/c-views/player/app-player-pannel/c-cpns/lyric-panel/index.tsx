import React, { memo, useRef, useEffect, FC } from 'react'
import { useSelector, shallowEqual } from 'react-redux'
import classNames from 'classnames'

import { scrollTo } from '@/utils/ui-helper'
import { PannelWrapper } from './style'

// import { IPlayerState } from '../../../store/player'
import { IRootState } from '@/store'
import { ILyricInfo } from '@/utils/parse-lyric'

interface LyricPanelProps {}

const LyricPanel: FC<LyricPanelProps> = memo(() => {
  const { lyrics, lyricIndex } = useSelector(
    (state: IRootState) => ({
      lyrics: state.player.lyrics,
      lyricIndex: state.player.lyricIndex
    }),
    shallowEqual
  )

  const panelRef = useRef<HTMLDivElement>(null)

  // 歌词滚动逻辑
  useEffect(() => {
    if (!panelRef.current) return
    if (lyricIndex > 0 && lyricIndex < 3) return
    scrollTo(panelRef.current, (lyricIndex - 3) * 32, 300)
  }, [lyricIndex])

  if (!lyrics || lyrics.length === 0) {
    return <PannelWrapper ref={panelRef}>暂无歌词</PannelWrapper>
  }

  return (
    <PannelWrapper ref={panelRef}>
      <div className="lrc-content">
        {lyrics.map((item: ILyricInfo, index: number) => {
          return (
            <div
              key={item.time}
              className={classNames('lrc-item', {
                active: index === lyricIndex
              })}
            >
              {item.content}
            </div>
          )
        })}
      </div>
    </PannelWrapper>
  )
})

export default LyricPanel
