import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, CalendarOutlined, FileTextOutlined, LogoutOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear session data or tokens if needed
    navigate('/');
  };

  return (
    <Sider
      width={250}
      className="bg-gray-800 text-white fixed left-0 top-0 bottom-0 flex flex-col"
      style={{ height: '100vh' }}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-center text-xl font-semibold py-4 text-white bg-indigo-600">
        <h2>LMS Project</h2>
      </div>

      {/* Sidebar Menu */}
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} className="flex-1">
        <Menu.Item key="1" icon={<DashboardOutlined />} className="hover:bg-indigo-600">
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<CalendarOutlined />} className="hover:bg-indigo-600">
          <Link to="/attendance">Attendance</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<FileTextOutlined />} className="hover:bg-indigo-600">
          <Link to="/assignments">Assignments</Link>
        </Menu.Item>
      </Menu>

      {/* Logout Button at the Bottom */}
      <div className="flex items-center justify-center py-4 border-t border-gray-700">
        <button
          className="flex items-center text-white gap-2 hover:text-indigo-500"
          onClick={handleLogout}
        >
          <LogoutOutlined />
          Logout
        </button>
      </div>
    </Sider>
  );
};

export default Sidebar;
