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
          This action cannot be undone
        </Title>
        <Text style={{ fontSize: '14px', color: '#333' }}>
          Are you sure you want to cancel your account? All of your data, including your profile, posts, and billing information, will be permanently deleted.
        </Text>
        <Text type="secondary" style={{ fontSize: '13px' }}>
          If you have an active subscription, it will be cancelled immediately and you will lose access to all premium features.
        </Text>
      </Space>
    </Modal>
  );
};

export default CancelAccountModal;
