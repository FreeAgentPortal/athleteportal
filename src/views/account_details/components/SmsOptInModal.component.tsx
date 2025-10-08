'use client';
import React from 'react';
import { Modal, Typography, Checkbox, Space } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

interface SmsOptInModalProps {
  isVisible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  businessName?: string;
  messagesPerMonth?: number;
}

const SmsOptInModal: React.FC<SmsOptInModalProps> = ({ isVisible, onConfirm, onCancel, isLoading = false, businessName = 'FreeAgentPortal', messagesPerMonth = 10 }) => {
  const [agreed, setAgreed] = React.useState(false);

  // Reset agreement state when modal opens/closes
  React.useEffect(() => {
    if (isVisible) {
      setAgreed(false);
    }
  }, [isVisible]);

  const handleConfirm = () => {
    if (agreed) {
      onConfirm();
      setAgreed(false); // Reset for next time
    }
  };

  const handleCancel = () => {
    setAgreed(false);
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <ExclamationCircleOutlined style={{ color: '#faad14' }} />
          <span>SMS Notifications Opt-In</span>
        </Space>
      }
      open={isVisible}
      onOk={handleConfirm}
      onCancel={handleCancel}
      okText="Agree & Enable SMS"
      cancelText="Cancel"
      okButtonProps={{
        disabled: !agreed,
        loading: isLoading,
      }}
      width={500}
      centered
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <Title level={5}>SMS Opt-In Agreement</Title>
          <Text style={{ fontSize: '14px', color: '#333' }}>
            By opting in, you agree to receive informational, marketing, and customer care related text messages from <strong>{businessName}</strong>. You may receive up to{' '}
            <strong>{messagesPerMonth} messages per month</strong>. Message and data rates may apply. Reply <strong>STOP</strong> to unsubscribe at any time.
          </Text>
        </div>

        <div>
          <Text type="secondary" style={{ fontSize: '12px', color: '#666' }}>
            <strong>Additional Terms:</strong>
            <br />
            • Carriers are not liable for delayed or undelivered messages
            <br />
            • You can opt out at any time by replying STOP
            <br />
            • For help, reply HELP or contact customer support
            <br />• Your consent is not required to make a purchase
          </Text>
        </div>

        <div>
          <Text type="secondary" style={{ fontSize: '12px', color: '#666' }}>
            <strong>Privacy Notice:</strong> Your information will be used in accordance with our{' '}
            <a href="https://thefreeagentportal.com/legal/privacy" target="_blank" rel="noopener noreferrer">
              Privacy Policy
            </a>
            . We respect your privacy and will not share your information with third parties without your consent.
          </Text>
        </div>
        <div>
          <Text type="secondary" style={{ fontSize: '12px', color: '#666' }}>
            <strong>SMS Policy Notice:</strong> Please review our{' '}
            <a href="https://thefreeagentportal.com/legal/sms-terms" target="_blank" rel="noopener noreferrer">
              SMS Policy
            </a>
            . By opting in, you agree to comply with the terms outlined in our SMS Policy.
          </Text>
        </div>

        <Checkbox checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ alignSelf: 'flex-start' }}>
          <Text style={{ fontSize: '14px', color: '#333' }}>I have read and agree to the SMS opt-in terms and conditions above</Text>
        </Checkbox>
      </Space>
    </Modal>
  );
};

export default SmsOptInModal;
