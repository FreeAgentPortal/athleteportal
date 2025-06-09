'use client';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';
import io from 'socket.io-client';
import { useUser } from '@/state/auth';
import { useSocketStore } from '@/state/socket';
import BillingSetupModal from '@/layout/billingSetupModal/BillingSetupModal.component';

type Props = {
  children: React.ReactNode;
};
const AppWrapper = (props: Props) => {
  const queryClient = useQueryClient();
  //Set up state
  const searchParams = useSearchParams();
  const token = searchParams.get('token') as string;
  const { data: loggedInData, isLoading: userIsLoading } = useUser(token);
  //Set up socket connection
  const { socket, isConnecting, setSocket, setIsConnecting } = useSocketStore((state: any) => state);

  useEffect(() => {
    if (process.env.API_URL) {
      setIsConnecting(true);
      const socket = io(process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : process.env.API_URL.replace('/api/v1', ''));
      socket.on('connect', () => {
        setIsConnecting(false);
        setSocket(socket);
      });
      return () => {
        socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    //If there is a user and a socket connection, setup a setup event with the user data

    if (socket && isConnecting) {
      // Listen for user updates
      socket.emit('setup', loggedInData?.user);
      socket.on('updateUser', () => {
        queryClient.invalidateQueries(['user'] as any);
      });
    }

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [socket]);
  return (
    <>
      {props.children}
      {!userIsLoading && loggedInData?.needsBillingSetup && (
        <BillingSetupModal open={true} />
      )}
    </>
  );
};

export default AppWrapper;
