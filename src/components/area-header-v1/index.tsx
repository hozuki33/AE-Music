import { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { HeaderV1Wrapper } from './style'
import { Link } from 'react-router-dom'

interface IProps {
  children?: ReactNode
  title?: string
  keywords?: string[]
  moreText?: string
  moreLink?: string
}

const AreaHeaderV1: FC<IProps> = (props) => {
  const {
    title = '热门推荐',
    keywords = [],
    moreText = '更多',
    moreLink = '/'
  } = props
  return (
    <div>
      <HeaderV1Wrapper className="sprite_02">
        <div className="left">
          <h3 className="title">{title}</h3>
          <div className="keywords">
            {keywords.map((item) => (
              <div className="item" key={item}>
                <span className="link">{item}</span>
                <span className="divider">|</span>
              </div>
            ))}
          </div>
        </div>
        <div className="right">
          <Link className="more" to={moreLink}>
            {moreText}
          </Link>
          <i className="icon sprite_02"></i>
        </div>
      </HeaderV1Wrapper>
    </div>
  )
}

export default memo(AreaHeaderV1)
