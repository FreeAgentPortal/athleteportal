'use client';
import React from 'react';
import styles from './TeamFinder.module.scss';
import useApiHook from '@/hooks/useApi';
import { useSearchStore } from '@/state/search';
import { Empty, Skeleton } from 'antd';
import Error from '@/components/error/Error.component';
import { ITeamType } from '@/types/ITeamType';
import TeamCard from '@/components/teamCard/TeamCard.component';

const TeamFinder = () => {
  const { filter } = useSearchStore((state) => state);
  const { data, isLoading, isError, error } = useApiHook({
    url: '/team',
    method: 'GET',
    filter: filter,
    key: 'team-search',
    enabled: !!filter,
  }) as any;
  return (
    <main className={styles.container}>
      <section className={styles.header}>
        <h1 className={styles.pageTitle}>Team Finder</h1>
        <p className={styles.pageDescription}>Discover teams that fit your goals. Use filters to narrow down programs actively searching for athletes like you.</p>
      </section>

      <section className={styles.searchSection}>
        {isLoading && <Skeleton active paragraph={{ rows: 4 }} />}
        {isError && <Error error={error.message} />}
        {data && data.length === 0 && <Empty description="No teams found matching your criteria. Try adjusting your filters." image={Empty.PRESENTED_IMAGE_SIMPLE} />}
        {data && data?.payload.length > 0 && (
          <div className={styles.teamList}>
            {data?.payload?.map((team: ITeamType) => (
              <TeamCard key={team._id} team={team} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default TeamFinder;
