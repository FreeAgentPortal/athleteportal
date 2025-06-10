'use client';
import styles from './FeaturePlanCard.module.scss';

export type Tier = 'silver' | 'gold' | 'platinum' | 'bronze' | 'diamond';

export type FeaturePlan = {
  _id: string;
  name: string;
  description: string;
  price: string;
  billingCycle?: string;
  availableTo?: string[];
  features?: any[];
  isActive?: boolean;
  imageUrl?: string;
  tier?: Tier;
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

  const tierClass = plan.tier ? styles[plan.tier] : '';

  return (
    <div className={`${styles.container} ${selected ? styles.active : ''} ${tierClass}`} onClick={handleSelect}>
      <div className={styles.imageWrapper}>
        <img src={plan.imageUrl || '/images/placeholder-logo.png'} alt={`${plan.name} icon`} className={styles.image} />
      </div>
      <div className={styles.content}>
        <h3 className={styles.name}>{plan.name}</h3>
        <p className={styles.description}>{plan.description}</p>
        <div className={styles.priceRow}>
          <span className={styles.price}>
            {Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD',
            }).format(Number(plan.price))}
          </span>
          {plan.billingCycle && <span className={styles.billingCycle}>/ {plan.billingCycle}</span>}
        </div>
      </div>
    </div>
  );
};

export default FeaturePlanCard;
