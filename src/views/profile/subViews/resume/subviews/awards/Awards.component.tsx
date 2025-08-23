import React, { useState } from 'react';
import { Typography, Empty, Button, Dropdown, MenuProps } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { IResumeProfile, IAward } from '@/types/IResumeTypes';
import styles from './Awards.module.scss';
import useApiHook from '@/hooks/useApi';
import AwardModal from '../../modals/AwardModal.component';

const { Text } = Typography;

interface AwardsProps {
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

const Awards: React.FC<AwardsProps> = ({ resumeData, renderSectionHeader }) => {
  // Modal state
  const [awardModalVisible, setAwardModalVisible] = useState(false);
  const [editingAward, setEditingAward] = useState<IAward | null>(null);

  // API hooks
  const { mutate: createAward, isPending: isCreatingAward } = useApiHook({
    url: '/profiles/resume/award',
    key: 'create-award',
    method: 'POST',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  const { mutate: updateAward, isPending: isUpdatingAward } = useApiHook({
    key: 'update-award',
    method: 'PUT',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  const { mutate: deleteAward, isPending: isDeletingAward } = useApiHook({
    key: 'delete-award',
    method: 'DELETE',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  // Modal handlers
  const handleAddAward = () => {
    setEditingAward(null);
    setAwardModalVisible(true);
  };

  const handleEditAward = (award: IAward) => {
    setEditingAward(award);
    setAwardModalVisible(true);
  };

  const handleCloseAwardModal = () => {
    setAwardModalVisible(false);
    setEditingAward(null);
  };

  const handleDeleteAward = (awardId: string) => {
    deleteAward({
      url: `/profiles/resume/award/${resumeData?._id}/${awardId}`,
    });
  };

  // Award submit handler
  const handleAwardSubmit = (awardData: Partial<IAward>) => {
    if (editingAward) {
      // Update existing award
      updateAward({
        formData: { ...awardData, owner: resumeData?.owner },
        url: `/profiles/resume/award/${editingAward._id}`,
      });
    } else {
      // Create new award
      createAward({ formData: { ...awardData, owner: resumeData?.owner } });
    }
    handleCloseAwardModal();
  };
  return (
    <div className={styles.awardsContainer}>
      {renderSectionHeader('Awards', resumeData?.awards?.length || 0, handleAddAward)}
      {!resumeData?.awards?.length ? (
        renderEmptyState('No awards added yet', 'Showcase your achievements and recognition')
      ) : (
        <div className={styles.awardsList}>
          {resumeData.awards.map((award) => {
            const menuItems: MenuProps['items'] = [
              {
                key: 'edit',
                label: 'Edit Award',
                icon: <EditOutlined />,
                onClick: () => handleEditAward(award),
              },
              {
                key: 'delete',
                label: 'Delete Award',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeleteAward(award._id),
              },
            ];

            return (
              <div key={award._id} className={styles.awardCard}>
                <div className={styles.awardHeader}>
                  <div className={styles.awardTitle}>
                    <h4>{award.title}</h4>
                    {award.year && <span className={styles.year}>{award.year}</span>}
                  </div>
                  <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                    <Button type="text" icon={<MoreOutlined />} size="small" />
                  </Dropdown>
                </div>

                <div className={styles.awardDetails}>{award.org && <div className={styles.organization}>🏆 {award.org}</div>}</div>

                {award.description && (
                  <div className={styles.description}>
                    <p>{award.description}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Award Modal */}
      <AwardModal visible={awardModalVisible} onClose={handleCloseAwardModal} onSubmit={handleAwardSubmit} award={editingAward} isEditing={!!editingAward} />
    </div>
  );
};

export default Awards;
