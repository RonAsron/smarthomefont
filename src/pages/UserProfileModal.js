import React from "react";
import { Form, Input, Button, Upload, Avatar } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Modal from "antd/es/modal/Modal";

const UserProfileModal = ({ isModalOpen, onCancel, onSave, user, onChange, onImageUpload }) => {
  return (
    <Modal
      title="Edit User Profile"
      open={isModalOpen}
      onCancel={onCancel}
      onOk={onSave}
      okText="Save"
      cancelText="Cancel"
      style={{ top: 20 }}
    >
      <Form layout="vertical">
        <Form.Item label="Username" required>
          <Input
            name="username"
            value={user?.username}
            onChange={onChange}
          />
        </Form.Item>

        <Form.Item label="Email" required>
          <Input
            name="email"
            type="email"
            value={user?.email}
            onChange={onChange}
          />
        </Form.Item>

        <Form.Item label="Phone Number">
          <Input
            name="phone_number"
            value={user?.phone_number || ""}
            onChange={onChange}
          />
        </Form.Item>

        <Form.Item label="Date of Birth">
          <Input
            name="date_of_birth"
            type="date"
            value={user?.date_of_birth || ""}
            onChange={onChange}
          />
        </Form.Item>

        <Form.Item label="Address">
          <Input
            name="address"
            value={user?.address}
            onChange={onChange}
          />
        </Form.Item>

        <Form.Item label="Profile Picture">
          <Upload
            showUploadList={false}
            beforeUpload={() => false}
            onChange={onImageUpload}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
          {user?.profile_picture && (
            <Avatar
              size={80}
              src={
                user.profile_picture instanceof File
                  ? URL.createObjectURL(user.profile_picture)
                  : user.profile_picture
              }
              style={{
                marginLeft: 10,
                border: "1px solid #ddd",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            />
          )}
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserProfileModal;
