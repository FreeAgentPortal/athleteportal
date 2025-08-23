'use client';
import React, { useState, useEffect } from 'react';
import styles from './Resume.module.scss';
import { Card, Button, Tabs, Space, Typography, Spin, Select, message, Tooltip } from 'antd';
import { EyeOutlined, GlobalOutlined, LockOutlined, LinkOutlined } from '@ant-design/icons';
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

  // Update resume visibility mutation
  const { mutate: updateVisibility, isPending: isUpdatingVisibility } = useApiHook({
    key: 'update-resume-visibility',
    method: 'PUT',
    queriesToInvalidate: ['resume-profile'],
    successMessage: 'Resume visibility updated successfully!',
  }) as any;

  const resumeData: IResumeProfile | null = resumeResponse?.payload || null;
  const isLoading = isLoadingResume || isCreatingResume;

  // Handle visibility change
  const handleVisibilityChange = (newVisibility: 'public' | 'private' | 'link') => {
    if (!resumeData?._id) return;

    updateVisibility({
      url: `/profiles/resume/${resumeData._id}`,
      formData: { visibility: newVisibility },
    });
  };

  // Visibility options with icons and descriptions
  const visibilityOptions = [
    {
      value: 'private',
      label: (
        <Space>
          <LockOutlined />
          Private
        </Space>
      ),
      description: 'Only you can see your resume',
    },
    {
      value: 'public',
      label: (
        <Space>
          <GlobalOutlined />
          Public
        </Space>
      ),
      description: 'Anyone can find and view your resume',
    },
    {
      value: 'link',
      label: (
        <Space>
          <LinkOutlined />
          Link Only
        </Space>
      ),
      description: 'Only people with the link can view',
    },
  ];

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

  const tabItems = createTabItems({
    resumeData,
  });

  return (
    <div className={styles.resumeContainer}>
      <Card className={styles.resumeCard}>
        <div className={styles.resumeHeader}>
          <div>
            <Title level={2}>Athletic Resume</Title>
            <Text type="secondary">Build your comprehensive athletic portfolio to showcase to teams and scouts</Text>
          </div>
          <Space direction="vertical" size="small" align="end">
            <Space>
              <Button icon={<EyeOutlined />} disabled={isLoading}>
                Preview Resume
              </Button>
            </Space>
            <Space align="center">
              <Text type="secondary" style={{ whiteSpace: 'nowrap' }}>
                Visibility:
              </Text>
              <Tooltip
                title={
                  <div>
                    <div>
                      <strong>Private:</strong> Only you can see your resume
                    </div>
                    <div>
                      <strong>Public:</strong> Anyone can find and view your resume
                    </div>
                    <div>
                      <strong>Link Only:</strong> Only people with the link can view
                    </div>
                  </div>
                }
                placement="topLeft"
              >
                <Select
                  value={resumeData?.visibility || 'private'}
                  onChange={handleVisibilityChange}
                  disabled={isLoading || isUpdatingVisibility}
                  size="small"
                  style={{ minWidth: 120 }}
                  options={visibilityOptions}
                />
              </Tooltip>
            </Space>
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
