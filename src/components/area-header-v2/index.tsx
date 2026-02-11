import { memo } from 'react'
import type { FC, ReactNode } from 'react'
import { HeaderV2Wrapper } from './style'
import { Link } from 'react-router-dom'

interface IProps {
  children?: ReactNode
  title?: string
  moreText?: string
  moreLink?: string
}

const AreaHeaderV2: FC<IProps> = (props) => {
  const { title = '默认标题', moreText, moreLink } = props

  return (
    <div>
      <HeaderV2Wrapper className="sprite_02">
        <h3 className="titke">入驻歌手</h3>
        {moreText && moreLink && <a href={moreLink}>{moreText}</a>}
      </HeaderV2Wrapper>
    </div>
  )
}

export default memo(AreaHeaderV2)
