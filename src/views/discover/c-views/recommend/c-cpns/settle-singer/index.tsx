import { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { SinggerWrapper } from './style'
import AreaHeaderV2 from '@/components/area-header-v2'
import { useAppSelector } from '@/store'
import { getImageSize } from '@/utils/format'

interface IProps {
  children?: ReactNode
}

const SettleSinger: FC<IProps> = () => {
  const { settleSingers } = useAppSelector((state) => ({
    settleSingers: state.recommend.artistlist
  }))
  return (
    <SinggerWrapper>
      <AreaHeaderV2
        title="入驻歌手"
        moreLink="/discover/artist"
        moreText="查看全部&gt;"
      />
      <div className="artists">
        {settleSingers.slice(0, 5).map((item) => (
          <a href="#/discover/artist" key={item.id} className="item">
            <img src={getImageSize(item.picUrl, 62)} alt="" />
            <div className="info">
              <div className="name">{item.name}</div>
              <div className="alias">{item.alias.join(' ')}</div>
            </div>
          </a>
        ))}
      </div>
      <div className="apply-for">
        <a href="#/discover/artist">申请成为网易音乐人</a>
      </div>
    </SinggerWrapper>
  )
}

export default memo(SettleSinger)
