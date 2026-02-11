import styled from 'styled-components'
export const HeaderWrapper = styled.div`
  height: 75px;
  background-color: #242424;
  font-size: 14px;
  color: #fff;

  .content {
    display: flex;
    justify-content: space-between;
  }
  .divider {
    height: 5px;
    background-color: #c20c0c;
  }
`

export const HeaderLeft = styled.div`
  display: flex;

  .logo {
    display: block;
    width: 176px;
    height: 70px;
    background-position: 0 0;
    text-indent: -9999px;
  }

  .title-list {
    display: flex;
    line-height: 70px;

    .item {
      position: relative;

      a {
        display: block;
        padding: 0 20px;
        color: #ccc;
        text-decoration: none;
      }

      &:hover a,
      a.active {
        color: #fff;
        background-color: #000;
      }

      a.active {
        position: relative;

        &::after {
          content: '';
          position: absolute;
          width: 12px;
          height: 7px;
          left: 50%;
          bottom: -1px;
          transform: translateX(-50%);
          background-image: url(${require('@/assets/img/sprite_01.png')});
          background-position: -226px 0;
        }
      }

      &:last-child a {
        position: relative;

        &::before {
          content: '';
          position: absolute;
          width: 28px;
          height: 19px;
          top: 20px;
          right: -15px;
          background-image: url(${require('@/assets/img/sprite_01.png')});
          background-position: -190px 0;
        }
      }
    }
  }
`
export const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  color: #787878;
  font-size: 12px;

  .search {
    width: 158px;
    height: 32px;
    border-radius: 16px;

    input {
      &::placeholder {
        font-size: 12px;
      }
    }
  }
  .search-wrapper {
    position: relative;

    /* 搜索框 */
    .search {
      width: 221px;
      height: 32px;
      border-radius: 16px;

      input {
        font-size: 12px;
        font-family: '微软雅黑';
        &::placeholder {
          font-size: 12px;
        }
      }
    }

    /* icons */
    .icons-wrapper {
      display: flex;

      .ctrl-wrapper {
        background: linear-gradient(-225deg, #d5dbe4, #f8f8f8);
        border-radius: 3px;
        box-shadow:
          inset 0 -2px 0 0 #cdcde6,
          inset 0 0 1px 1px #fff,
          0 1px 2px 1px rgba(30, 35, 90, 0.4);
        color: rgb(150 159 175);
        display: flex;
        align-items: center;
        height: 20px;
        justify-content: center;
        margin-right: 0.5em;
        padding-bottom: 2px;
        width: 25px;
      }

      .k-wrapper {
        background: linear-gradient(-225deg, #d5dbe4, #f8f8f8);
        border-radius: 3px;
        box-shadow:
          inset 0 -2px 0 0 #cdcde6,
          inset 0 0 1px 1px #fff,
          0 1px 2px 1px rgba(30, 35, 90, 0.4);
        color: #969faf;
        display: flex;
        align-items: center;
        height: 20px;
        justify-content: center;
        margin-right: 0.6em;
        padding-bottom: 2px;
        width: 25px;
      }
    }

    /* 下拉框 */
    .down-slider {
      position: absolute;
      top: 36px;
      left: 0;
      right: 0;
      width: 237px;
      z-index: 999;
      /* height: 144px; */
      border: 1px solid #bebebe;
      border-radius: 4px;
      background: #fff;
      box-shadow: 0 4px 7px #555;
      text-shadow: 0 1px 0 rgba(255, 255, 255, 0.9);

      .search-header {
        height: 35px;
        .discover {
          display: inline-block;
          padding-top: 10px;
          padding-left: 10px;
        }
      }

      .content {
        display: flex;
        border: 1px solid rgb(183, 183, 187);

        .zuo {
          /* float: left; */
          /* height: 100%; */
          width: 65px;
          /* border: 1px solid rgb(183, 183, 187); */
          padding-top: 10px;
          border-bottom: none;

          .song {
            color: #ccc;
            margin-left: 28px;
          }
        }

        .main {
          display: inline-block;
          font-size: 13px;
          line-height: 28px;

          .item {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 168px;
            cursor: pointer;
            height: 35px;
            line-height: 35px;
            color: #000;
            text-indent: 8px;

            &:hover {
              background-color: #ecf0f1;
              border-radius: 5%;
              color: #2ecc71;
            }

            &.active {
              background-color: #ecf0f1;
              color: #2ecc71;
            }
          }
        }
        span.blue {
          color: #7ab3dd;
        }
      }
    }
  }
  .center {
    width: 90px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border: 1px solid #666;
    border-radius: 16px;
    margin: 0 16px;
    color: #ccc;
    cursor: pointer;

    &:hover {
      color: #fff;
      border-color: #fff;
    }
  }
  .login {
    color: #ccc;
    font-size: 12px;
    cursor: pointer;
    &:hover {
      color: #fff;
      text-decoration: underline;
    }
  }
`
