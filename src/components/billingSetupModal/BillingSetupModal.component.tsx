'use client';
import { Modal } from 'antd';
import styles from './BillingSetupModal.module.scss';

type Props = {
  open: boolean;
};

const BillingSetupModal = ({ open }: Props) => {
  return (
    <Modal
      open={open}
      closable={false}
      footer={null}
      maskClosable={false}
      title="Billing Setup Required"
    >
      <p className={styles.text}>Please complete your billing setup to continue.</p>
    </Modal>
  );
};

export default BillingSetupModal;
