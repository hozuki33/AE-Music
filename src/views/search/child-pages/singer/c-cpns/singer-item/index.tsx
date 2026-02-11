import React, { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { getSizeImage } from '@/utils/format'
import { AlbumItemWrapper } from './style'

interface ISingerItemProps {
  coverPic: string
  singer: string
  children?: ReactNode 
}

const SingerItem: FC<ISingerItemProps> = (props) => {
  const { coverPic, singer } = props

  const picUrl =
    (coverPic && getSizeImage(coverPic, 130)) ||
    'https://gitee.com/xmkm/cloudPic/raw/master/img/20210505140847.png'

  return (
    <AlbumItemWrapper>
      <div className="cover-pic">
        <img src={picUrl} alt={singer} /> 
        <span className="image_cover"></span>
      </div>
      <p className="singer-info">
        <span>{singer}</span>
        <i className="sprite_icon2 singer_icon"></i>
      </p>
    </AlbumItemWrapper>
  )
}

export default memo(SingerItem)
