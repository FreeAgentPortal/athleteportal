import React, { useState } from 'react';
import { Typography, Empty, Button, Dropdown, MenuProps } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, LinkOutlined } from '@ant-design/icons';
import { IResumeProfile, IMedia } from '@/types/IResumeTypes';
import styles from './Media.module.scss';
import useApiHook from '@/hooks/useApi';
import MediaModal from '../../modals/MediaModal.component';

const { Text } = Typography;

interface MediaProps {
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

const Media: React.FC<MediaProps> = ({ resumeData, renderSectionHeader }) => {
  // Modal state
  const [mediaModalVisible, setMediaModalVisible] = useState(false);
  const [editingMedia, setEditingMedia] = useState<IMedia | null>(null);

  // API hooks - following the corrected pattern from Awards component
  const { mutate: createMedia, isPending: isCreatingMedia } = useApiHook({
    key: 'create-media',
    method: 'POST',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  const { mutate: updateMedia, isPending: isUpdatingMedia } = useApiHook({
    key: 'update-media',
    method: 'PUT',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  const { mutate: deleteMedia, isPending: isDeletingMedia } = useApiHook({
    key: 'delete-media',
    method: 'DELETE',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  // Modal handlers
  const handleAddMedia = () => {
    setEditingMedia(null);
    setMediaModalVisible(true);
  };

  const handleEditMedia = (media: IMedia) => {
    setEditingMedia(media);
    setMediaModalVisible(true);
  };

  const handleCloseMediaModal = () => {
    setMediaModalVisible(false);
    setEditingMedia(null);
  };

  const handleDeleteMedia = (mediaId: string) => {
    deleteMedia({
      url: `/profiles/resume/media/${resumeData?._id}/${mediaId}`,
    });
  };

  // Media submit handler
  const handleMediaSubmit = (mediaData: Partial<IMedia>) => {
    if (editingMedia) {
      // Update existing media
      updateMedia({
        formData: { ...mediaData, owner: resumeData?.owner },
        url: `/profiles/resume/media/${editingMedia._id}`,
      });
    } else {
      // Create new media
      createMedia({
        formData: { ...mediaData, owner: resumeData?.owner },
        url: '/profiles/resume/media',
      });
    }
    handleCloseMediaModal();
  };
  const getMediaIcon = (kind: string) => {
    switch (kind) {
      case 'video':
        return '🎥';
      case 'image':
        return '📷';
      case 'link':
        return '🔗';
      default:
        return '📎';
    }
  };

  return (
    <div className={styles.mediaContainer}>
      {renderSectionHeader('Media', resumeData?.media?.length || 0, handleAddMedia)}
      {!resumeData?.media?.length ? (
        renderEmptyState('No media added yet', 'Upload highlight videos, photos, and other media')
      ) : (
        <div className={styles.mediaList}>
          {resumeData.media.map((media) => {
            const menuItems: MenuProps['items'] = [
              {
                key: 'edit',
                label: 'Edit Media',
                icon: <EditOutlined />,
                onClick: () => handleEditMedia(media),
              },
              {
                key: 'delete',
                label: 'Delete Media',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeleteMedia(media._id),
              },
            ];

            return (
              <div key={media._id} className={styles.mediaCard}>
                <div className={styles.mediaHeader}>
                  <div className={styles.mediaInfo}>
                    <span className={styles.mediaIcon}>{getMediaIcon(media.kind)}</span>
                    <div className={styles.mediaTitle}>
                      <h4>{media.label || 'Untitled Media'}</h4>
                      <span className={styles.mediaType}>{media.kind.toUpperCase()}</span>
                    </div>
                  </div>
                  <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                    <Button type="text" icon={<MoreOutlined />} size="small" />
                  </Dropdown>
                </div>

                <div className={styles.mediaDetails}>
                  <a href={media.url} target="_blank" rel="noopener noreferrer" className={styles.mediaLink}>
                    <LinkOutlined /> View Media
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Media Modal */}
      <MediaModal visible={mediaModalVisible} onClose={handleCloseMediaModal} onSubmit={handleMediaSubmit} media={editingMedia} isEditing={!!editingMedia} />
    </div>
  );
};

export default Media;
