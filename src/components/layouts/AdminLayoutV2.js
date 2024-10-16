import React, { useState } from "react";
import { AiFillEyeInvisible } from "react-icons/ai";
import { IoMdExit } from "react-icons/io";

import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SubMenu,
} from "react-pro-sidebar";
import { Link, Outlet } from "react-router-dom";
import styled from "styled-components";

import AccountApi from "api/accountApi";

const AdminLayout = ({ menu, children, title, root }) => {
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    const refreshToken = localStorage.getItem("user-jwt-rftk");
    AccountApi.logoutUser(refreshToken)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
    localStorage.removeItem("user-info");
    localStorage.removeItem("user-jwt-tk");
    localStorage.removeItem("user-jwt-rftk");
    window.location.reload();
  };
  return (
    <Styles className="d-flex flex-row">
      <ProSidebar className="side-bar" collapsed={collapsed}>
        <SidebarHeader className="header d-flex justify-content-center">
          <div className="mt-3 fs-4">{!collapsed ? title : null}</div>
        </SidebarHeader>
        <SidebarContent className="nav-bar-left">
          <Menu iconShape="circle">
            {menu?.map((item) => {
              if (item.children === undefined) {
                return (
                  <MenuItem key={item.path} className="mb-3" icon={item.icon}>
                    <Link to={root ? `${root}/${item.path}` : item.path}>
                      {item.label}
                    </Link>
                  </MenuItem>
                );
              } else {
                return (
                  <SubMenu
                    title={item.label}
                    className="mb-3"
                    icon={item.icon}
                    key={item.path}
                  >
                    {item?.children.map((submenu) => {
                      return (
                        <MenuItem
                          key={submenu.path}
                          icon={submenu.icon}
                          className="mb-2"
                        >
                          <Link to={`${root}/${submenu.path}`}>
                            {submenu.label}
                          </Link>
                        </MenuItem>
                      );
                    })}
                  </SubMenu>
                );
              }
            })}
            <MenuItem
              className="mb-3"
              icon={<AiFillEyeInvisible />}
              onClick={() => {
                setCollapsed(!collapsed);
              }}
            >
              Ẩn thanh bên
            </MenuItem>
          </Menu>
        </SidebarContent>
        <SidebarFooter>
          <Menu>
            <MenuItem icon={<IoMdExit />}>
              <div onClick={handleLogout}>Đăng xuất</div>
            </MenuItem>
          </Menu>
        </SidebarFooter>
      </ProSidebar>
      <div className="content">{children || <Outlet />}</div>
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
    height: calc(100vh - 1rem);
    overflow: auto;
  }
`;
