'use client';
import React, { useEffect, useState } from 'react';
import { Tour } from 'antd';
import type { TourProps } from 'antd';
import { useUser } from '@/state/auth';
import axios from '@/utils/axios';
import { useQueryClient } from '@tanstack/react-query';
import '@/styles/antd-override.module.css';

interface FeedTourProps {
  createPostRef: React.RefObject<HTMLDivElement | null>;
}

const FeedTour = ({ createPostRef }: FeedTourProps) => {
  const [open, setOpen] = useState(false);
  const { data: loggedInUser } = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Check if user has seen the tour from their notificationSettings
    if (loggedInUser) {
      const hasSeenTour = loggedInUser.notificationSettings?.feedTour;

      if (!hasSeenTour) {
        // Small delay to ensure refs are mounted
        const timer = setTimeout(() => {
          setOpen(true);
        }, 500);

        return () => clearTimeout(timer);
      }
    }
  }, [loggedInUser]);

  const handleClose = async () => {
    setOpen(false);

    // Update user's notificationSettings in the database
    if (loggedInUser?._id) {
      try {
        await axios.put(`/user/${loggedInUser._id}`, {
          notificationSettings: {
            ...loggedInUser.notificationSettings,
            feedTour: true,
          },
        });

        // Invalidate user query to refresh the data
        queryClient.invalidateQueries({ queryKey: ['user'] });
      } catch (error) {
        console.error('Failed to update feed tour status:', error);
      }
    }
  };

  const steps: TourProps['steps'] = [
    {
      title: 'Welcome to Your Feed!',
      description: "This is where you can share updates, media, and connect with your community. Let's show you how to create your first post.",
      target: null,
    },
    {
      title: 'Create a Post',
      description: 'Click here to start creating a post. You can share text, photos, videos, and more with your followers.',
      target: () => createPostRef.current as HTMLElement,
    },
    {
      title: 'Share Your Content',
      description: "Once you click, you'll be able to write your message, add media, and customize who can see your post.",
      target: () => createPostRef.current as HTMLElement,
    },
    {
      title: "You're All Set!",
      description: 'Start sharing your journey! Your posts will appear here in your feed where others can react and comment.',
      target: null,
    },
  ];

  return (
    <Tour
      open={open}
      onClose={handleClose}
      onFinish={handleClose}
      steps={steps}
      indicatorsRender={(current, total) => (
        <span>
          {current + 1} / {total}
        </span>
      )}
      type="primary"
    />
  );
};

export default FeedTour;
