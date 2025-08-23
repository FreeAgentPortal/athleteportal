import React from 'react';
import { UserOutlined, BookOutlined, TrophyOutlined, QuestionCircleOutlined, TeamOutlined, PlayCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Typography, Button } from 'antd';
import { IResumeProfile } from '@/types/IResumeTypes';
import styles from './Resume.module.scss';
import Experiences from './subviews/experiences/Experiences.component';
import Education from './subviews/education/Education.component';
import Awards from './subviews/awards/Awards.component';
import QA from './subviews/qa/QA.component';
import References from './subviews/references/References.component';
import Media from './subviews/media/Media.component';

const { Text, Title } = Typography;

interface TabItemsProps {
  resumeData: IResumeProfile | null;
  onAddQA: () => void;
}

const renderSectionHeader = (title: string, count: number, onAdd: () => void) => (
  <div className={styles.sectionHeader}>
    <div className={styles.sectionTitle}>
      <Title level={4}>{title}</Title>
      <Text type="secondary">({count} items)</Text>
    </div>
    <Button type="primary" icon={<PlusOutlined />} onClick={onAdd} size="small">
      Add {title.slice(0, -1)}
    </Button>
  </div>
);

export const createTabItems = ({ resumeData, onAddQA }: TabItemsProps) => [
  {
    key: 'experiences',
    label: (
      <span className={styles.tabLabel}>
        <UserOutlined />
        Experiences
      </span>
    ),
    children: (
      <div className={styles.tabContent}>
        <Experiences resumeData={resumeData} renderSectionHeader={renderSectionHeader} />
      </div>
    ),
  },
  {
    key: 'education',
    label: (
      <span className={styles.tabLabel}>
        <BookOutlined />
        Education
      </span>
    ),
    children: (
      <div className={styles.tabContent}>
        <Education resumeData={resumeData} renderSectionHeader={renderSectionHeader} />
      </div>
    ),
  },
  {
    key: 'awards',
    label: (
      <span className={styles.tabLabel}>
        <TrophyOutlined />
        Awards
      </span>
    ),
    children: (
      <div className={styles.tabContent}>
        <Awards resumeData={resumeData} renderSectionHeader={renderSectionHeader} />
      </div>
    ),
  },
  {
    key: 'qa',
    label: (
      <span className={styles.tabLabel}>
        <QuestionCircleOutlined />
        Q&A
      </span>
    ),
    children: (
      <div className={styles.tabContent}>
        <QA resumeData={resumeData} renderSectionHeader={renderSectionHeader} onAddQA={onAddQA} />
      </div>
    ),
  },
  {
    key: 'references',
    label: (
      <span className={styles.tabLabel}>
        <TeamOutlined />
        References
      </span>
    ),
    children: (
      <div className={styles.tabContent}>
        <References resumeData={resumeData} renderSectionHeader={renderSectionHeader} />
      </div>
    ),
  },
  {
    key: 'media',
    label: (
      <span className={styles.tabLabel}>
        <PlayCircleOutlined />
        Media
      </span>
    ),
    children: (
      <div className={styles.tabContent}>
        <Media resumeData={resumeData} renderSectionHeader={renderSectionHeader} />
      </div>
    ),
  },
];
