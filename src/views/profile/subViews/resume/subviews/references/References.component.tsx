import React, { useState } from 'react';
import { Typography, Empty, Button, Dropdown, MenuProps } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { IResumeProfile, IReference } from '@/types/IResumeTypes';
import styles from './References.module.scss';
import useApiHook from '@/hooks/useApi';
import ReferenceModal from '../../modals/ReferenceModal.component';

const { Text } = Typography;

interface ReferencesProps {
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

const References: React.FC<ReferencesProps> = ({ resumeData, renderSectionHeader }) => {
  // Modal state
  const [referenceModalVisible, setReferenceModalVisible] = useState(false);
  const [editingReference, setEditingReference] = useState<IReference | null>(null);

  // API hooks - following the corrected pattern from Awards component
  const { mutate: createReference, isPending: isCreatingReference } = useApiHook({
    key: 'create-reference',
    method: 'POST',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  const { mutate: updateReference, isPending: isUpdatingReference } = useApiHook({
    key: 'update-reference',
    method: 'PUT',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  const { mutate: deleteReference, isPending: isDeletingReference } = useApiHook({
    key: 'delete-reference',
    method: 'DELETE',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  // Modal handlers
  const handleAddReference = () => {
    setEditingReference(null);
    setReferenceModalVisible(true);
  };

  const handleEditReference = (reference: IReference) => {
    setEditingReference(reference);
    setReferenceModalVisible(true);
  };

  const handleCloseReferenceModal = () => {
    setReferenceModalVisible(false);
    setEditingReference(null);
  };

  const handleDeleteReference = (referenceId: string) => {
    deleteReference({
      url: `/profiles/resume/reference/${resumeData?._id}/${referenceId}`,
    });
  };

  // Reference submit handler
  const handleReferenceSubmit = (referenceData: Partial<IReference>) => {
    if (editingReference) {
      // Update existing reference
      updateReference({
        formData: { ...referenceData, owner: resumeData?.owner },
        url: `/profiles/resume/reference/${editingReference._id}`,
      });
    } else {
      // Create new reference
      createReference({
        formData: { ...referenceData, owner: resumeData?.owner },
        url: '/profiles/resume/reference',
      });
    }
    handleCloseReferenceModal();
  };
  return (
    <div className={styles.referencesContainer}>
      {renderSectionHeader('References', resumeData?.references?.length || 0, handleAddReference)}
      {!resumeData?.references?.length ? (
        renderEmptyState('No references added yet', 'Add coaches, trainers, and other professional contacts')
      ) : (
        <div className={styles.referencesList}>
          {resumeData.references.map((reference) => {
            const menuItems: MenuProps['items'] = [
              {
                key: 'edit',
                label: 'Edit Reference',
                icon: <EditOutlined />,
                onClick: () => handleEditReference(reference),
              },
              {
                key: 'delete',
                label: 'Delete Reference',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeleteReference(reference._id),
              },
            ];

            return (
              <div key={reference._id} className={styles.referenceCard}>
                <div className={styles.referenceHeader}>
                  <div className={styles.referenceTitle}>
                    <h4>{reference.name}</h4>
                    {reference.role && <span className={styles.role}>{reference.role}</span>}
                  </div>
                  <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                    <Button type="text" icon={<MoreOutlined />} size="small" />
                  </Dropdown>
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
            );
          })}
        </div>
      )}

      {/* Reference Modal */}
      <ReferenceModal
        visible={referenceModalVisible}
        onClose={handleCloseReferenceModal}
        onSubmit={handleReferenceSubmit}
        reference={editingReference}
        isEditing={!!editingReference}
      />
    </div>
  );
};

export default References;
