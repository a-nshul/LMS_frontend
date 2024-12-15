import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, DatePicker, message, Avatar } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';
import Sidebar from './Sidebar';

const { Option } = Select;

const Attendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();

  const token = localStorage.getItem('authToken'); // JWT Token from localStorage
  const userId = localStorage.getItem('userId'); // User ID from localStorage

  useEffect(() => {
    fetchAttendance();
    fetchUserDetails(); // Fetch user details on component load
  }, [token]);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/attendence', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAttendanceData(response.data.attendance); // Assuming API returns "attendance" array
    } catch (error) {
      message.error('Failed to fetch attendance data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserDetails(response.data.user); // Assuming API returns "user" object
    } catch (error) {
      message.error('Failed to fetch user details.');
    }
  };

  const handleAddOrEdit = async (values) => {
    const payload = {
      ...values,
      student: userId,
      date: dayjs(values.date).format('YYYY-MM-DD'), // Format date
    };

    try {
      if (editingRecord) {
        // Update existing record
        await axios.put(`http://localhost:3001/api/attendence/${editingRecord._id}`, payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success('Attendance updated successfully.');
      } else {
        // Add new record
        await axios.post('http://localhost:3001/api/attendence', payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        message.success('Attendance added successfully.');
      }
      setModalVisible(false);
      setEditingRecord(null);
      form.resetFields();
      fetchAttendance(); // Refresh data
    } catch (error) {
      message.error('Failed to save attendance.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/attendence/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      message.success('Attendance deleted successfully.');
      setAttendanceData(attendanceData.filter((record) => record._id !== id));
    } catch (error) {
      message.error('Failed to delete attendance.');
    }
  };

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={() => {
              setEditingRecord(record);
              form.setFieldsValue({ ...record, date: dayjs(record.date) });
              setModalVisible(true);
            }}
          >
            Edit
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record._id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="ml-64 p-6 w-full">
        {/* User Details */}
        {/* User Details with Online Status */}
          {userDetails && (
            <div className="flex items-center justify-between mb-6 bg-gray-100 p-4 rounded-md shadow-md">
              <div className="flex items-center relative">
                <Avatar
                  src={userDetails.profileImage || null} // Use profileImage if available
                  size={64}
                  style={{ backgroundColor: '#87d068' }} // Background color for default avatar
                >
                  {userDetails.profileImage ? null : userDetails.name?.[0]?.toUpperCase() || 'U'}
                </Avatar>
                {/* Online Status Badge */}
                <span
                  className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"
                  style={{ transform: 'translate(50%, 50%)' }}
                ></span>
                <div className="ml-4">
                  <h2 className="text-xl font-semibold">{userDetails.name || 'User Name'}</h2>
                  <p className="text-gray-500">{userDetails.email || 'user@example.com'}</p>
                </div>
              </div>
            </div>
          )}


        {/* Attendance Section */}
        <h2 className="text-3xl font-semibold mb-6">Attendance</h2>
        <Button type="primary" onClick={() => setModalVisible(true)} style={{ marginBottom: 16 }}>
          Add Attendance
        </Button>
        <Table
          columns={columns}
          dataSource={attendanceData}
          rowKey="_id"
          loading={loading}
          bordered
          pagination={{ pageSize: 10 }}
        />
        <Modal
          title={editingRecord ? 'Edit Attendance' : 'Add Attendance'}
          visible={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            setEditingRecord(null);
            form.resetFields();
          }}
          onOk={() => form.submit()}
        >
          <Form form={form} onFinish={handleAddOrEdit} layout="vertical">
            <Form.Item
              label="Date"
              name="date"
              rules={[{ required: true, message: 'Please select a date!' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label="Status"
              name="status"
              rules={[{ required: true, message: 'Please select a status!' }]}
            >
              <Select placeholder="Select status">
                <Option value="Present">Present</Option>
                <Option value="Absent">Absent</Option>
                <Option value="Late">Late</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Course"
              name="course"
              rules={[{ required: true, message: 'Please enter the course!' }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Attendance;
