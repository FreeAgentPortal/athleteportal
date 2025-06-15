'use client';
import React from 'react';
import styles from './Profile.module.scss';
import { Tabs, TabsProps } from 'antd';
import BasicInfo from './subViews/basicInfo/BasicInfo.component';
import Measurements from './subViews/measurements/Measurements.component';
import PerformanceMetrics from './subViews/perfMetrics/PerformanceMetrics.component';
import Background from './subViews/background/Background.component';
import Media from './subViews/media/Media.component';

const Profile = () => {
  const tabs: TabsProps['items'] = [
    {
      label: 'Info',
      key: '1',
      children: <BasicInfo />,
    },
    {
      label: 'Measurements',
      key: '2',
      children: <Measurements />,
    },
    {
      label: 'Performance Metrics',
      key: '3',
      children: <PerformanceMetrics />,
    },
    {
      label: 'Background',
      key: '4',
      children: <Background />,
    },
    {
      label: 'Media',
      key: '5',
      children: <Media />,
    },
  ];

  return (
    <div className={styles.container}>
      <Tabs defaultActiveKey="1" type="card" items={tabs} animated />
    </div>
  );
};

export default Profile;
