'use client';
import styles from './FeaturePlanCard.module.scss';

export type FeaturePlan = {
  _id: string;
  name: string;
  description: string;
  price: string;
  billingCycle?: string;
  availableTo?: string[];
  features?: any[];
  isActive?: boolean;
};

interface Props {
  plan: FeaturePlan;
  selected?: boolean;
  onSelect?: () => void;
}

const FeaturePlanCard = ({ plan, selected = false, onSelect }: Props) => {
  const handleSelect = () => {
    if (onSelect) onSelect();
  };

  return (
    <div
      className={`${styles.container} ${selected ? styles.active : ''}`}
      onClick={handleSelect}
    >
      <h3 className={styles.name}>{plan.name}</h3>
      <p className={styles.description}>{plan.description}</p>
      <span className={styles.price}>
        {Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(plan.price))}
      </span>
    </div>
  );
};

export default FeaturePlanCard;
