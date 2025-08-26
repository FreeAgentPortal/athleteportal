import React, { useEffect } from 'react';
import { Modal, Form, Input, Button } from 'antd';
import { IReference } from '@/types/IResumeTypes';
import styles from './Modal.module.scss';

interface ReferenceModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (referenceData: Partial<IReference>) => void;
  reference?: IReference | null;
  isEditing?: boolean;
}

const ReferenceModal: React.FC<ReferenceModalProps> = ({ visible, onClose, onSubmit, reference, isEditing = false }) => {
  const [form] = Form.useForm();

  // Reset form when modal opens/closes or when reference changes
  useEffect(() => {
    if (visible) {
      if (isEditing && reference) {
        form.setFieldsValue({
          name: reference.name,
          role: reference.role,
          organization: reference.organization,
          email: reference.contact?.email,
          phone: reference.contact?.phone,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, reference, isEditing, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Structure the data to match IReference interface
      const referenceData = {
        name: values.name,
        role: values.role,
        organization: values.organization,
        contact: {
          email: values.email,
          phone: values.phone,
        },
      };

      onSubmit(referenceData);
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
      title={isEditing ? 'Edit Reference' : 'Add Reference'}
      open={visible}
      onCancel={handleCancel}
      width={600}
      className={styles.modal}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {isEditing ? 'Update Reference' : 'Add Reference'}
        </Button>,
      ]}
    >
      <div className={styles.modalContent}>
        <Form form={form} layout="vertical" className={styles.form} requiredMark={false}>
          {/* Reference Name */}
          <Form.Item
            name="name"
            label="Full Name"
            rules={[
              { required: true, message: 'Please enter the reference name' },
              { max: 100, message: 'Name must be less than 100 characters' },
            ]}
          >
            <Input placeholder="e.g., John Smith" size="large" />
          </Form.Item>

          {/* Role */}
          <Form.Item name="role" label="Role/Position" rules={[{ max: 100, message: 'Role must be less than 100 characters' }]}>
            <Input placeholder="e.g., Head Coach, Athletic Director, Trainer" size="large" />
          </Form.Item>

          {/* Organization */}
          <Form.Item name="organization" label="Organization" rules={[{ max: 150, message: 'Organization name must be less than 150 characters' }]}>
            <Input placeholder="e.g., University Name, Team, Training Facility" size="large" />
          </Form.Item>

          {/* Email */}
          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { type: 'email', message: 'Please enter a valid email address' },
              { max: 100, message: 'Email must be less than 100 characters' },
            ]}
          >
            <Input placeholder="e.g., coach@university.edu" size="large" type="email" />
          </Form.Item>

          {/* Phone */}
          <Form.Item name="phone" label="Phone Number" rules={[{ max: 20, message: 'Phone number must be less than 20 characters' }]}>
            <Input placeholder="e.g., (555) 123-4567" size="large" type="tel" />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default ReferenceModal;
