// src/components/HeaderBar.js
import React, { useState, useEffect } from "react";
import { Layout, Button, Dropdown, Avatar, Typography, Card, Divider, message } from "antd";
import { 
  MenuUnfoldOutlined, 
  MenuFoldOutlined, 
  UserOutlined, 
  LogoutOutlined, 
  SettingOutlined 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getUserProfile } from "../api/apibackend";

const { Header } = Layout;
const { Text } = Typography;

const HeaderBar = ({ collapsed, setCollapsed }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        message.error(error.message);
      }
    };
    fetchUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  const userMenu = (
    <Card
      style={{
        minWidth: "200px",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
      }}
      bodyStyle={{ padding: "15px" }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Avatar size={50} style={{ backgroundColor: "#1890ff" }} icon={<UserOutlined />} />
        <div>
          {user ? (
            <>
              <Text strong style={{ fontSize: "16px" }}>{user.full_name}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: "12px" }}>{user.email}</Text>
            </>
          ) : (
            <Text>Loading...</Text>
          )}
        </div>
      </div>

      <Divider style={{ margin: "12px 0" }} />

      <Button 
        type="text" 
        icon={<SettingOutlined />} 
        style={menuButtonStyle} 
        onClick={() => navigate("/settings")}
      >
        Logbook 
      </Button>
      <Button 
        type="text" 
        icon={<LogoutOutlined />} 
        style={menuButtonStyle} 
        onClick={logout}
      >
        ออกจากระบบ
      </Button>
    </Card>
  );

  return (
    <Header
      style={{
        background: "#fff",
        padding: "0 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => setCollapsed(!collapsed)}
          style={{ fontSize: "18px" }}
        />
        <h2 style={{ marginLeft: "16px", fontSize: "20px", fontWeight: "bold", color: "#1890ff" }}>
          Home Assistant
        </h2>
      </div>

      <Dropdown 
        dropdownRender={() => userMenu} 
        trigger={["click"]} 
        placement="bottomRight"
      >
        <Avatar 
          size="large" 
          style={{ backgroundColor: "#1890ff", cursor: "pointer" }} 
          icon={<UserOutlined />} 
        />
      </Dropdown>
    </Header>
  );
};

const menuButtonStyle = {
  display: "block",
  width: "100%",
  textAlign: "left",
  padding: "8px 12px",
  borderRadius: "6px",
  fontSize: "14px",
  color: "#333",
  background: "transparent",
  transition: "all 0.3s",
  cursor: "pointer",
};

export default HeaderBar;
