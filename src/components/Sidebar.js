// src/components/Sidebar.js
import React from "react";
import { Layout, Menu } from "antd";
import {
  DashboardOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const selectedKey = location.pathname; // คาดว่าทุกหน้าใช้ URL ตรงกับ key ของเมนู

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      style={{
        height: "100vh",
        background: "#1890ff",
        color: "#fff",
        boxShadow: "2px 0 6px rgba(0,0,0,0.2)",
      }}
    >
      <div
        className="logo"
        style={{
          height: "60px",
          margin: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255, 255, 255, 0.2)",
          borderRadius: "8px",
          fontSize: "18px",
          fontWeight: "bold",
          color: "#fff",
          textTransform: "uppercase",
          letterSpacing: "1px",
        }}
      >
        {collapsed ? "🏠" : "Smart Home"}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[selectedKey]}
        style={{
          background: "#1890ff",
          color: "#fff",
          borderRight: "none",
          fontSize: "16px",
        }}
        items={[
          {
            key: "/dashboard",
            icon: <DashboardOutlined />,
            label: (
              <Link to="/dashboard" style={linkStyle}>
                Dashboard
              </Link>
            ),
            style: getMenuStyle(selectedKey, "/dashboard"),
          },
          {
            key: "/users",
            icon: <UserOutlined />,
            label: (
              <Link to="/users" style={linkStyle}>
                Users
              </Link>
            ),
            style: getMenuStyle(selectedKey, "/users"),
          },
          {
            key: "/settings",
            icon: <SettingOutlined />,
            label: (
              <Link to="/settings" style={linkStyle}>
                Logbook
              </Link>
            ),
            style: getMenuStyle(selectedKey, "/settings"),
          },
        ]}
      />
    </Sider>
  );
};

const getMenuStyle = (selectedKey, menuKey) => ({
  margin: "5px 10px",
  borderRadius: "6px",
  transition: "all 0.3s",
  fontWeight: "500",
  background: selectedKey === menuKey ? "rgba(255,255,255,0.3)" : "transparent",
  color: selectedKey === menuKey ? "#fff" : "#ffffffb3",
});

const linkStyle = {
  color: "inherit",
  width: "100%",
  display: "block",
};

export default Sidebar;
