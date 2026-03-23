'use client';
import React from 'react';
import { Modal, Typography, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface CancelAccountModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CancelAccountModal: React.FC<CancelAccountModalProps> = ({ isVisible, onConfirm, onCancel, isLoading = false }) => {
  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
          <span>Cancel Account</span>
        </Space>
      }
      open={isVisible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Yes, Cancel My Account"
      cancelText="Keep My Account"
      okButtonProps={{
        danger: true,
        loading: isLoading,
      }}
      width={480}
      centered
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Title level={5} style={{ color: '#ff4d4f', margin: 0 }}>
          Are you sure you want to cancel your account?
        </Title>
        <Text style={{ fontSize: '14px', color: '#333' }}>
          Your account will be cancelled at the end of your current billing period. Until then, you will retain access to all features.
        </Text>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          Once the billing period ends, your profile will no longer be discoverable by teams and agents. Your account will not be permanently deleted.
        </Text>
      </Space>
    </Modal>
  );
};

export default CancelAccountModal;
