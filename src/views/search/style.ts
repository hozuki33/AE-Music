import styled from 'styled-components'

export const SearchWrapper = styled.div`
  background-color: #f5f5f5;
  min-height: calc(100vh - 62px);

  .w980 {
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .search-wrapper {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;

    .ant-input-search {
      width: 500px;
      height: 40px;

      input {
        height: 40px;
        font-size: 16px;
        border-radius: 20px 0 0 20px;
        border: 1px solid #ccc;
      }

      button {
        height: 40px;
        border-radius: 0 20px 20px 0;
        background-color: #fff;
        border: 1px solid #ccc;
        border-left: none;
        color: #333;

        &:hover {
          background-color: #f2f2f2;
        }
      }
    }
  }

  /* 搜索结果区域 */
  .search-content {
    background-color: #fff;
    border-radius: 4px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    .search-info {
      margin-bottom: 20px;
      color: #333;
      font-size: 14px;

      .music-amount {
        color: #c20b0b;
        font-weight: bold;
      }
    }

    .search-category {
      display: flex;
      justify-content: start;
      align-items: center;
      border-bottom: 2px solid #f2f2f2;
      margin-bottom: 20px;
      width: 100%;

      &::after {
        content: '';
        flex: 1;
      }

      .route-item {
        padding: 0 15px 10px;
        margin-right: 0;
        font-size: 16px;
        color: #333;
        cursor: pointer;
        text-decoration: none;
        flex: 1;
        text-align: center;
        max-width: 120px;

        em {
          font-style: normal !important;
        }

        &.active {
          border-bottom: 2px solid #c20b0b;
          color: #c20b0b;
          font-weight: bold;
        }

        &:hover {
          color: #c20b0b;
        }
      }
    }

    .single-song-item {
      display: flex;
      align-items: center;
      padding: 5px 0;
      cursor: pointer;
      font-size: 14px;
      color: #333;
      width: 100%;
      box-sizing: border-box;

      &:hover {
        background-color: #f9f9f9;
      }

      .song-name {
        flex: 2;
        display: flex;
        align-items: center;
        padding-right: 5px;
        box-sizing: border-box;

        .anticon {
          margin-right: 8px;
          color: #999;
          font-size: 16px;

          &:hover {
            color: #c20b0b;
          }
        }

        em {
          margin-right: 5px;
          cursor: pointer;
          font-style: normal !important;
        }

        .addto {
          width: 16px;
          height: 16px;
          background: url(${require('@/assets/img/sprite_icon2.png')})
            no-repeat -70px -283px;
          cursor: pointer;
          opacity: 0;
          margin-right: 0;

          &:hover {
            background-position: -70px -300px;
          }
        }
      }

      .singer {
        flex: 1;
        color: #333;
        text-decoration: none;
        padding-right: 5px;
        box-sizing: border-box;

        &:hover {
          color: #c20b0b;
        }
      }

      .album {
        flex: 1.5;
        color: #999;
        padding-right: 5px;
        box-sizing: border-box;
      }

      .duration {
        flex: 0.5;
        color: #999;
        padding-right: 0;
        box-sizing: border-box;
      }

      &:hover .addto {
        opacity: 1;
      }
    }
  }
`
