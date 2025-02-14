import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../api/apibackend';

const LogoutButton = () => {
  const navigate = useNavigate();

  
  const handleLogout = async () => {
    await logoutUser();
    navigate('/login');
  };

  return (
    <Button type="primary" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default LogoutButton;
