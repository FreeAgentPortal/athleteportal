'use client';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import styles from './BillingSetup.module.scss';
import PaymentInformationForm from '@/views/billing/components/paymentInformation/PaymentInformation.component';
import FeatureSelect from './FeatureSelect.component';

const BillingSetup = () => {
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Complete Your Billing Setup</h2>
        <p className={styles.description}>
          To continue using the platform, please complete your billing setup. This step is required if we haven&apos;t yet collected your payment details, or if a previous payment
          attempt failed.
        </p>
      </div>
      <div className={styles.contentContainer}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3, ease: 'easeInOut' }}>
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BillingSetup;
