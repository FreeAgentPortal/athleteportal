import React from 'react';
import { Typography, Empty } from 'antd';
import { IResumeProfile } from '@/types/IResumeTypes';
import styles from './References.module.scss';

const { Text } = Typography;

interface ReferencesProps {
  resumeData: IResumeProfile | null;
  renderSectionHeader: (title: string, count: number, onAdd: () => void) => React.ReactNode;
  onAddReference: () => void;
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

const References: React.FC<ReferencesProps> = ({ resumeData, renderSectionHeader, onAddReference }) => {
  return (
    <div className={styles.referencesContainer}>
      {renderSectionHeader('References', resumeData?.references?.length || 0, onAddReference)}
      {!resumeData?.references?.length ? (
        renderEmptyState('No references added yet', 'Add coaches, trainers, and other professional contacts')
      ) : (
        <div className={styles.referencesList}>
          {resumeData.references.map((reference) => (
            <div key={reference._id} className={styles.referenceCard}>
              <div className={styles.referenceHeader}>
                <h4>{reference.name}</h4>
                {reference.role && <span className={styles.role}>{reference.role}</span>}
              </div>

              <div className={styles.referenceDetails}>
                {reference.organization && <div className={styles.organization}>🏢 {reference.organization}</div>}

                {reference.contact && (
                  <div className={styles.contactInfo}>
                    {reference.contact.email && <div className={styles.email}>✉️ {reference.contact.email}</div>}
                    {reference.contact.phone && <div className={styles.phone}>📞 {reference.contact.phone}</div>}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default References;
