import React, { memo, MouseEventHandler } from 'react'

interface LoginIconProps {
  position: string
  description: string 
  onClick?: MouseEventHandler<HTMLAnchorElement>
}

/**
 * 登录模块图标组件（微信/QQ/微博/邮箱登录图标）
 */
const LoginIcon = memo(
  ({
    position = '-150px -670px',
    description = '默认登录方式',
    onClick
  }: LoginIconProps) => {
    // 合并点击事件：先执行传入的 onClick，再阻止默认行为
    const handleClick: MouseEventHandler<HTMLAnchorElement> = (e) => {
      // 先执行外部传入的 onClick 事件
      if (onClick) {
        onClick(e)
      }
      // 阻止 a 标签默认跳转行为
      e.preventDefault()
    }

    return (
      <a
        style={{
          display: 'flex',
          width: '149px',
          marginTop: '19px',
          lineHeight: '38px',
          cursor: 'pointer'
        }}
        onClick={handleClick}
      >
        <i
          className="theme-logo"
          style={{
            width: '38px',
            height: '38px',
            backgroundPosition: position,
            display: 'inline-block'
          }}
        ></i>
        <em
          style={{
            marginLeft: '14px',
            fontSize: '14px'
          }}
        >
          {description}
        </em>
      </a>
    )
  }
)


export default LoginIcon
