// app-play-panel/index.tsx（后缀改为 .tsx）
import React, { memo, FC } from 'react' // 导入 FC（FunctionComponent）类型

import PlayHeader from './c-cpns/play-header'
import PlayList from './c-cpns/play-list'
import LyricPanel from './c-cpns/lyric-panel'
import { PanelWrapper } from './style'

interface AppPlayListProps {
  onClearPlayList: () => void
}
const AppPlayList: FC<AppPlayListProps> = ({onClearPlayList}) => {
  return (
    <PanelWrapper>
      <PlayHeader onClearPlayList={onClearPlayList} />
      <div className="main">
        <img
          className="image"
          src="https://p4.music.126.net/qeN7o2R3_OTPhghmkctFBQ==/764160591569856.jpg"
          alt="播放列表封面"
        />
        <PlayList />
        <LyricPanel />
      </div>
    </PanelWrapper>
  )
}

export default memo(AppPlayList)
