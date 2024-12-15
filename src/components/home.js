import React, { useEffect, useState } from 'react';
import { Layout, Table, Button, Modal, message } from 'antd';
import axios from 'axios';
import Sidebar from './Sidebar';

const { Content } = Layout;

const Home = () => {
  const [user, setUser] = useState(null); // Store the current user's data
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false); // Modal visibility
  const [selectedUser, setSelectedUser] = useState(null); // Data for the modal

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem('userId'); // Retrieve user ID from local storage
      const token = localStorage.getItem('authToken'); // Retrieve token

      if (!userId || !token) {
        message.error('You are not authorized! Please log in again.');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:3001/api/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        setUser(response.data.user); // Assume response contains a "user" object
      } catch (error) {
        message.error('Failed to fetch user data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleView = (record) => {
    setSelectedUser(record); // Set the data for the modal
    setIsModalVisible(true); // Show the modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Close the modal
    setSelectedUser(null); // Clear selected user data
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="link"
          className="transition-all transform hover:scale-105 text-blue-500 hover:text-blue-700"
          onClick={() => handleView(record)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <Layout>
      <Sidebar />
      <Layout style={{ marginLeft: 250 }}>
        <Content
          style={{
            padding: '24px',
            background: '#f0f2f5',
            minHeight: '100vh',
          }}
          className="animate-fadeIn"
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 transition-all transform hover:scale-105">
            User Dashboard
          </h2>
          <Table
            columns={columns}
            dataSource={user ? [user] : []} // Pass the current user data in an array
            rowKey="_id"
            loading={loading}
            pagination={false} // Disable pagination for a single user
            className="shadow-lg rounded-lg overflow-hidden"
            rowClassName="hover:bg-gray-100 transition-colors"
          />
        </Content>
      </Layout>

      {/* Modal for displaying user details */}
      <Modal
        title="User Details"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose} className="bg-red-500 text-white hover:bg-red-600">
            Close
          </Button>,
        ]}
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <span className="font-semibold text-gray-700">Name:</span> {selectedUser.name}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Email:</span> {selectedUser.email}
            </div>
            <div>
              <span className="font-semibold text-gray-700">Role:</span> {selectedUser.role}
            </div>
            {/* Add more user fields here */}
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default Home;
