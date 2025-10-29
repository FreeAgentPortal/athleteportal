'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Post } from '@/types/ISocialPost';
import styles from './TextWithMediaCard.module.scss';

interface TextWithMediaCardProps {
  post: Post;
}

const MAX_CHARS = 300;

const TextWithMediaCard = ({ post }: TextWithMediaCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const mediaItems = post.media || [];
  const shouldTruncate = post.body && post.body.length > MAX_CHARS;

  return (
    <div className={styles.container}>
      {/* Text Content */}
      <div className={styles.textContent}>
        <motion.div
          initial={false}
          animate={{
            height: isExpanded ? 'auto' : shouldTruncate ? '4.5em' : 'auto',
            opacity: 1,
          }}
          transition={{
            height: { duration: 0.3, ease: 'easeInOut' },
            opacity: { duration: 0.2 },
          }}
          style={{ overflow: 'hidden' }}
        >
          <motion.p className={styles.body} initial={false} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
            {post.body}
          </motion.p>
        </motion.div>
        {shouldTruncate && (
          <motion.button className={styles.seeMoreButton} onClick={() => setIsExpanded(!isExpanded)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            {isExpanded ? 'See Less' : 'See More'}
          </motion.button>
        )}
      </div>

      {/* Media Content */}
      <div className={styles.mediaContent}>
        {mediaItems.length === 1 ? (
          <div className={styles.singleMedia}>
            <Image src={mediaItems[0].url} alt="Post media" width={600} height={400} className={styles.mediaImage} />
          </div>
        ) : (
          <div className={styles.mediaGrid}>
            {mediaItems.slice(0, 4).map((media, index) => (
              <div key={index} className={styles.mediaItem}>
                <Image src={media.url} alt={`Post media ${index + 1}`} width={300} height={300} className={styles.mediaImage} />
                {index === 3 && mediaItems.length > 4 && (
                  <div className={styles.moreOverlay}>
                    <span>+{mediaItems.length - 4}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextWithMediaCard;
