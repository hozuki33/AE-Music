import { shallowEqualApp, useAppSelector } from '@/store'
import { memo, useEffect, useRef, useState } from 'react'
import type { FC, ReactNode } from 'react'
import { BannerControl, BannerLeft, BannerRight, BannerWrapper } from './style'
import { Carousel } from 'antd'
import { CarouselRef } from 'antd/es/carousel'
import classNames from 'classnames'

interface IProps {
  children?: ReactNode
}

const TopBanner: FC<IProps> = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const bannerRef = useRef<CarouselRef>(null)

  const { banners } = useAppSelector(
    (state) => ({
      banners: state.recommend.banners
    }),
    shallowEqualApp
  )
  // useEffect(() => {
  //   banners.forEach((item) => {
  //     const img = new Image()
  //     img.src = item.imageUrl + '?imageView&blur=40x20'
  //   })
  // }, [banners])
  function handleAfterChange(current: number) {
    setCurrentIndex(current)
  }
  function handlePrevClick() {
    bannerRef.current?.prev()
  }
  function handleNextClick() {
    bannerRef.current?.next()
  }
  // let bgImageUrl = banners[currentIndex]?.imageUrl
  // if (bgImageUrl) bgImageUrl = bgImageUrl + '?imageView&blur=40x20'
  const bgImageUrl = banners[currentIndex]?.imageUrl
    ? `${banners[currentIndex].imageUrl}?imageView&blur=40x20`
    : ''
  return (
    <BannerWrapper>
      <div className="bg" style={{ backgroundImage: `url('${bgImageUrl}')` }} />
      <div className="banner wrap-v2">
        <BannerLeft>
          <Carousel
            autoplay
            effect="fade"
            dots={false}
            ref={bannerRef}
            beforeChange={(_, next) => setCurrentIndex(next)}
          >
            {banners.map((item) => (
              <div className="banner-item" key={item.imageUrl}>
                <img
                  className="image"
                  src={item.imageUrl}
                  alt={item.typeTitle}
                />
              </div>
            ))}
          </Carousel>
          <ul className="dots">
            {banners.map((item, index) => (
              <li key={item.imageUrl}>
                <span
                  className={classNames('item', {
                    active: index === currentIndex
                  })}
                ></span>
              </li>
            ))}
          </ul>
        </BannerLeft>

        <BannerRight></BannerRight>
        <BannerControl>
          <button className="btn left" onClick={handlePrevClick}></button>
          <button className="btn right" onClick={handleNextClick}></button>
        </BannerControl>
      </div>
    </BannerWrapper>
  )
}

export default memo(TopBanner)
