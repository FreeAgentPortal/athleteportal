'use client';
import { Button } from 'antd';
import styles from './FeatureSelect.module.scss';

type Props = {
  onContinue: () => void;
};

const FeatureSelect = ({ onContinue }: Props) => {
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
