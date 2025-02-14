import React, { useEffect, useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Spin,
  message,
  Button,
  Divider,
} from "antd";
import { EditOutlined, UserOutlined } from "@ant-design/icons";
import { getUserProfile, updateUserProfile } from "../api/apibackend";
import UserProfileModal from "./UserProfileModal";

const { Title, Text } = Typography;

const Users = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);

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

  const showModal = () => {
    setEditUser(user);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    setEditUser({ ...editUser, [e.target.name]: e.target.value });
  };

  const handleImageUpload = ({ file }) => {
    const isImage = file.type.startsWith("image/");
    const isSmallEnough = file.size / 1024 / 1024 < 2; // limit to 2MB
    if (!isImage) {
      message.error("Only image files are allowed!");
      return false;
    }
    if (!isSmallEnough) {
      message.error("Image must be smaller than 2MB!");
      return false;
    }

    setEditUser({ ...editUser, profile_picture: file });
    message.success("Image uploaded successfully!");
    return false;
  };

  const handleSave = async () => {
    const formData = new FormData();

    formData.append("username", editUser?.username);
    formData.append("email", editUser?.email);
    formData.append("phone_number", editUser?.phone_number);
    formData.append("date_of_birth", editUser?.date_of_birth);
    formData.append("address", editUser?.address);

    if (editUser?.profile_picture && editUser.profile_picture instanceof File) {
      formData.append("profile_picture", editUser.profile_picture);
    }

    try {
      await updateUserProfile(formData);
      message.success("Profile updated successfully!");
      setIsModalOpen(false);
    } catch (error) {
      message.error(error.message);
    }
  };

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
    <>
      <Card
        style={{
          maxWidth: 500,
          margin: "auto",
          marginTop: "30px",
          textAlign: "center",
          boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px",
        }}
        cover={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '200px',
            }}
          >
            <Avatar
              size={100}
              src={user.profile_picture}
              icon={!user.profile_picture && <UserOutlined />}
              style={{
                borderRadius: "50%",
                border: "2px solid #1890ff",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>
        }
      >
        <Title level={3} style={{ fontWeight: 500, color: "#1890ff" }}>
          User Profile
        </Title>
        <Text style={{ fontSize: 16, display: "block", marginBottom: "8px" }}>
          <strong>ID:</strong> {user.id}
        </Text>
        <Text style={{ fontSize: 16, display: "block", marginBottom: "8px" }}>
          <strong>Username:</strong> {user.username}
        </Text>
        <Text style={{ fontSize: 16, display: "block", marginBottom: "8px" }}>
          <strong>Email:</strong> {user.email}
        </Text>
        <Text style={{ fontSize: 16, display: "block", marginBottom: "8px" }}>
          <strong>Phone:</strong> {user.phone_number || "N/A"}
        </Text>
        <Text style={{ fontSize: 16, display: "block", marginBottom: "8px" }}>
          <strong>Birthdate:</strong> {user.date_of_birth || "N/A"}
        </Text>
        <Text style={{ fontSize: 16, display: "block", marginBottom: "8px" }}>
          <strong>Address:</strong> {user.address || "N/A"}
        </Text>
        <Text style={{ fontSize: 16, display: "block", marginBottom: "8px" }}>
          <strong>User Type:</strong> {user.user_type}
        </Text>
        <Divider />
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={showModal}
          style={{
            marginTop: 10,
            borderRadius: "4px",
            fontWeight: "bold",
            width: "100%",
          }}
        >
          Edit Profile
        </Button>
      </Card>

      <UserProfileModal
        isModalOpen={isModalOpen}
        onCancel={handleCancel}
        onSave={handleSave}
        user={editUser}
        onChange={handleChange}
        onImageUpload={handleImageUpload}
      />
    </>
  );
};

export default Users;
