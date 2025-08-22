'use client';
import React, { useState, useEffect } from 'react';
import styles from './Resume.module.scss';
import { Card, Button, Tabs, Space, Typography, Spin } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { IResumeProfile } from '@/types/IResumeTypes';
import { createTabItems } from './tabs';
import useApiHook from '@/hooks/useApi';
import { useQueryClient } from '@tanstack/react-query';
import { IAthlete } from '@/types/IAthleteType';

const { Title, Text } = Typography;

const Resume = () => {
  const [activeTab, setActiveTab] = useState('experiences');
  const profile = useQueryClient().getQueryData(['profile', 'athlete']) as { payload: IAthlete };

  // Fetch resume data
  const { data: resumeResponse, isLoading: isLoadingResume } = useApiHook({
    url: `/profiles/resume/${profile.payload?._id}`,
    key: 'resume-profile',
    method: 'GET',
    enabled: !!profile.payload?._id,
    showErrorAlert: false, // Don't show error alert for 404 when resume doesn't exist
  }) as any;

  // Create resume mutation
  const { mutate: createResume, isPending: isCreatingResume } = useApiHook({
    url: '/profiles/resume',
    key: 'create-resume',
    method: 'POST',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  const resumeData: IResumeProfile | null = resumeResponse?.payload || null;
  const isLoading = isLoadingResume || isCreatingResume;

  // Auto-create resume if none exists
  useEffect(() => {
    if (!isLoadingResume && !resumeData && !isCreatingResume) {
      const blankResumeData = {
        owner: {
          kind: 'AthleteProfile',
          ref: profile.payload?._id,
        },
        experiences: [],
        education: [],
        awards: [],
        qa: [],
        references: [],
        media: [],
        visibility: 'private',
      };
      createResume({ formData: blankResumeData });
    }
  }, [isLoadingResume, resumeData, isCreatingResume, createResume]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  // Placeholder handlers for other modals (to be implemented)
  const handleAddEducation = () => console.log('Add education');
  const handleAddAward = () => console.log('Add award');
  const handleAddQA = () => console.log('Add Q&A');
  const handleAddReference = () => console.log('Add reference');
  const handleAddMedia = () => console.log('Add media');

  const tabItems = createTabItems({
    resumeData,
    onAddEducation: handleAddEducation,
    onAddAward: handleAddAward,
    onAddQA: handleAddQA,
    onAddReference: handleAddReference,
    onAddMedia: handleAddMedia,
  });

  return (
    <div className={styles.resumeContainer}>
      <Card className={styles.resumeCard}>
        <div className={styles.resumeHeader}>
          <div>
            <Title level={2}>Athletic Resume</Title>
            <Text type="secondary">Build your comprehensive athletic portfolio to showcase to teams and scouts</Text>
          </div>
          <Space>
            <Button icon={<EyeOutlined />} disabled={isLoading}>
              Preview Resume
            </Button>
            <Text type="secondary">Visibility: {resumeData?.visibility || 'Private'}</Text>
          </Space>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">{isCreatingResume ? 'Setting up your resume...' : 'Loading resume...'}</Text>
            </div>
          </div>
        ) : (
          <Tabs activeKey={activeTab} onChange={handleTabChange} size="large" className={styles.resumeTabs} items={tabItems} />
        )}
      </Card>
    </div>
  );
};

export default Resume;
