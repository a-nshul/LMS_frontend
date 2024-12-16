import React, { useState, useEffect, useCallback } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Sidebar from './Sidebar';
import axios from 'axios';
import moment from 'moment';

const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [form] = Form.useForm();
  const token = localStorage.getItem('authToken');
  const userRole = localStorage.getItem('role') || 'student';

  // Fetch assignments using useCallback to avoid redefining the function
  const fetchAssignments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/attendence', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAssignments(response.data.assignments || []);
    } catch (error) {
      message.error('Failed to fetch assignments.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  // useEffect to call fetchAssignments
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Open the create assignment modal
  const handleCreateAssignment = () => {
    setIsCreateModalOpen(true);
    form.resetFields();
  };

  // Open the submit assignment modal
  const handleSubmitAssignment = (assignmentId) => {
    setIsSubmitModalOpen(true);
    form.setFieldsValue({ assignmentId });
  };

  // Create assignment API call
  const handleAddAssignment = async (values) => {
    try {
      const { teacherName, teacherEmail, title, description, dueDate } = values;
      const formattedValues = {
        teacherName,
        teacherEmail,
        title,
        description,
        dueDate: dueDate.format('YYYY-MM-DD'),
      };

      await axios.post('http://localhost:3001/api/attendence/create', formattedValues, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success('Assignment created successfully.');
      fetchAssignments();
      setIsCreateModalOpen(false);
    } catch (error) {
      message.error('Failed to create assignment.');
    }
  };

  // Submit assignment with file upload
  const handleUploadAssignment = async (values) => {
    try {
      const formData = new FormData();
      formData.append('file', values.file.file);
      formData.append('studentName', values.studentName);
      formData.append('studentEmail', values.studentEmail);

      await axios.post(
        `http://localhost:3001/api/attendence/submit/${values.assignmentId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      message.success('Assignment submitted successfully.');
      setIsSubmitModalOpen(false);
      fetchAssignments();
    } catch (error) {
      message.error('Failed to submit assignment.');
    }
  };

  // Table columns
  const columns = [
    { title: 'Teacher', dataIndex: 'teacherName', key: 'teacherName' },
    { title: 'Title', dataIndex: 'title', key: 'title' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date) => moment(date).format('YYYY-MM-DD'),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button
          type="primary"
          onClick={() => handleSubmitAssignment(record._id)}
          className="transition-transform duration-300 transform hover:scale-105 hover:bg-blue-700"
        >
          Submit Assignment
        </Button>
      ),
    },
  ];

  return (
    <div className="flex">
      <div className="w-1/4">
        <Sidebar />
      </div>
      <div className="p-6 w-3/4">
        <h2 className="text-2xl font-bold mb-4">Assignments</h2>
        <div className="flex gap-4 mb-4">
          {userRole === 'teacher' && (
            <Button
              type="primary"
              onClick={handleCreateAssignment}
              className="transition-transform duration-300 transform hover:scale-105 hover:bg-green-700"
            >
              Create Assignment
            </Button>
          )}
        </div>
        <Table
          dataSource={assignments}
          columns={columns}
          rowKey="_id"
          loading={loading}
          className="transition-transform duration-300 transform hover:scale-105"
        />

        {/* Modal for creating an assignment */}
        <Modal
          title="Create Assignment"
          open={isCreateModalOpen}
          onCancel={() => setIsCreateModalOpen(false)}
          onOk={() => form.submit()}
          className="transition-all duration-300 ease-in-out"
        >
          <Form form={form} layout="vertical" onFinish={handleAddAssignment}>
            <Form.Item
              name="teacherName"
              label="Teacher Name"
              rules={[{ required: true, message: 'Please enter the teacher name.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="teacherEmail"
              label="Teacher Email"
              rules={[{ required: true, message: 'Please enter the teacher email.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="title"
              label="Title"
              rules={[{ required: true, message: 'Please enter the title.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[{ required: true, message: 'Please enter the description.' }]}
            >
              <Input.TextArea rows={4} />
            </Form.Item>
            <Form.Item
              name="dueDate"
              label="Due Date"
              rules={[{ required: true, message: 'Please select the due date.' }]}
            >
              <DatePicker className="w-full" />
            </Form.Item>
          </Form>
        </Modal>

        {/* Modal for submitting an assignment */}
        <Modal
          title="Submit Assignment"
          open={isSubmitModalOpen}
          onCancel={() => setIsSubmitModalOpen(false)}
          onOk={() => form.submit()}
          className="transition-all duration-300 ease-in-out"
        >
          <Form form={form} layout="vertical" onFinish={handleUploadAssignment}>
            <Form.Item
              name="studentName"
              label="Student Name"
              rules={[{ required: true, message: 'Please enter your name.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="studentEmail"
              label="Student Email"
              rules={[{ required: true, message: 'Please enter your email.' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="file"
              label="Upload File"
              rules={[{ required: true, message: 'Please upload your assignment.' }]}
            >
              <Upload beforeUpload={() => false} maxCount={1}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Assignments;
