'use client';
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Button, Row, Col, Typography, Divider } from 'antd';
import { IEducation } from '@/types/IResumeTypes';
import dayjs from 'dayjs';
import styles from './Modal.module.scss';

const { TextArea } = Input;
const { Title } = Typography;

interface EducationModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (education: Omit<IEducation, '_id'>) => void;
  education?: IEducation | null;
  isEditing?: boolean;
}

const EducationModal: React.FC<EducationModalProps> = ({ visible, onClose, onSubmit, education, isEditing = false }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      if (education && isEditing) {
        // Populate form with existing education data
        form.setFieldsValue({
          school: education.school,
          degreeOrProgram: education.degreeOrProgram,
          startDate: education.startDate ? dayjs(education.startDate) : null,
          endDate: education.endDate ? dayjs(education.endDate) : null,
          notes: education.notes,
        });
      } else {
        // Reset form for new education
        form.resetFields();
      }
    }
  }, [visible, education, isEditing, form]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();

      const educationData: Omit<IEducation, '_id'> = {
        school: values.school,
        degreeOrProgram: values.degreeOrProgram,
        startDate: values.startDate ? values.startDate.toDate() : undefined,
        endDate: values.endDate ? values.endDate.toDate() : undefined,
        notes: values.notes?.trim() || undefined,
      };

      onSubmit(educationData);
      handleClose();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title={<Title level={3}>{isEditing ? 'Edit Education' : 'Add New Education'}</Title>}
      open={visible}
      onCancel={handleClose}
      width={700}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={isLoading} onClick={handleSubmit}>
          {isEditing ? 'Update Education' : 'Add Education'}
        </Button>,
      ]}
      className={styles.resumeModal}
    >
      <Form form={form} layout="vertical" className={styles.modalForm} validateTrigger="onBlur">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="school"
              label="School/Institution"
              rules={[
                { required: true, message: 'Please enter the school or institution name' },
                { min: 2, message: 'School name must be at least 2 characters' },
              ]}
            >
              <Input placeholder="e.g., University of California, Harvard Business School, Lincoln High School" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="degreeOrProgram" label="Degree/Program">
              <Input placeholder="e.g., Bachelor of Science in Kinesiology, High School Diploma, MBA" />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Duration</Divider>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="startDate" label="Start Date">
              <DatePicker style={{ width: '100%' }} picker="month" placeholder="Select start date" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="endDate" label="End Date" help="Leave blank if you're currently enrolled">
              <DatePicker style={{ width: '100%' }} picker="month" placeholder="Select end date (optional)" />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Additional Notes</Divider>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item name="notes" label="Notes" help="Optional: Add any relevant academic achievements, honors, or details">
              <TextArea placeholder="e.g., Graduated Magna Cum Laude, Student-Athlete Scholar, Dean's List, relevant coursework, etc." rows={4} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EducationModal;
