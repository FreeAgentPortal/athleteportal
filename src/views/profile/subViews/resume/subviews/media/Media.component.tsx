import React from 'react';
import { Typography, Empty } from 'antd';
import { IResumeProfile } from '@/types/IResumeTypes';
import styles from './Media.module.scss';

const { Text } = Typography;

interface MediaProps {
  resumeData: IResumeProfile | null;
  renderSectionHeader: (title: string, count: number, onAdd: () => void) => React.ReactNode;
  onAddMedia: () => void;
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

const Media: React.FC<MediaProps> = ({ resumeData, renderSectionHeader, onAddMedia }) => {
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
      {renderSectionHeader('Media', resumeData?.media?.length || 0, onAddMedia)}
      {!resumeData?.media?.length ? (
        renderEmptyState('No media added yet', 'Upload highlight videos, photos, and other media')
      ) : (
        <div className={styles.mediaList}>
          {resumeData.media.map((media) => (
            <div key={media._id} className={styles.mediaCard}>
              <div className={styles.mediaHeader}>
                <div className={styles.mediaInfo}>
                  <span className={styles.mediaIcon}>{getMediaIcon(media.kind)}</span>
                  <div>
                    <h4>{media.label || 'Untitled Media'}</h4>
                    <span className={styles.mediaType}>{media.kind.toUpperCase()}</span>
                  </div>
                </div>
              </div>

              <div className={styles.mediaDetails}>
                <a href={media.url} target="_blank" rel="noopener noreferrer" className={styles.mediaLink}>
                  View Media
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Media;
