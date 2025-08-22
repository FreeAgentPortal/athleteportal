import React, { useState } from 'react';
import { Typography, Empty, Button, Dropdown, MenuProps } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { IResumeProfile, IEducation } from '@/types/IResumeTypes';
import styles from './Education.module.scss';
import useApiHook from '@/hooks/useApi';
import EducationModal from '../../modals/EducationModal.component';

const { Text } = Typography;

interface EducationProps {
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

const Education: React.FC<EducationProps> = ({ resumeData, renderSectionHeader }) => {
  const [educationModalVisible, setEducationModalVisible] = useState(false);
  const [editingEducation, setEditingEducation] = useState<IEducation | null>(null);

  const { mutate: addEducation } = useApiHook({
    key: `resume-education-${resumeData?._id}`,
    method: 'POST',
    successMessage: 'Education added successfully!',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  const { mutate: updateEducation } = useApiHook({
    key: `resume-education-${resumeData?._id}`,
    method: 'PUT',
    successMessage: 'Education updated successfully!',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  const { mutate: deleteEducation } = useApiHook({
    key: `resume-education-${resumeData?._id}`,
    method: 'DELETE',
    successMessage: 'Education deleted successfully!',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  const handleAddEducation = () => {
    setEditingEducation(null);
    setEducationModalVisible(true);
  };

  const handleEditEducation = (education: IEducation) => {
    setEditingEducation(education);
    setEducationModalVisible(true);
  };

  const handleEducationSubmit = (education: Omit<IEducation, '_id'>) => {
    console.log('Submitting education:', education);

    if (editingEducation) {
      // Update existing education
      updateEducation({
        url: `/profiles/resume/education/${editingEducation._id}`,
        formData: {
          owner: resumeData?.owner,
          ...education,
        },
      });
    } else {
      // Add new education
      addEducation({
        url: `/profiles/resume/education`,
        formData: {
          owner: resumeData?.owner,
          ...education,
        },
      });
    }

    setEducationModalVisible(false);
    setEditingEducation(null);
  };

  const handleDeleteEducation = (educationId: string) => {
    deleteEducation({
      url: `/profiles/resume/education/${educationId}`,
    });
  };

  const handleCloseEducationModal = () => {
    setEducationModalVisible(false);
    setEditingEducation(null);
  };
  return (
    <div className={styles.educationContainer}>
      {renderSectionHeader('Education', resumeData?.education?.length || 0, handleAddEducation)}
      {!resumeData?.education?.length ? (
        renderEmptyState('No education added yet', 'Add your academic background and achievements')
      ) : (
        <div className={styles.educationList}>
          {resumeData.education.map((education) => {
            const menuItems: MenuProps['items'] = [
              {
                key: 'edit',
                label: 'Edit Education',
                icon: <EditOutlined />,
                onClick: () => handleEditEducation(education),
              },
              {
                key: 'delete',
                label: 'Delete Education',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeleteEducation(education._id),
              },
            ];

            return (
              <div key={education._id} className={styles.educationCard}>
                <div className={styles.educationHeader}>
                  <div className={styles.educationTitle}>
                    <h4>{education.school}</h4>
                    {education.degreeOrProgram && <span className={styles.degree}>{education.degreeOrProgram}</span>}
                  </div>
                  <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                    <Button type="text" icon={<MoreOutlined />} size="small" />
                  </Dropdown>
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
            );
          })}
        </div>
      )}

      {/* Education Modal */}
      <EducationModal
        visible={educationModalVisible}
        onClose={handleCloseEducationModal}
        onSubmit={handleEducationSubmit}
        education={editingEducation}
        isEditing={!!editingEducation}
      />
    </div>
  );
};

export default Education;
