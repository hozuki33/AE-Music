import { shallowEqualApp, useAppSelector } from '@/store'
import { memo, useRef } from 'react'
import type { FC, ReactNode } from 'react'
import { AlbumWrapper } from './style'
import AreaHeaderV1 from '@/components/area-header-v1'
import { Carousel } from 'antd'
import { CarouselRef } from 'antd/es/carousel'
import NewAlbumItem from '@/components/new-album-item'

interface IProps {
  children?: ReactNode
}

const NewAlbum: FC<IProps> = () => {
  const bannerRef = useRef<CarouselRef>(null)
  const { newAlbums } = useAppSelector((state) => ({
    newAlbums: state.recommend.newAlbums
  }))
  function handleNextClick() {
    bannerRef.current?.next()
  }
  function handlePrevClick() {
    bannerRef.current?.prev()
  }
  return (
    <AlbumWrapper>
      <AreaHeaderV1 title="新碟上架" moreLink="/discover/album" />
      <div className="content">
        <button
          className="sprite_02 arrow arrow-left"
          onClick={handlePrevClick}
        ></button>
        <div className="banner">
          <Carousel autoplay ref={bannerRef} dots={false} speed={1500}>
            {[0, 1].map((item) => (
              <div key={item}>
                <div className="album-list">
                  {newAlbums.slice(item * 5, (item + 1) * 5).map((album) => (
                    <NewAlbumItem key={album.id} itemData={album} />
                  ))}
                </div>
              </div>
            ))}
          </Carousel>
        </div>
        <button
          className="sprite_02 arrow arrow-right"
          onClick={handleNextClick}
        ></button>
      </div>
    </AlbumWrapper>
  )
}

export default memo(NewAlbum)
