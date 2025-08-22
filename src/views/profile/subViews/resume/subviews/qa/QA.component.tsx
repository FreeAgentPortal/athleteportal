import React from 'react';
import { Typography, Empty } from 'antd';
import { IResumeProfile } from '@/types/IResumeTypes';
import styles from './QA.module.scss';

const { Text } = Typography;

interface QAProps {
  resumeData: IResumeProfile | null;
  renderSectionHeader: (title: string, count: number, onAdd: () => void) => React.ReactNode;
  onAddQA: () => void;
}

const renderEmptyState = (title: string, description: string) => (
  <Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    description={
      <div>
        <Text strong>{title}</Text>
        <br />
        <Text type="secondary">{description}</Text>
      </div>
    }
  />
);

const QA: React.FC<QAProps> = ({ resumeData, renderSectionHeader, onAddQA }) => {
  return (
    <div className={styles.qaContainer}>
      {renderSectionHeader('Questions & Answers', resumeData?.qa?.length || 0, onAddQA)}
      {!resumeData?.qa?.length ? (
        renderEmptyState('No Q&A added yet', 'Answer common questions teams might have')
      ) : (
        <div className={styles.qaList}>
          {resumeData.qa.map((qa) => (
            <div key={qa._id} className={styles.qaCard}>
              <div className={styles.question}>
                <h5>❓ {qa.question}</h5>
              </div>

              <div className={styles.answer}>
                <p>{qa.answer}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QA;
