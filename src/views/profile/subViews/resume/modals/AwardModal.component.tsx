import React, { useEffect } from 'react';
import { Modal, Form, Input, InputNumber, Button, Space } from 'antd';
import { IAward } from '@/types/IResumeTypes';
import styles from './Modal.module.scss';

const { TextArea } = Input;

interface AwardModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (awardData: Partial<IAward>) => void;
  award?: IAward | null;
  isEditing?: boolean;
}

const AwardModal: React.FC<AwardModalProps> = ({ visible, onClose, onSubmit, award, isEditing = false }) => {
  const [form] = Form.useForm();

  // Reset form when modal opens/closes or when award changes
  useEffect(() => {
    if (visible) {
      if (isEditing && award) {
        form.setFieldsValue({
          title: award.title,
          org: award.org,
          year: award.year,
          description: award.description,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, award, isEditing, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={isEditing ? 'Edit Award' : 'Add Award'}
      open={visible}
      onCancel={handleCancel}
      width={600}
      className={styles.modal}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {isEditing ? 'Update Award' : 'Add Award'}
        </Button>,
      ]}
    >
      <div className={styles.modalContent}>
        <Form form={form} layout="vertical" className={styles.form} requiredMark={false}>
          {/* Award Title */}
          <Form.Item
            name="title"
            label="Award Title"
            rules={[
              { required: true, message: 'Please enter the award title' },
              { max: 100, message: 'Title must be less than 100 characters' },
            ]}
          >
            <Input placeholder="e.g., MVP, All-Conference, Student-Athlete of the Year" size="large" />
          </Form.Item>

          {/* Organization */}
          <Form.Item name="org" label="Issuing Organization" rules={[{ max: 100, message: 'Organization name must be less than 100 characters' }]}>
            <Input placeholder="e.g., NCAA, Conference, League, School" size="large" />
          </Form.Item>

          {/* Year */}
          <Form.Item name="year" label="Year Received" rules={[{ type: 'number', min: 1900, max: new Date().getFullYear() + 1, message: 'Please enter a valid year' }]}>
            <InputNumber placeholder="e.g., 2024" size="large" style={{ width: '100%' }} min={1900} max={new Date().getFullYear() + 1} />
          </Form.Item>

          {/* Description */}
          <Form.Item name="description" label="Description (Optional)" rules={[{ max: 500, message: 'Description must be less than 500 characters' }]}>
            <TextArea placeholder="Describe the award, criteria, or significance..." rows={4} size="large" showCount maxLength={500} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AwardModal;
