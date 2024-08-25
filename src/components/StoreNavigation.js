import { PATH } from 'constants/path'
import React from 'react'
import { Container, Nav, Navbar } from 'react-bootstrap'
import { FaListAlt, FaRegListAlt } from 'react-icons/fa'
import { IoStatsChart, IoStatsChartOutline } from 'react-icons/io5'
import { MdOutlineSettings, MdOutlineStore, MdSettings, MdStore } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

function StoreNavigation() {
  const activeKey = window.location.pathname;
  const navigate = useNavigate();

  const STORE_MENU = [
    {
      icon: <MdStore className="navIcon" />,
      text: 'Cửa hàng',
      outlinedIcon: <MdOutlineStore className="navIcon" />,
      path: PATH.APP.MY_STORE.ROOT
    },
    {
      icon: <FaListAlt className="navIcon" />,
      text: 'Đơn hàng',
      outlinedIcon: <FaRegListAlt className="navIcon" />,
      path: PATH.APP.MY_STORE.ORDER
    },
    {
      icon: <IoStatsChart className="navIcon" />,
      text: 'Thống kê',
      outlinedIcon: <IoStatsChartOutline className="navIcon" />,
      path: PATH.APP.MY_STORE.STATISTICS,
    },
    {
      icon: <MdSettings className="navIcon" />,
      text: 'Cài đặt',
      outlinedIcon: <MdOutlineSettings className="navIcon" />,
      path: PATH.APP.MY_STORE.SETTING
    },
  ]

  return <Styles>
    <Navbar bg="light" variant="light" fixed="bottom" className="pb-0">
      <Container fluid className="p-3 container">
        <Nav className="mx-0 p-0 d-flex justify-content-around w-100" activeKey={activeKey}>
          {
            STORE_MENU.map((item, index) => {
              return <Nav.Link key={item?.path} className="m-0 p-1" eventKey={item?.path} onClick={() => navigate(item.path)}>
              {activeKey === item.path ? item.icon : item.outlinedIcon}
              <p className="m-0 p-0 navText">{item.text}</p>
            </Nav.Link>
            }

              
            )
          }
        </Nav>
      </Container>
    </Navbar>
  </Styles>
}

export default StoreNavigation

const Styles = styled.div`
  .navIcon {
    width: 100%;
    color: var(--primary);
  }

  .navText {
    font-size: 0.9rem;
    margin: 0 0 0.5rem 0;
  }

  .container {
    box-shadow: rgba(60, 64, 67, 0.1) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 2px 6px 2px;
    border-radius: 10px 10px 0 0;
  }

  .accountButton {
    background-color: transparent;
    border-width: 0;
  }

  .dot {
    color: var(--secondary);
    position: absolute;
    bottom: -1rem;
    left: 50%;
    transform: translateX(-50%);
  }
`
