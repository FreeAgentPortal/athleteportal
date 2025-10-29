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
  const imageUrls = mediaItems.map((media) => media.url);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
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
          <Image src={mediaItems[0].url} alt="Post media" width={600} height={400} className={styles.mediaImage} />
        </div>
      );
    }

    if (mediaCount === 2) {
      return (
        <div className={styles.twoMediaGrid}>
          {mediaItems.map((media, index) => (
            <div key={index} className={styles.mediaItem} onClick={() => handleImageClick(index)}>
              <Image src={media.url} alt={`Post media ${index + 1}`} width={300} height={300} className={styles.mediaImage} />
            </div>
          ))}
        </div>
      );
    }

    if (mediaCount === 3) {
      return (
        <div className={styles.threeMediaGrid}>
          <div className={styles.mainMedia} onClick={() => handleImageClick(0)}>
            <Image src={mediaItems[0].url} alt="Post media 1" width={400} height={400} className={styles.mediaImage} />
          </div>
          <div className={styles.sideMedia}>
            {mediaItems.slice(1).map((media, index) => (
              <div key={index} className={styles.mediaItem} onClick={() => handleImageClick(index + 1)}>
                <Image src={media.url} alt={`Post media ${index + 2}`} width={200} height={200} className={styles.mediaImage} />
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
            <Image src={media.url} alt={`Post media ${index + 1}`} width={300} height={300} className={styles.mediaImage} />
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
