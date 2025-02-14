import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/apibackend";
import { Form, Input, Button, Alert, Layout, Typography } from "antd";
import { Link } from "react-router-dom";

const { Title } = Typography;
const { Content } = Layout;

const Login = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const onFinish = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginUser(values);
      localStorage.setItem("accessToken", data.access);
      localStorage.setItem("refreshToken", data.refresh);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Content style={{ maxWidth: "400px", width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <Title level={2}>Login</Title>
        </div>

        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: "20px" }}
          />
        )}

        <Form
          name="login-form"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ email: "", password: "" }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "The input is not valid E-mail!" },
            ]}
          >
            <Input placeholder="Enter your email" type="email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Login
            </Button>
          </Form.Item>
          <Form.Item style={{ textAlign: "center" }}>
            <Link to="/register">Don't have an account? Register here</Link>
          </Form.Item>
        </Form>
      </Content>
    </Layout>
  );
};

export default Login;
