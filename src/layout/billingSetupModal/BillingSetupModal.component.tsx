'use client';
import { Modal } from 'antd';
import styles from './BillingSetupModal.module.scss'; 
import PaymentInformationForm from '@/views/billing/components/paymentInformation/PaymentInformation.component';

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
      className={styles.container}
    >
      <p className={styles.text}>Before you can access your account you need to complete the billing setup process</p>
      <PaymentInformationForm/>
    </Modal>
  );
};

export default BillingSetupModal;
