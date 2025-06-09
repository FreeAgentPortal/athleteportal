'use client';
import { Modal } from 'antd';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './BillingSetupModal.module.scss';
import PaymentInformationForm from '@/views/billing/components/paymentInformation/PaymentInformation.component';
import FeatureSelect from './FeatureSelect.component';

type Props = {
  open: boolean;
};

const BillingSetupModal = ({ open }: Props) => {
  const [step, setStep] = useState<'features' | 'payment'>('features');

  const renderStep = () => {
    switch (step) {
      case 'payment':
        return <PaymentInformationForm />;
      default:
        return <FeatureSelect onContinue={() => setStep('payment')} />;
    }
  };

  return (
    <Modal
      open={open}
      closable={false}
      footer={null}
      maskClosable={false}
      title="Billing Setup Required"
      className={styles.container}
    >
      <p className={styles.text}>
        Before you can access your account you need to complete the billing setup process
      </p>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
    </Modal>
  );
};

export default BillingSetupModal;
