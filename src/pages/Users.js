import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Spin,
  message,
  Divider,
  Row,
  Col,
} from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { getUserProfile } from "../api/apibackend";

const { Title, Text } = Typography;

const Users = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (error) {
        message.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Text type="danger">Failed to load user data.</Text>
      </div>
    );
  }

  return (
    <Card
      style={{
        maxWidth: 600,
        margin: "auto",
        marginTop: "40px",
        borderRadius: "12px",
        boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
        background: "#ffffff",
        padding: "20px",
      }}
      hoverable
    >
      <Row justify="center" style={{ marginBottom: "20px" }}>
        <Avatar
          size={120}
          src={undefined} // Use undefined if no profile picture
          icon={<UserOutlined />} // Show icon if no profile picture
          style={{
            borderRadius: "50%",
            border: "4px solid #1890ff",
            color: "#1890ff",
            background: "#ffff"
            // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        />
      </Row>

      <Title
        level={3}
        style={{ fontWeight: 600, color: "#1890ff", textAlign: "center" }}
      >
        {user.username}'s Profile
      </Title>
      <Divider />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Text style={{ fontSize: 16 }}>
            <strong>ID:</strong> {user.id}
          </Text>
        </Col>
        <Col span={24}>
          <Text style={{ fontSize: 16 }}>
            <strong>
              <MailOutlined /> Email:
            </strong>{" "}
            {user.email}
          </Text>
        </Col>
        <Col span={24}>
          <Text style={{ fontSize: 16 }}>
            <strong>
              <PhoneOutlined /> Phone:
            </strong>{" "}
            {user.phone_number || "N/A"}
          </Text>
        </Col>
        <Col span={24}>
          <Text style={{ fontSize: 16 }}>
            <strong>
              <CalendarOutlined /> Birthdate:
            </strong>{" "}
            {user.date_of_birth || "N/A"}
          </Text>
        </Col>
        <Col span={24}>
          <Text style={{ fontSize: 16 }}>
            <strong>
              <HomeOutlined /> Address:
            </strong>{" "}
            {user.address || "N/A"}
          </Text>
        </Col>
        <Col span={24}>
          <Text style={{ fontSize: 16 }}>
            <strong>User Type:</strong> {user.user_type}
          </Text>
        </Col>
      </Row>

      <Divider />
    </Card>
  );
};

export default Users;
