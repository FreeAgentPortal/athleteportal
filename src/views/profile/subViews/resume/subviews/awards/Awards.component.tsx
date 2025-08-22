import React from 'react';
import { Typography, Empty } from 'antd';
import { IResumeProfile } from '@/types/IResumeTypes';
import styles from './Awards.module.scss';

const { Text } = Typography;

interface AwardsProps {
  resumeData: IResumeProfile | null;
  renderSectionHeader: (title: string, count: number, onAdd: () => void) => React.ReactNode;
  onAddAward: () => void;
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

const Awards: React.FC<AwardsProps> = ({ resumeData, renderSectionHeader, onAddAward }) => {
  return (
    <div className={styles.awardsContainer}>
      {renderSectionHeader('Awards', resumeData?.awards?.length || 0, onAddAward)}
      {!resumeData?.awards?.length ? (
        renderEmptyState('No awards added yet', 'Showcase your achievements and recognition')
      ) : (
        <div className={styles.awardsList}>
          {resumeData.awards.map((award) => (
            <div key={award._id} className={styles.awardCard}>
              <div className={styles.awardHeader}>
                <h4>{award.title}</h4>
                {award.year && <span className={styles.year}>{award.year}</span>}
              </div>

              <div className={styles.awardDetails}>{award.org && <div className={styles.organization}>🏆 {award.org}</div>}</div>

              {award.description && (
                <div className={styles.description}>
                  <p>{award.description}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Awards;
