'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { Post } from '@/types/ISocialPost';
import ImageViewerModal from '@/views/feed/modals/imageViewerModal/ImageViewerModal.component';
import styles from './MediaOnlyCard.module.scss';

interface MediaOnlyCardProps {
  post: Post;
}

const MediaOnlyCard = ({ post }: MediaOnlyCardProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const mediaItems = post.media || [];
  const imageUrls = mediaItems.filter((m) => m.kind === 'image').map((media) => media.url);

  const handleImageClick = (index: number) => {
    // Only open viewer for images, not videos
    const item = mediaItems[index];
    if (item.kind === 'image') {
      const imageOnlyIndex = mediaItems.slice(0, index + 1).filter((m) => m.kind === 'image').length - 1;
      setSelectedImageIndex(imageOnlyIndex);
    }
  };

  const renderMediaItem = (media: any, index: number) => {
    if (media.kind === 'video') {
      // Extract video ID and create proper embed URL with parameters
      const videoId = media.url.split('/').pop()?.split('?')[0];
      const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
      const thumbnailUrl = media.thumbUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

      return (
        <div className={styles.videoWrapper}>
          <div
            className={styles.videoThumbnail}
            style={{
              backgroundImage: `url(${thumbnailUrl})`,
              backgroundColor: '#000',
              minHeight: '300px',
            }}
          >
            <iframe
              src={embedUrl}
              title="YouTube video"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className={styles.videoIframe}
              loading="lazy"
            />
          </div>
        </div>
      );
    }

    return <Image src={media.url} alt={`Post media ${index + 1}`} width={600} height={400} className={styles.mediaImage} />;
  };

  const handleCloseViewer = () => {
    setSelectedImageIndex(null);
  };

  const handleNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < imageUrls.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const renderMediaGrid = () => {
    const mediaCount = mediaItems.length;

    if (mediaCount === 1) {
      return (
        <div className={styles.singleMedia} onClick={() => handleImageClick(0)}>
          {renderMediaItem(mediaItems[0], 0)}
        </div>
      );
    }

    if (mediaCount === 2) {
      return (
        <div className={styles.twoMediaGrid}>
          {mediaItems.map((media, index) => (
            <div key={index} className={styles.mediaItem} onClick={() => handleImageClick(index)}>
              {renderMediaItem(media, index)}
            </div>
          ))}
        </div>
      );
    }

    if (mediaCount === 3) {
      return (
        <div className={styles.threeMediaGrid}>
          <div className={styles.mainMedia} onClick={() => handleImageClick(0)}>
            {renderMediaItem(mediaItems[0], 0)}
          </div>
          <div className={styles.sideMedia}>
            {mediaItems.slice(1).map((media, index) => (
              <div key={index} className={styles.mediaItem} onClick={() => handleImageClick(index + 1)}>
                {renderMediaItem(media, index + 1)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // 4+ images
    return (
      <div className={styles.multiMediaGrid}>
        {mediaItems.slice(0, 4).map((media, index) => (
          <div key={index} className={styles.mediaItem} onClick={() => handleImageClick(index)}>
            {renderMediaItem(media, index)}
            {index === 3 && mediaCount > 4 && (
              <div className={styles.moreOverlay}>
                <span>+{mediaCount - 4}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {renderMediaGrid()}
      <ImageViewerModal
        visible={selectedImageIndex !== null}
        images={imageUrls}
        currentIndex={selectedImageIndex ?? 0}
        onClose={handleCloseViewer}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  );
};

export default MediaOnlyCard;
