'use client';
import React, { useState, useMemo } from 'react';
import styles from './SmsOptInWrapper.module.scss';
import { Modal, Checkbox, Button, Typography, Space } from 'antd';
import { useUser } from '@/state/auth';
import useApiHook from '@/hooks/useApi';
import { useBilling } from '@/hooks/useBilling';
import { MessageOutlined } from '@ant-design/icons';

interface SmsOptInWrapperProps {
  children: React.ReactNode;
}

const SmsOptInWrapper: React.FC<SmsOptInWrapperProps> = ({ children }) => {
  const { data: loggedInData, isLoading: userIsLoading, refetch: refetchUser } = useUser();
  const { data: billingData, isLoading: billingIsLoading } = useBilling();

  // Check if user has a plan with SMS feature
  const hasSmsFeature = useMemo(() => {
    if (!billingData?.plan) return false;

    // Check if the plan includes SMS texting feature
    const plan = billingData.plan;
    return plan?.features?.some((feature) => feature === ('68a3643e21efeb4bc4d75d31' as any) || false);
  }, [billingData]);

  // Check if smsNotifications setting exists (undefined means they haven't made a choice yet)
  const hasSetSmsPreference = useMemo(() => {
    // Check if both specific SMS notification settings exist
    const hasAccountNotificationSMS = loggedInData?.notificationSettings?.accountNotificationSMS !== undefined;
    const hasEventNotificationSMS = loggedInData?.notificationSettings?.eventNotificationSMS !== undefined;

    // Only hide modal if both settings are defined
    return hasAccountNotificationSMS && hasEventNotificationSMS;
  }, [loggedInData]);

  // Determine if we should show the modal
  const showModal = !userIsLoading && !billingIsLoading && hasSmsFeature && !hasSetSmsPreference;

  // Modal state
  const [agreedToOptIn, setAgreedToOptIn] = useState(false);
  const [accountNotificationSMS, setAccountNotificationSMS] = useState(false);
  const [eventNotificationSMS, setEventNotificationSMS] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Submit handler
  const { mutate: updateNotificationSettings } = useApiHook({
    method: 'PUT',
    key: ['updateSmsNotificationSetting'],
    queriesToInvalidate: ['user'],
  }) as any;

  const handleOptIn = () => {
    if (!loggedInData) return;
    setSubmitting(true);

    // Update notificationSettings with SMS opt-in for selected notification types
    const newNotificationSettings = {
      ...(loggedInData.notificationSettings || {}),
      smsNotifications: accountNotificationSMS || eventNotificationSMS, // General SMS setting
      accountNotificationSMS,
      eventNotificationSMS,
    };

    updateNotificationSettings(
      {
        url: `/user/${loggedInData._id}`,
        formData: { notificationSettings: newNotificationSettings },
      },
      {
        onSuccess: () => {
          setSubmitting(false);
          setAgreedToOptIn(false);
          setAccountNotificationSMS(false);
          setEventNotificationSMS(false);
          refetchUser();
        },
        onError: () => {
          setSubmitting(false);
        },
      }
    );
  };

  const handleOptOut = () => {
    if (!loggedInData) return;
    setSubmitting(true);

    // Update notificationSettings with SMS opt-out for all types
    const newNotificationSettings = {
      ...(loggedInData.notificationSettings || {}),
      smsNotifications: false,
      accountNotificationSMS: false,
      eventNotificationSMS: false,
    };

    updateNotificationSettings(
      {
        url: `/user/${loggedInData._id}`,
        formData: { notificationSettings: newNotificationSettings },
      },
      {
        onSuccess: () => {
          setSubmitting(false);
          refetchUser();
        },
        onError: () => {
          setSubmitting(false);
        },
      }
    );
  };

  return (
    <>
      <div className={styles.wrapper}>{children}</div>
      <Modal
        open={showModal}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <MessageOutlined style={{ fontSize: 24, color: '#faad14' }} />
            <span style={{ fontWeight: 600, fontSize: 18 }}>SMS Notifications Opt-In</span>
          </div>
        }
        closable={false}
        maskClosable={false}
        footer={null}
        centered
        bodyStyle={{ borderRadius: 12, background: '#fafcff', padding: 32 }}
        style={{ width: 'auto', maxWidth: 600 }}
        wrapClassName={styles.smsOptInModal}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Typography.Title level={5} style={{ marginBottom: 8 }}>
              SMS Opt-In Agreement
            </Typography.Title>
            <Typography.Text style={{ fontSize: '14px', color: '#333' }}>
              By opting in, you agree to receive informational, marketing, and customer care related text messages from <strong>FreeAgentPortal</strong>. You may receive up to{' '}
              <strong>30 messages per month</strong>. Message and data rates may apply. Reply <strong>STOP</strong> to unsubscribe at any time.
            </Typography.Text>
          </div>

          <div>
            <Typography.Text type="secondary" style={{ fontSize: '12px', color: '#666' }}>
              <strong>Additional Terms:</strong>
              <br />
              • Carriers are not liable for delayed or undelivered messages
              <br />
              • You can opt out at any time by replying STOP
              <br />
              • For help, reply HELP or contact customer support
              <br />• Your consent is not required to make a purchase
            </Typography.Text>
          </div>

          <div>
            <Typography.Text type="secondary" style={{ fontSize: '12px', color: '#666' }}>
              <strong>Privacy Notice:</strong> Your information will be used in accordance with our{' '}
              <a href="https://thefreeagentportal.com/legal/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
              </a>
              . We respect your privacy and will not share your information with third parties without your consent.
            </Typography.Text>
          </div>

          <div>
            <Typography.Text type="secondary" style={{ fontSize: '12px', color: '#666' }}>
              <strong>SMS Policy Notice:</strong> Please review our{' '}
              <a href="https://thefreeagentportal.com/legal/sms-terms" target="_blank" rel="noopener noreferrer">
                SMS Policy
              </a>
              . By opting in, you agree to comply with the terms outlined in our SMS Policy.
            </Typography.Text>
          </div>

          <div>
            <Typography.Title level={5} style={{ marginBottom: 12, marginTop: 8 }}>
              Select Notification Types
            </Typography.Title>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Checkbox checked={accountNotificationSMS} onChange={(e) => setAccountNotificationSMS(e.target.checked)} style={{ alignItems: 'flex-start' }}>
                <div>
                  <Typography.Text strong style={{ fontSize: '14px', color: '#333', display: 'block' }}>
                    Account Notifications
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                    Billing updates, password changes, security alerts, and account-related messages
                  </Typography.Text>
                </div>
              </Checkbox>

              <Checkbox checked={eventNotificationSMS} onChange={(e) => setEventNotificationSMS(e.target.checked)} style={{ alignItems: 'flex-start' }}>
                <div>
                  <Typography.Text strong style={{ fontSize: '14px', color: '#333', display: 'block' }}>
                    Event Notifications
                  </Typography.Text>
                  <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                    Event registrations, schedule changes, team announcements, and deadline reminders
                  </Typography.Text>
                </div>
              </Checkbox>
            </Space>
          </div>

          <div style={{ marginBottom: 8 }}>
            <Checkbox checked={agreedToOptIn} onChange={(e) => setAgreedToOptIn(e.target.checked)} style={{ alignItems: 'flex-start' }}>
              <Typography.Text style={{ fontSize: '14px', color: '#333' }}>I have read and agree to the SMS opt-in terms and conditions above</Typography.Text>
            </Checkbox>
          </div>
        </Space>

        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <Button
            type="primary"
            block
            disabled={!agreedToOptIn || (!accountNotificationSMS && !eventNotificationSMS) || submitting}
            loading={submitting}
            onClick={handleOptIn}
            style={{ fontWeight: 600, fontSize: 15, height: 44 }}
          >
            Agree &amp; Enable SMS
          </Button>
          <Button block disabled={submitting} loading={submitting} onClick={handleOptOut} style={{ fontWeight: 500, fontSize: 14, height: 40 }}>
            No Thanks
          </Button>
        </Space>
      </Modal>
    </>
  );
};

export default SmsOptInWrapper;
