'use client';
import React, { useEffect, useState } from 'react';
import { Tour } from 'antd';
import type { TourProps } from 'antd';
import { useUser } from '@/state/auth';
import { useLayoutStore } from '@/state/layout';
import axios from '@/utils/axios';
import { useQueryClient } from '@tanstack/react-query';
import '@/styles/antd-override.module.css';

const SidebarTour = () => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { data: loggedInUser } = useUser();
  const queryClient = useQueryClient();
  const { sideBarOpen, toggleSideBar } = useLayoutStore();

  useEffect(() => {
    // Check if user has seen the sidebar tour
    if (loggedInUser) {
      const hasSeenTour = loggedInUser.notificationSettings?.sidebarTour;

      if (!hasSeenTour) {
        // Small delay to ensure DOM is mounted
        const timer = setTimeout(() => {
          setOpen(true);
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [loggedInUser]);

  const handleStepChange = (current: number) => {
    // When moving to step 1 (Home link), ensure sidebar is open
    if (current === 1 && !sideBarOpen) {
      toggleSideBar();

      // Wait for sidebar animation to complete before advancing step
      setTimeout(() => {
        setCurrentStep(current);
      }, 500); // Adjust timing to match sidebar animation duration
    } else {
      setCurrentStep(current);
    }
  };

  const handleClose = async () => {
    setOpen(false);

    // Update user's notificationSettings in the database
    if (loggedInUser?._id) {
      try {
        await axios.put(`/user/${loggedInUser._id}`, {
          notificationSettings: {
            ...loggedInUser.notificationSettings,
            sidebarTour: true,
          },
        });

        // Invalidate user query to refresh the data
        queryClient.invalidateQueries({ queryKey: ['user'] });
      } catch (error) {
        console.error('Failed to update sidebar tour status:', error);
      }
    }
  };

  const steps: TourProps['steps'] = [
    {
      title: 'Welcome to the Athlete Portal!',
      description: "Let's take a quick tour of the navigation menu to help you get started and explore all the features available to you.",
      target: null,
    },
    {
      title: 'Home',
      description: 'Your personal dashboard where you can see an overview of your activity and quick access to important features.',
      target: () => document.getElementById('sidebar-link-home') as HTMLElement,
    },
    {
      title: 'Feed',
      description: 'Stay connected! View and share updates, media, and posts with the community. This is your social hub.',
      target: () => document.getElementById('sidebar-link-feed') as HTMLElement,
    },
    {
      title: 'My Posts',
      description: "View all the posts you've created in one place. Track your content and engagement.",
      target: () => document.getElementById('sidebar-link-my_posts') as HTMLElement,
    },
    {
      title: 'Notifications',
      description: 'Stay up to date with alerts about messages, interactions, events, and important updates.',
      target: () => document.getElementById('sidebar-link-notifications') as HTMLElement,
    },
    {
      title: 'Team Finder',
      description: 'Discover teams looking for athletes like you. Browse opportunities and connect with coaches and recruiters.',
      target: () => document.getElementById('sidebar-link-team_finder') as HTMLElement,
    },
    {
      title: 'Messages',
      description: 'Communicate directly with teams, coaches, and other athletes. All your conversations in one place.',
      target: () => document.getElementById('sidebar-link-messages') as HTMLElement,
    },
    {
      title: 'Profile',
      description: 'Manage your athlete profile, stats, media, and achievements. Make your best impression!',
      target: () => document.getElementById('sidebar-link-profile') as HTMLElement,
    },
    {
      title: 'Account Settings',
      description: 'Update your personal information, privacy settings, and account preferences.',
      target: () => document.getElementById('sidebar-link-account_details') as HTMLElement,
    },
    {
      title: 'Support',
      description: 'Need help? Contact our support team or browse FAQs to get assistance.',
      target: () => document.getElementById('sidebar-link-support') as HTMLElement,
    },
    {
      title: 'Billing',
      description: 'Manage your subscription, payment methods, and view billing history.',
      target: () => document.getElementById('sidebar-link-account_center') as HTMLElement,
    },
    {
      title: "You're Ready!",
      description: "That's everything! Use the sidebar to navigate between these sections anytime. Start exploring your portal!",
      target: null,
    },
  ];

  return (
    <Tour
      open={open}
      onClose={handleClose}
      onFinish={handleClose}
      onChange={handleStepChange}
      current={currentStep}
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

export default SidebarTour;
