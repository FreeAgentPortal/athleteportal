'use client';
import { Button } from 'antd';
import styles from './FeatureSelect.module.scss';
import { useUser } from '@/state/auth';
import useApiHook from '@/hooks/useApi';
import { useState } from 'react';
import FeaturePlanCard, { FeaturePlan } from './components/featurePlanCard/FeaturePlanCard.component';

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

  const [selectedPlan, setSelectedPlan] = useState<string>('');

  const plans: FeaturePlan[] =
    plansRequest?.payload?.data || plansRequest?.payload || plansRequest?.data || [];

  return (
    <div className={styles.container}>
      {plans.map((plan: FeaturePlan) => (
        <FeaturePlanCard
          key={plan._id}
          plan={plan}
          selected={selectedPlan === plan._id}
          onSelect={() => setSelectedPlan(plan._id)}
        />
      ))}
      <Button type="primary" onClick={onContinue} disabled={!selectedPlan}>
        Continue
      </Button>
    </div>
  );
};

export default FeatureSelect;
