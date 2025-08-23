import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button } from 'antd';
import { IMedia } from '@/types/IResumeTypes';
import styles from './Modal.module.scss';

const { Option } = Select;

interface MediaModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (mediaData: Partial<IMedia>) => void;
  media?: IMedia | null;
  isEditing?: boolean;
}

const MediaModal: React.FC<MediaModalProps> = ({ visible, onClose, onSubmit, media, isEditing = false }) => {
  const [form] = Form.useForm();

  // Reset form when modal opens/closes or when media changes
  useEffect(() => {
    if (visible) {
      if (isEditing && media) {
        form.setFieldsValue({
          kind: media.kind,
          url: media.url,
          label: media.label,
        });
      } else {
        form.resetFields();
      }
    }
  }, [visible, media, isEditing, form]);

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

  // URL validation based on media type
  const validateUrl = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('Please enter a URL');
    }

    try {
      new URL(value);
      return Promise.resolve();
    } catch {
      return Promise.reject('Please enter a valid URL');
    }
  };

  return (
    <Modal
      title={isEditing ? 'Edit Media' : 'Add Media'}
      open={visible}
      onCancel={handleCancel}
      width={600}
      className={styles.modal}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {isEditing ? 'Update Media' : 'Add Media'}
        </Button>,
      ]}
    >
      <div className={styles.modalContent}>
        <Form form={form} layout="vertical" className={styles.form} requiredMark={false}>
          {/* Media Type */}
          <Form.Item name="kind" label="Media Type" rules={[{ required: true, message: 'Please select a media type' }]}>
            <Select placeholder="Select media type" size="large">
              <Option value="video">🎥 Video</Option>
              <Option value="image">📷 Image</Option>
              <Option value="link">🔗 Link</Option>
            </Select>
          </Form.Item>

          {/* Media Label */}
          <Form.Item name="label" label="Label/Title" rules={[{ max: 100, message: 'Label must be less than 100 characters' }]}>
            <Input placeholder="e.g., Game Highlights, Training Video, Team Photo" size="large" />
          </Form.Item>

          {/* Media URL */}
          <Form.Item
            name="url"
            label="URL"
            rules={[{ required: true, message: 'Please enter a URL' }, { validator: validateUrl }]}
            extra="Paste the link to your video, image, or webpage"
          >
            <Input placeholder="https://example.com/media" size="large" type="url" />
          </Form.Item>
        </Form>

        {/* Helper text based on media type */}
        <div className={styles.helperText}>
          <h4>Supported Platforms:</h4>
          <ul>
            <li>
              <strong>Video:</strong> YouTube, Vimeo, Hudl, direct video links
            </li>
            <li>
              <strong>Image:</strong> Direct image links, Google Drive, Dropbox
            </li>
            <li>
              <strong>Link:</strong> Personal websites, social media profiles, articles
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default MediaModal;
