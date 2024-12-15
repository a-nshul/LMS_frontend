import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { DashboardOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = () => {
  return (
    <Sider
      width={250}
      className="bg-gray-800 text-white fixed left-0 top-0 bottom-0"
      style={{ height: '100vh' }}
    >
      <div className="flex items-center justify-center text-xl font-semibold py-4 text-white bg-indigo-600">
        <h2>LMS Project</h2>
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
        <Menu.Item key="1" icon={<DashboardOutlined />} className="hover:bg-indigo-600">
          <Link to="/dashboard">Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="2" icon={<CalendarOutlined />} className="hover:bg-indigo-600">
          <Link to="/attendance">Attendance</Link>
        </Menu.Item>
        <Menu.Item key="3" icon={<FileTextOutlined />} className="hover:bg-indigo-600">
          <Link to="/assignments">Assignments</Link>
        </Menu.Item>
        {/* Add more menu items here */}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
