import { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { RankingItemWrapper } from './style'
import { getImageSize } from '@/utils/format'
import { fetchCurrentSongAction } from '../../../player/store/player'
import { IRootState, useAppDispatch } from '@/store'
interface IProps {
  children?: ReactNode
  itemData: any
}

const TopRankingItem: FC<IProps> = (props) => {
  const { itemData } = props
  const { tracks = [] } = itemData
  const dispatch = useAppDispatch()
  const handlePlayClick = (id: number) => {
    dispatch(fetchCurrentSongAction(id))
  }
  return (
    <RankingItemWrapper>
      <div className="header">
        <div className="image">
          <img src={getImageSize(itemData.coverImgUrl, 80)} alt="" />
          <a href="" className="sprite_cover"></a>
        </div>
        <div className="info">
          <div className="name">{itemData.name}</div>
          <div>
            <button className="sprite_02 btn play"></button>
            <button className="sprite_02 btn favor"></button>
          </div>
        </div>
      </div>
      <div className="list">
        {tracks.slice(0, 10).map((item: any, index: number) => (
          <div className="item" key={item.id}>
            <div className="index">{index + 1}</div>
            <div className="info">
              <div className="name">{item.name}</div>
              <div className="operate">
                <button
                  className="sprite_02 btn play"
                  onClick={() => handlePlayClick(item.id)}
                ></button>
                <button className="sprite_icon2 btn add"></button>
                <button className="sprite_02 btn favor"></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="footer">
        <a href="/#/discover/ranking">查看全部 &gt;</a>
      </div>
    </RankingItemWrapper>
  )
}

export default memo(TopRankingItem)
