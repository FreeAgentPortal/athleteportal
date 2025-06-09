'use client';
import { Button } from 'antd';
import styles from './FeatureSelect.module.scss';
import { useUser } from '@/state/auth';
import useApiHook from '@/hooks/useApi';

type Props = {
  onContinue: () => void;
};

const FeatureSelect = ({ onContinue }: Props) => {
  const { data: loggedInUser } = useUser();

  const { data: plansRequest, isLoading } = useApiHook({
    url: `/auth/plan`,
    key: 'plan-select',
    method: 'GET',
    enabled: !!loggedInUser._id,
    filter: `availableTo;{"$in":"${Object.keys(loggedInUser.profileRefs).join(',')}"}`,
  }) as any;

  return (
    <div className={styles.container}>
      <p>Select your desired features (placeholder)</p>
      <Button type="primary" onClick={onContinue}>
        Continue
      </Button>
    </div>
  );
};

export default FeatureSelect;
