import { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { MenuItemWrapper } from './style'
import { formatCount, getImageSize } from '@/utils/format'

interface IProps {
  children?: ReactNode
  itemData: any
}

const SongMenuItem: FC<IProps> = (props) => {
  const { itemData } = props
  return (
    <div>
      <MenuItemWrapper>
        <div className="top">
          <img src={getImageSize(itemData.picUrl, 140)} alt="" />
          <div className="cover sprite_cover">
            <div className="info sprite_cover">
              <span>
                <i className="sprite_icon headset"></i>
                <span className="count">{formatCount(itemData.playCount)}</span>
              </span>
              <i className="sprite_icon play"></i>
            </div>
          </div>
        </div>
        <div className="bottom">
          <span>{itemData.name}</span>
        </div>
      </MenuItemWrapper>
    </div>
  )
}

export default memo(SongMenuItem)
