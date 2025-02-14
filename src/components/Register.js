// src/components/Register.js
import React, { useState } from 'react';
import { registerUser, loginUser } from '../api/apibackend';
import { Form, Input, Button, Select, Alert, Layout, Typography, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const { Title } = Typography;
const { Content } = Layout;

const Register = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const data = await registerUser(values);
      console.log('User registered successfully:', data);

      const loginData = {
        email: values.email,
        password: values.password,
      };

      const loginResponse = await loginUser(loginData);
      console.log('User logged in successfully:', loginResponse);

      localStorage.setItem('accesstoken', loginResponse.access);
      localStorage.setItem('refreshtoken', loginResponse.refresh);

      navigate('/dashboard');
    } catch (err) {
      console.error("Registration error:", err);

      if (err.response && err.response.data) {
        const apiErrors = err.response.data;
        let errorMessage = "Error during registration. Please try again.";

        if (apiErrors.username) {
          errorMessage = `Username Error: ${apiErrors.username[0]}`;
        } else if (apiErrors.email) {
          errorMessage = `Email Error: ${apiErrors.email[0]}`;
        }

        setError(errorMessage);
      } else {
        setError("Error during registration. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <Layout style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Content style={{ maxWidth: '500px', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <Title level={2}>Register</Title>
        </div>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        )}

<Form
  name="register-form"
  onFinish={onFinish}
  layout="vertical"
  initialValues={{
    user_type: '',
    email: '',
    username: '',
    password: '',
    full_name: '',
    phone_number: '',
    date_of_birth: '',
    address: '',
  }}
>
  <Form.Item
    label="Username"
    name="username"
    rules={[{ required: true, message: 'Please input your username!' }]}
  >
    <Input placeholder="Enter your username" />
  </Form.Item>

  <Form.Item
    label="Email"
    name="email"
    rules={[
      { required: true, message: 'Please input your email!' },
      { type: 'email', message: 'The input is not valid E-mail!' },
    ]}
  >
    <Input placeholder="Enter your email" />
  </Form.Item>

  <Form.Item
    label="Password"
    name="password"
    rules={[{ required: true, message: 'Please input your password!' }]}
  >
    <Input.Password placeholder="Enter your password" />
  </Form.Item>

  <Form.Item
    label="Confirm Password"
    name="password2"
    rules={[{ required: true, message: 'Please confirm your password!' }]}
  >
    <Input.Password placeholder="Confirm your password" />
  </Form.Item>

  <Form.Item
    label="Full Name"
    name="full_name"
    rules={[{ required: true, message: 'Please input your full name!' }]}
  >
    <Input placeholder="Enter your full name" />
  </Form.Item>

  <Form.Item
    label="Phone Number"
    name="phone_number"
  >
    <Input placeholder="Enter your phone number" />
  </Form.Item>

  <Form.Item
    label="Date of Birth"
    name="date_of_birth"
    rules={[
      { required: true, message: 'Please select your date of birth!' },
      {
        pattern: /^\d{4}-\d{2}-\d{2}$/,
        message: 'Date must be in the format YYYY-MM-DD!',
      },
    ]}
  >
    <Input type="date" />
  </Form.Item>

  <Form.Item
    label="Address"
    name="address"
  >
    <Input placeholder="Enter your address" />
  </Form.Item>

  <Form.Item
    label="User Type"
    name="user_type"
    rules={[{ required: true, message: 'Please select your user type!' }]}
  >
    <Select placeholder="Select user type">
      <Select.Option value="admin">Admin</Select.Option>
      <Select.Option value="user">User</Select.Option>
    </Select>
  </Form.Item>

  <Form.Item>
    <Button type="primary" htmlType="submit" block loading={loading}>
      Register
    </Button>
  </Form.Item>
</Form>

        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Space>
            <span>Already have an account?</span>
            <Link to="/login">
              <Button type="link">Login here</Button>
            </Link>
          </Space>
        </div>
      </Content>
    </Layout>
  );
};

export default Register;
