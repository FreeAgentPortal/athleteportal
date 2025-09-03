import Image from 'next/image';
import useApiHook from '@/hooks/useApi';
import styles from './TeamProfile.module.scss';
import { Button } from 'antd';
import { BiChevronLeft } from 'react-icons/bi';
import Loader from '@/components/loader/Loader.component';

const TeamProfile = (props: { teamId: string }) => {
  const { data, isPending, isError, error } = useApiHook({
    url: `/team/${props.teamId}`,
    method: 'GET',
    key: ['team', props.teamId],
  });

  if (isPending) {
    return (
      <div className={styles.loading}>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <div className={styles.error}>Error: {String(error)}</div>;
  }

  const team = data?.payload;

  if (!team) {
    return <div className={styles.error}>Team not found</div>;
  }

  return (
    <div className={styles.page}>
      <div>
        <Button className={styles.backButton} onClick={() => window.history.back()}>
          <BiChevronLeft size={20} />
          Back
        </Button>
      </div>
      <header className={styles.header}>
        {team.logoUrl && (
          <div
            className={styles.logoWrapper}
            style={{
              border: '3px solid ' + team.color,
            }}
          >
            <Image src={team.logoUrl} alt={`${team.name} logo`} fill className={styles.logo} />
          </div>
        )}
        <div className={styles.headerInfo}>
          <h1 className={styles.teamName}>{team.name}</h1>
          <h2 className={styles.shortName}>{team.shortDisplayName}</h2>
          <p className={styles.meta}>
            {team.location} · {team.league}
          </p>
          <div className={styles.badges}>
            <span className={`${styles.badge} ${team.isActive ? styles.active : styles.inactive}`}>{team.isActive ? 'Active' : 'Inactive'}</span>
            {team.openToTryouts && <span className={`${styles.badge} ${styles.tryouts}`}>Open to Tryouts</span>}
          </div>
        </div>
      </header>

      <main className={styles.content}>
        <section className={styles.section}>
          <h3>About</h3>
          <p>
            <strong>Coach:</strong> {team.coachName || 'TBD'} <br />
            <strong>Abbreviation:</strong> {team.abbreviation} <br />
            <strong>League:</strong> {team.league}
          </p>
        </section>

        {team.positionsNeeded?.length > 0 && (
          <section className={styles.section}>
            <h3>Positions Needed</h3>
            <ul className={styles.positions}>
              {team.positionsNeeded.map((pos: string, idx: number) => (
                <li key={idx} className={styles.positionItem}>
                  {pos}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  );
};

export default TeamProfile;
