import React from 'react';
import styles from './TeamCard.module.scss';
import { Tag } from 'antd';
import { ITeamType } from '@/types/ITeamType';

type Props = {
  team: ITeamType;
};

const TeamCard: React.FC<Props> = ({ team }) => {
  const primaryColor = team.color || '#4ba7d6'; // fallback to FAP default
  const altColor = team.alternateColor || '#ffffff';

  return (
    <div className={styles.card} style={{ borderColor: altColor, backgroundColor: primaryColor }}>
      <div className={styles.header}>
        {team.logos && team.logos.length > 0 && (
          <img src={team.logos[0].href} alt={`${team.name} logo`} className={styles.logo} />
        )}
        <div>
          <h3>{team.name}</h3>
          {team.openToTryouts ? <Tag color="green">Open to Tryouts</Tag> : <Tag color="gray">Not Recruiting</Tag>}
        </div>
      </div>

      <div className={styles.meta}>
        <p>
          <strong>Coach:</strong> {team.coachName || 'N/A'}
        </p>
        <p>
          <strong>Email:</strong> {team.email}
        </p>
        {team.phone && (
          <p>
            <strong>Phone:</strong> {team.phone}
          </p>
        )}
        <p>
          <strong>State:</strong> {team?.location ?? 'N/A'}
        </p>
      </div>

      {Array.isArray(team.positionsNeeded) && team.positionsNeeded.length > 0 && (
        <div className={styles.positions}>
          <p>
            <strong>Needs:</strong>
          </p>
          <div className={styles.tags}>
            {team.positionsNeeded.map((pos) => (
              <Tag key={pos} color={primaryColor}>
                {pos}
              </Tag>
            ))}
          </div>
        </div>
      )}

      {team.verifiedDomain && <p className={styles.verified}>Verified Domain: {team.verifiedDomain}</p>}
    </div>
  );
};

export default TeamCard;
