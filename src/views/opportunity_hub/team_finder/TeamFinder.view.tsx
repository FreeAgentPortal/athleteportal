'use client';
import { Suspense } from 'react';
import styles from './TeamFinder.module.scss';
import useApiHook from '@/hooks/useApi';
import { useSearchStore } from '@/state/search';
import Error from '@/components/error/Error.component';
import TeamTable from '@/components/teamTable/TeamTable.component';
import ProgressBar from '@/layout/progressBar/ProgressBar.component';
import SearchWrapper from '@/layout/searchWrapper/SearchWrapper.layout';

const TeamFinder = () => {
  const { search, filter, pageNumber } = useSearchStore((state) => state);
  const { data, isLoading, isError, error } = useApiHook({
    url: '/team',
    method: 'GET',
    filter: filter,
    keyword: search,
    key: ['team-search', `${search + filter}`, `${pageNumber}`],
  }) as any;

  return (
    <Suspense fallback={<ProgressBar visible progress={100} />}>
      <main className={styles.container}>
        <section className={styles.header}>
          <h1 className={styles.pageTitle}>Team Finder</h1>
          <p className={styles.pageDescription}>Discover teams that fit your goals. Use filters to narrow down programs actively searching for athletes like you.</p>
        </section>

        <SearchWrapper
          queryKey="team-search"
          placeholder="Search teams..."
          total={data?.metadata?.totalCount}
          isFetching={data?.isFetching}
          filters={[
            {
              label: 'All Teams',
              key: 'all',
            },
            {
              label: 'Teams Actively Recruiting',
              key: 'openToTryouts:true',
            },
          ]}
        >
          <section className={styles.searchSection}>
            {isLoading && <ProgressBar visible progress={100} />}
            {isError && <Error error={error.message} />}
            {data && data.payload.length !== 0 && <TeamTable teams={data?.payload} />}
          </section>
        </SearchWrapper>
      </main>
    </Suspense>
  );
};

export default TeamFinder;
