'use client';
import { Button } from 'antd';
import styles from './FeatureSelect.module.scss';
import { useUser } from '@/state/auth';
import useApiHook from '@/hooks/useApi';
import { usePlansStore } from '@/state/plans';
import FeaturePlanCard, { FeaturePlan } from './components/featurePlanCard/FeaturePlanCard.component';

type Props = {
  onContinue: () => void;
};

const FeatureSelect = ({ onContinue }: Props) => {
  const { data: loggedInUser } = useUser();

  const { data: plansRequest } = useApiHook({
    url: `/auth/plan`,
    key: 'plan-select',
    method: 'GET',
    enabled: !!loggedInUser._id,
    filter: `availableTo;{"$in":"${Object.keys(loggedInUser.profileRefs).join(',')}"}`,
  }) as any;

  const { selectedPlans, selectPlan } = usePlansStore();

  const plans: FeaturePlan[] =
    plansRequest?.payload?.data || plansRequest?.payload || plansRequest?.data || [];

  return (
    <div className={styles.container}>
      {plans.map((plan: FeaturePlan) => (
        <FeaturePlanCard
          key={plan._id}
          plan={plan}
          selected={selectedPlans.some((p) => p._id === plan._id)}
          onSelect={() => selectPlan(plan)}
        />
      ))}
      <Button type="primary" onClick={onContinue} disabled={selectedPlans.length === 0}>
        Continue
      </Button>
    </div>
  );
};

export default FeatureSelect;
