import useApiHook from '@/hooks/useApi';
import React from 'react';
import styles from './RecentAthleteSignups.module.scss';
import Link from 'next/link';
import AthleteCard from '../../athleteCard/AthleteCard.component';

const RecentAthleteSignups = () => {
  // find results from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data } = useApiHook({
    url: '/profiles/athlete',
    method: 'GET',
    key: 'recent-athlete-signups',
    filter: `profileImageUrl;{"$exists":true}|createdAt;{"$gte":"${thirtyDaysAgo.toISOString()}"}`,
    limit: 5,
  }) as any;
  return (
    <div className={styles.container}>
      {data?.payload?.map((athlete: any) => (
        <AthleteCard key={athlete._id} athlete={athlete} variant="default" />
      ))}
    </div>
  );
};

export default RecentAthleteSignups;
