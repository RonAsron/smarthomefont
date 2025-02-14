// src/App.js
import React, { useState } from "react";
import { Layout } from "antd";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import HeaderBar from "./components/HeaderBar";
import AppRoutes from "./routes/AppRoutes";
import "antd/dist/reset.css";
import "./App.css";

const { Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <Layout>
          <HeaderBar collapsed={collapsed} setCollapsed={setCollapsed} />
          <Content style={{ margin: "16px" }}>
            <AppRoutes />
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
