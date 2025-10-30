'use client';
import React from 'react';
import { reactionOptions } from '../reactionButton/utils/reactionHelpers';
import styles from './ReactionSummary.module.scss';

interface ReactionSummaryProps {
  reactionBreakdown?: Record<string, number>;
  totalReactions: number;
}

const ReactionSummary = ({ reactionBreakdown, totalReactions }: ReactionSummaryProps) => {
  if (!totalReactions || totalReactions === 0) return null;

  // Get reactions that have counts, sorted by count (descending)
  const activeReactions = reactionBreakdown
    ? Object.entries(reactionBreakdown)
        .filter(([_, count]) => count > 0)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 3) // Show max 3 reaction types
    : [];

  return (
    <div className={styles.container}>
      <div className={styles.reactionIcons}>
        {activeReactions.map(([type]) => {
          const reaction = reactionOptions.find((r) => r.type === type);
          if (!reaction) return null;

          const IconComponent = reaction.icon;
          return (
            <div key={type} className={`${styles.reactionIcon} ${styles[`reaction${type.charAt(0).toUpperCase() + type.slice(1)}`]}`}>
              <IconComponent size={16} />
            </div>
          );
        })}
      </div>
      <span className={styles.count}>{totalReactions.toLocaleString()}</span>
    </div>
  );
};

export default ReactionSummary;
