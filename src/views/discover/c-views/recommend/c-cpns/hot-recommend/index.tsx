import { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { HotRecommendWrapper } from './style'
import AreaHeaderV1 from '@/components/area-header-v1'
import SongMenuItem from '@/components/songs-menu-item'
import { shallowEqualApp, useAppSelector } from '@/store'

interface IProps {
  children?: ReactNode
}

const HotRecommend: FC<IProps> = () => {
  const { hotRecommends } = useAppSelector(
    (state) => ({
      hotRecommends: state.recommend.hotRecommends
    }),
    shallowEqualApp
  )
  return (
    <div>
      <HotRecommendWrapper>
        <AreaHeaderV1
          title="热门推荐"
          keywords={['华语', '流行', '摇滚', '民谣', '电子']}
          moreLink="/discover/songs"
        />
        <div className="recommend-list">
          {hotRecommends.map((item: any) => (
            <SongMenuItem key={item.id} itemData={item} />
          ))}
        </div>
      </HotRecommendWrapper>
    </div>
  )
}

export default memo(HotRecommend)
