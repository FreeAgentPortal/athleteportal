import React from 'react';
import { Typography, Empty } from 'antd';
import { IResumeProfile } from '@/types/IResumeTypes';
import styles from './Education.module.scss';

const { Text } = Typography;

interface EducationProps {
  resumeData: IResumeProfile | null;
  renderSectionHeader: (title: string, count: number, onAdd: () => void) => React.ReactNode;
  onAddEducation: () => void;
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

const Education: React.FC<EducationProps> = ({ resumeData, renderSectionHeader, onAddEducation }) => {
  return (
    <div className={styles.educationContainer}>
      {renderSectionHeader('Education', resumeData?.education?.length || 0, onAddEducation)}
      {!resumeData?.education?.length ? (
        renderEmptyState('No education added yet', 'Add your academic background and achievements')
      ) : (
        <div className={styles.educationList}>
          {resumeData.education.map((education) => (
            <div key={education._id} className={styles.educationCard}>
              <div className={styles.educationHeader}>
                <h4>{education.school}</h4>
                {education.degreeOrProgram && <span className={styles.degree}>{education.degreeOrProgram}</span>}
              </div>

              <div className={styles.educationDetails}>
                {(education.startDate || education.endDate) && (
                  <div className={styles.duration}>
                    {education.startDate && new Date(education.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                    {' - '}
                    {education.endDate ? new Date(education.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                  </div>
                )}
              </div>

              {education.notes && (
                <div className={styles.notes}>
                  <p>{education.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Education;
