'use client';
// LoaderProvider.tsx
import React, { createContext, useState, useRef, useEffect } from 'react';
import ProgressBar from './ProgressBar.component';
import { LoaderContext } from './useLoader';
import { Router } from 'next/router';

const LoaderContextInternal = createContext<LoaderContext | null>(null);

type Props = {
  children: React.ReactNode;
};

export const LoaderProvider = ({ children }: Props) => {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    setProgress(0);
    setActive(true);
    let curr = 0;
    timeoutRef.current = setInterval(() => {
      curr = Math.min(curr + Math.random() * 10, 95);
      setProgress(curr);
    }, 200);
  };

  const done = () => {
    if (timeoutRef.current) clearInterval(timeoutRef.current);
    setProgress(100);
    setTimeout(() => {
      setActive(false);
      setProgress(0);
    }, 300);
  };
  useEffect(() => {
    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', done);
    Router.events.on('routeChangeError', done);
    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', done);
      Router.events.off('routeChangeError', done);
    };
  }, []);

  return (
    <LoaderContextInternal.Provider value={{ start, done, setProgress }}>
      <ProgressBar progress={progress} visible={active} />
      {children}
    </LoaderContextInternal.Provider>
  );
};

export { LoaderContextInternal };
