import useMediaQuery from 'hooks/useMediaQuery';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { AiFillEyeInvisible } from 'react-icons/ai';
import { IoMdExit } from 'react-icons/io';
import { MdMenu } from 'react-icons/md';

import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SubMenu,
} from 'react-pro-sidebar';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const AdminLayout = ({ menu, children, title, root, ...props }) => {
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [collapsed, setCollapsed] = useState(isMobile);
  const handleLogout = () => {
    localStorage.removeItem('user-info');
    localStorage.removeItem('user-jwt-tk');
    localStorage.removeItem('user-jwt-rftk');
    window.location.reload();
  };
  const navigate = useNavigate();
  return (
    <Styles className='d-flex flex-row'>
      {isMobile && collapsed ? (
        <div style={{ position: 'fixed', top: 15, right: '20px', zIndex: 1000 }}>
          <Button
            onClick={() => {
              setCollapsed(!collapsed);
            }}
          >
            <MdMenu size={30} />
          </Button>
        </div>
      ) : (
        <ProSidebar className='side-bar' collapsed={collapsed}>
          {!collapsed ? (
            <SidebarHeader className='header d-flex justify-content-center'>
              <div className='mt-3 fs-4'>{title}</div>
            </SidebarHeader>
          ) : null}
          <SidebarContent className='nav-bar-left'>
            <Menu iconShape='circle'>
              {menu?.map((item) => {
                if (item.children === undefined) {
                  return (
                    <MenuItem
                      key={item.path}
                      className='mb-3'
                      icon={item.icon}
                      onClick={() => {
                        if (isMobile) {
                          setCollapsed(true);
                        }

                        navigate(root ? `${root}/${item.path}` : item.path);
                      }}
                    >
                      {item.label}
                    </MenuItem>
                  );
                } else {
                  return (
                    <SubMenu
                      title={item.label}
                      className='mb-3'
                      icon={item.icon}
                      key={item.path}
                    >
                      {item?.children.map((submenu) => {
                        return (
                          <MenuItem
                            key={submenu.path}
                            icon={submenu.icon}
                            className='mb-2'
                            onClick={() => {
                              if (isMobile) {
                                setCollapsed(true);
                              }

                              navigate(submenu.path);
                            }}
                          >
                            {submenu.label}
                          </MenuItem>
                        );
                      })}
                    </SubMenu>
                  );
                }
              })}
              <MenuItem
                className='mb-3'
                icon={<AiFillEyeInvisible />}
                onClick={() => {
                  setCollapsed(!collapsed);
                }}
              >
                Ẩn thanh điều hướng
              </MenuItem>
            </Menu>
          </SidebarContent>
          <SidebarFooter>
            <Menu>
              <MenuItem icon={<IoMdExit />}>
                <div onClick={props?.handleLogout || handleLogout}>
                  Đăng xuất
                </div>
              </MenuItem>
            </Menu>
          </SidebarFooter>
        </ProSidebar>
      )}
      <div className='content'>{children || <Outlet />}</div>
    </Styles>
  );
};

export default AdminLayout;

const Styles = styled.div`
  width: 100%;
  height: 100vh;

  .pro-sidebar {
    .header {
      text-transform: uppercase;
      text-align: center;
      padding: 1rem;
      font-weight: bold;
    }
  }
  .content {
    width: 100%;
  }
`;
