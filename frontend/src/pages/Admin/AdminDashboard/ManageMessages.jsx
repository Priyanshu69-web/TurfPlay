import React, { useState, useEffect } from 'react';
import DashboardHeader from '../../../components/Dashboard/DashboardHeader';
import DataTable from '../../../components/Dashboard/DataTable';
import Modal from '../../../components/Dashboard/Modal';
import Button from '../../../components/Dashboard/Button';
import axiosInstance from '../../../utils/axiosInstance';
import { toast } from 'sonner';

const ManageMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/v1/admin/messages');
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowModal(true);

    if (!message.isRead) {
      markAsRead(message._id);
    }
  };

  const markAsRead = async (messageId) => {
    try {
      await axiosInstance.put(`/api/v1/admin/messages/${messageId}`, {
        isRead: true,
      });
      fetchMessages();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await axiosInstance.delete(`/api/v1/admin/messages/${messageId}`);
      toast.success('Message deleted successfully');
      fetchMessages();
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject' },
    {
      key: 'message',
      label: 'Message',
      render: (val) => val?.substring(0, 50) + '...',
    },
    {
      key: 'isRead',
      label: 'Status',
      render: (val) => (
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          val ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
        }`}>
          {val ? 'Read' : 'Unread'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <DashboardHeader
        title="Contact Messages"
        subtitle="View and manage contact form submissions"
      />

      <div className="bg-white rounded-lg shadow-md p-6">
        <DataTable
          columns={columns}
          data={messages}
          loading={loading}
          onEdit={handleViewMessage}
          onDelete={handleDeleteMessage}
        />
      </div>

      {/* Message Detail Modal */}
      <Modal
        isOpen={showModal}
        title="Message Details"
        onClose={() => setShowModal(false)}
        size="lg"
      >
        {selectedMessage && (
          <div className="space-y-4">
            <div>
              <label className="font-semibold text-gray-700">Name:</label>
              <p className="text-gray-600">{selectedMessage.name}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Email:</label>
              <p className="text-gray-600">{selectedMessage.email}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Phone:</label>
              <p className="text-gray-600">{selectedMessage.phone || 'N/A'}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Subject:</label>
              <p className="text-gray-600">{selectedMessage.subject}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Message:</label>
              <p className="text-gray-600 whitespace-pre-wrap">{selectedMessage.message}</p>
            </div>
            <div>
              <label className="font-semibold text-gray-700">Sent:</label>
              <p className="text-gray-600">
                {new Date(selectedMessage.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ManageMessages;
