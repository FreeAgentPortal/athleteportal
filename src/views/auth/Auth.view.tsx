'use client';
import { Button } from 'antd';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

import styles from './Auth.module.scss';
import { useEffect, useState } from 'react';
import { useUser } from '@/state/auth';

const Auth = () => {
  const pathname = usePathname();
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { data: loggedInData, isLoading: isLoggedInLoading } = useUser();
  useEffect(() => {
    const origin = window.location.origin;

    setRedirectUrl(`${process.env.AUTH_URL}?redirect=${origin + pathname}`);

    // Only disable button if we have valid user data or are actively loading
    if (loggedInData) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [pathname, loggedInData]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.logoContainer}>
            <Image
              src="/images/logo.png"
              width={130}
              height={140}
              style={{
                objectFit: 'contain',
              }}
              alt="logo"
            />
            {process.env.SERVICE_NAME}
          </div>
        </div>
        <div className={styles.text}>
          <span>Welcome</span>
          <br />
          <p style={{ fontSize: '14px' }}>Please click the button below to login</p>
        </div>
        {redirectUrl && (
          <a href={redirectUrl} className={styles.buttonLink}>
            <Button className={styles.button} type="primary" size="large" loading={isLoggedInLoading} disabled={isAuthenticated}>
              Login
            </Button>
          </a>
        )}
      </div>
    </div>
  );
};

export default Auth;

Auth.getInitialProps = async ({ req }: any) => {
  let fullUrl;
  if (req) {
    // Server side rendering
    fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
  } else {
    // Client side rendering
    fullUrl = window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
  }
  return { fullUrl: fullUrl };
};
