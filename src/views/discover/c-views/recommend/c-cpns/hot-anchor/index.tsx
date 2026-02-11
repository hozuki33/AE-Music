import { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { AnchorWrapper } from './style'
import SectionHeaderV2 from '@/components/area-header-v2'
import { hotRadios } from '@/assets/data/local_data'

interface IProps {
  children?: ReactNode
}

const HotAnchor: FC<IProps> = () => {
  return (
    <AnchorWrapper>
      <SectionHeaderV2 title="热门主播" moreLink="/discover/djradio" />
      <div className="anchor-list">
        {hotRadios.map((item: any) => {
          return (
            <div className="item" key={item.picUrl}>
              <a href="/discover/djradio" className="image">
                <img src={item.picUrl} alt="" />
              </a>
              <div className="info">
                <div className="name">{item.name}</div>
                <div className="position">{item.position}</div>
              </div>
            </div>
          )
        })}
      </div>
    </AnchorWrapper>
  )
}

export default memo(HotAnchor)
