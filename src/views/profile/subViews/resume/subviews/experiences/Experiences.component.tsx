import React, { useState } from 'react';
import { Typography, Empty, Button, Dropdown, MenuProps } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, PlayCircleOutlined, FileImageOutlined, LinkOutlined } from '@ant-design/icons';
import { IResumeProfile, IExperience } from '@/types/IResumeTypes';
import styles from './Experiences.module.scss';
import useApiHook from '@/hooks/useApi';
import ExperienceModal from '../../modals/ExperienceModal.component';

const { Text } = Typography;

interface ExperiencesProps {
  resumeData: IResumeProfile | null;
  renderSectionHeader: (title: string, count: number, onAdd: () => void) => React.ReactNode;
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

const Experiences: React.FC<ExperiencesProps> = ({ resumeData, renderSectionHeader }) => {
  const [experienceModalVisible, setExperienceModalVisible] = useState(false);
  const [editingExperience, setEditingExperience] = useState<IExperience | null>(null);

  const { mutate: addExperience } = useApiHook({
    key: `resume-experiences-${resumeData?._id}`,
    method: 'POST',
    successMessage: 'Experience added successfully!',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  const { mutate: updateExperience } = useApiHook({
    key: `resume-experiences-${resumeData?._id}`,
    method: 'PUT',
    successMessage: 'Experience updated successfully!',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  const { mutate: deleteExperience } = useApiHook({
    key: `resume-experiences-${resumeData?._id}`,
    method: 'DELETE',
    successMessage: 'Experience deleted successfully!',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  const handleAddExperience = () => {
    setEditingExperience(null);
    setExperienceModalVisible(true);
  };

  const handleEditExperience = (experience: IExperience) => {
    setEditingExperience(experience);
    setExperienceModalVisible(true);
  };

  const handleExperienceSubmit = (experience: Omit<IExperience, '_id'>) => {
    console.log('Submitting experience:', experience);

    if (editingExperience) {
      // Update existing experience
      updateExperience({
        url: `/profiles/resume/experience/${editingExperience._id}`,
        formData: {
          owner: resumeData?.owner,
          ...experience,
        },
      });
    } else {
      // Add new experience
      addExperience({
        url: `/profiles/resume/experience`,
        formData: {
          owner: resumeData?.owner,
          ...experience,
        },
      });
    }

    setExperienceModalVisible(false);
    setEditingExperience(null);
  };

  const handleDeleteExperience = (experienceId: string) => {
    deleteExperience({
      url: `/profiles/resume/experience/${experienceId}`,
    });
  };

  const handleCloseExperienceModal = () => {
    setExperienceModalVisible(false);
    setEditingExperience(null);
  };

  return (
    <div className={styles.experiencesContainer}>
      {renderSectionHeader('Experiences', resumeData?.experiences?.length || 0, handleAddExperience)}
      {!resumeData?.experiences?.length ? (
        renderEmptyState('No experiences added yet', 'Add your athletic experiences, teams, and achievements')
      ) : (
        <div className={styles.experiencesList}>
          {resumeData.experiences.map((experience) => {
            const menuItems: MenuProps['items'] = [
              {
                key: 'edit',
                label: 'Edit Experience',
                icon: <EditOutlined />,
                onClick: () => handleEditExperience(experience),
              },
              {
                key: 'delete',
                label: 'Delete Experience',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeleteExperience(experience._id),
              },
            ];

            return (
              <div key={experience._id} className={styles.experienceCard}>
                <div className={styles.experienceHeader}>
                  <div className={styles.experienceTitle}>
                    <h4>{experience.orgName}</h4>
                    {experience.position && <span className={styles.position}>{experience.position}</span>}
                  </div>
                  <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                    <Button type="text" icon={<MoreOutlined />} size="small" />
                  </Dropdown>
                </div>

                <div className={styles.experienceDetails}>
                  {experience.league && <div className={styles.league}>{experience.league}</div>}
                  {experience.level && <div className={styles.level}>{experience.level}</div>}
                  {experience.location && (
                    <div className={styles.location}>{[experience.location.city, experience.location.state, experience.location.country].filter(Boolean).join(', ')}</div>
                  )}
                  {(experience.startDate || experience.endDate) && (
                    <div className={styles.duration}>
                      {experience.startDate && new Date(experience.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      {' - '}
                      {experience.endDate ? new Date(experience.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Present'}
                    </div>
                  )}
                </div>

                {experience.achievements && experience.achievements.length > 0 && (
                  <div className={styles.achievements}>
                    <h5>Achievements:</h5>
                    <ul>
                      {experience.achievements.map((achievement, index) => (
                        <li key={index}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {experience.media && experience.media.length > 0 && (
                  <div className={styles.media}>
                    <h5>Media & Highlights:</h5>
                    <div className={styles.mediaList}>
                      {experience.media.map((mediaItem, index) => (
                        <a key={index} href={mediaItem.url} target="_blank" rel="noopener noreferrer" className={styles.mediaItem}>
                          {getMediaIcon(mediaItem.kind)}
                          <span>{mediaItem.label || `${mediaItem.kind.charAt(0).toUpperCase() + mediaItem.kind.slice(1)} ${index + 1}`}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Experience Modal */}
      <ExperienceModal
        visible={experienceModalVisible}
        onClose={handleCloseExperienceModal}
        onSubmit={handleExperienceSubmit}
        experience={editingExperience}
        isEditing={!!editingExperience}
      />
    </div>
  );
};

export default Experiences;
