'use client';
import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, DatePicker, Button, Row, Col, Typography, Divider, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined, PlayCircleOutlined, FileImageOutlined, LinkOutlined } from '@ant-design/icons';
import { IExperience, IMedia } from '@/types/IResumeTypes';
import dayjs from 'dayjs';
import styles from './Modal.module.scss';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

interface ExperienceModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (experience: Omit<IExperience, '_id'>) => void;
  experience?: IExperience | null;
  isEditing?: boolean;
}

const ExperienceModal: React.FC<ExperienceModalProps> = ({ visible, onClose, onSubmit, experience, isEditing = false }) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [achievements, setAchievements] = useState<string[]>(['']);
  const [mediaItems, setMediaItems] = useState<Omit<IMedia, '_id'>[]>([{ kind: 'video', url: '', label: '' }]);

  useEffect(() => {
    if (visible) {
      if (experience && isEditing) {
        // Populate form with existing experience data
        form.setFieldsValue({
          orgName: experience.orgName,
          league: experience.league,
          level: experience.level,
          position: experience.position,
          city: experience.location?.city,
          state: experience.location?.state,
          country: experience.location?.country,
          startDate: experience.startDate ? dayjs(experience.startDate) : null,
          endDate: experience.endDate ? dayjs(experience.endDate) : null,
        });
        setAchievements(experience.achievements?.length ? experience.achievements : ['']);
        setMediaItems(experience.media?.length ? experience.media.map(({ _id, ...rest }) => rest) : [{ kind: 'video', url: '', label: '' }]);
      } else {
        // Reset form for new experience
        form.resetFields();
        setAchievements(['']);
        setMediaItems([{ kind: 'video', url: '', label: '' }]);
      }
    }
  }, [visible, experience, isEditing, form]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();

      // Filter out empty achievements
      const filteredAchievements = achievements.filter((achievement) => achievement.trim() !== '');

      // Filter out empty media items
      const filteredMedia = mediaItems.filter((media) => media.url.trim() !== '');

      const experienceData: Omit<IExperience, '_id'> = {
        orgName: values.orgName,
        league: values.league,
        level: values.level,
        position: values.position,
        location: {
          city: values.city,
          state: values.state,
          country: values.country,
        },
        startDate: values.startDate ? values.startDate.toDate() : undefined,
        endDate: values.endDate ? values.endDate.toDate() : undefined,
        achievements: filteredAchievements.length ? filteredAchievements : undefined,
        stats: {}, // TODO: Add stats functionality later
        media: filteredMedia.length ? (filteredMedia as IMedia[]) : undefined,
      };

      onSubmit(experienceData);
      handleClose();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setAchievements(['']);
    setMediaItems([{ kind: 'video', url: '', label: '' }]);
    onClose();
  };

  const addAchievement = () => {
    setAchievements([...achievements, '']);
  };

  const updateAchievement = (index: number, value: string) => {
    const newAchievements = [...achievements];
    newAchievements[index] = value;
    setAchievements(newAchievements);
  };

  const removeAchievement = (index: number) => {
    if (achievements.length > 1) {
      const newAchievements = achievements.filter((_, i) => i !== index);
      setAchievements(newAchievements);
    }
  };

  // Media management functions
  const addMediaItem = () => {
    setMediaItems([...mediaItems, { kind: 'video', url: '', label: '' }]);
  };

  const updateMediaItem = (index: number, field: keyof Omit<IMedia, '_id'>, value: string) => {
    const newMediaItems = [...mediaItems];
    newMediaItems[index] = { ...newMediaItems[index], [field]: value };
    setMediaItems(newMediaItems);
  };

  const removeMediaItem = (index: number) => {
    if (mediaItems.length > 1) {
      const newMediaItems = mediaItems.filter((_, i) => i !== index);
      setMediaItems(newMediaItems);
    }
  };

  const getMediaIcon = (kind: string) => {
    switch (kind) {
      case 'video':
        return <PlayCircleOutlined />;
      case 'image':
        return <FileImageOutlined />;
      case 'link':
        return <LinkOutlined />;
      default:
        return <LinkOutlined />;
    }
  };

  return (
    <Modal
      title={<Title level={3}>{isEditing ? 'Edit Experience' : 'Add New Experience'}</Title>}
      open={visible}
      onCancel={handleClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={handleClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={isLoading} onClick={handleSubmit}>
          {isEditing ? 'Update Experience' : 'Add Experience'}
        </Button>,
      ]}
      className={styles.resumeModal}
    >
      <Form form={form} layout="vertical" className={styles.modalForm} validateTrigger="onBlur">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="orgName"
              label="Organization/Team Name"
              rules={[
                { required: true, message: 'Please enter the organization or team name' },
                { min: 2, message: 'Name must be at least 2 characters' },
              ]}
            >
              <Input placeholder="e.g., Lakers, UCLA, Manchester United" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="league" label="League/Competition">
              <Input placeholder="e.g., NBA, NCAA Division I, Premier League" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="level" label="Competition Level">
              <Select placeholder="Select competition level">
                <Option value="Pro">Professional</Option>
                <Option value="College">College</Option>
                <Option value="HighSchool">High School</Option>
                <Option value="Club">Club</Option>
                <Option value="Other">Other</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="position" label="Position/Role">
              <Input placeholder="e.g., Point Guard, Striker, Quarterback" />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Location</Divider>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="city" label="City">
              <Input placeholder="City" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="state" label="State/Province">
              <Input placeholder="State/Province" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="country" label="Country">
              <Input placeholder="Country" />
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
            <Form.Item name="endDate" label="End Date" help="Leave blank if you're currently with this organization">
              <DatePicker style={{ width: '100%' }} picker="month" placeholder="Select end date (optional)" />
            </Form.Item>
          </Col>
        </Row>

        <Divider>Achievements & Highlights</Divider>
        <div className={styles.dynamicSection}>
          {achievements.map((achievement, index) => (
            <div key={index} className={`${styles.dynamicItem} ${styles.achievementItem}`}>
              <TextArea
                value={achievement}
                onChange={(e) => updateAchievement(index, e.target.value)}
                placeholder={`Achievement ${index + 1} (e.g., "Led team to championship", "Averaged 15 points per game")`}
                rows={2}
                className={styles.dynamicInput}
              />
              {achievements.length > 1 && <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeAchievement(index)} className={styles.removeButton} />}
            </div>
          ))}

          <Button type="dashed" icon={<PlusOutlined />} onClick={addAchievement} className={styles.addButton}>
            Add Another Achievement
          </Button>
        </div>

        <Divider>Media & Highlights</Divider>
        <Alert
          message="Experience-Specific Media Only"
          description="Please only add videos, images, or links that are specifically related to this experience. General highlights should be added to the main Media section of your resume, and or to your Profile section (Media)."
          type="info"
          showIcon
          style={{ marginBottom: '1rem' }}
        />

        <div className={styles.dynamicSection}>
          {mediaItems.map((media, index) => (
            <div key={index} className={styles.dynamicItem}>
              <div className={styles.mediaItemHeader}>
                <Select value={media.kind} onChange={(value) => updateMediaItem(index, 'kind', value)} style={{ width: 120 }} size="small">
                  <Select.Option value="video">
                    <PlayCircleOutlined /> Video
                  </Select.Option>
                  <Select.Option value="image">
                    <FileImageOutlined /> Image
                  </Select.Option>
                  <Select.Option value="link">
                    <LinkOutlined /> Link
                  </Select.Option>
                </Select>
                {mediaItems.length > 1 && (
                  <Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeMediaItem(index)} className={styles.removeButton} size="small" />
                )}
              </div>

              <Row gutter={8}>
                <Col span={16}>
                  <Input
                    value={media.url}
                    onChange={(e) => updateMediaItem(index, 'url', e.target.value)}
                    placeholder={`${media.kind === 'video' ? 'Video URL (YouTube, Vimeo, etc.)' : media.kind === 'image' ? 'Image URL' : 'Website URL'}`}
                    className={`${styles.dynamicInput}`}
                  />
                </Col>
                <Col span={8}>
                  <Input value={media.label} onChange={(e) => updateMediaItem(index, 'label', e.target.value)} placeholder="Label (optional)" className={styles.dynamicInput} />
                </Col>
              </Row>
            </div>
          ))}

          <Button type="dashed" icon={<PlusOutlined />} onClick={addMediaItem} className={styles.addButton}>
            Add Media Item
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ExperienceModal;
