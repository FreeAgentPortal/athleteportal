'use client';
import React from 'react';
import { Table, Tag, Button, Space, Avatar } from 'antd';
import { ColumnsType } from 'antd/es/table';
import Link from 'next/link';
import { IoMdAdd, IoMdOpen } from 'react-icons/io';
import { ITeamType } from '@/types/ITeamType';
import useApiHook from '@/hooks/useApi';
import { useUser } from '@/state/auth';
import styles from './TeamTable.module.scss';

type Props = {
  teams: ITeamType[];
};

const TeamTable: React.FC<Props> = ({ teams }) => {
  const { mutate: subscribe } = useApiHook({
    method: 'POST',
    key: ['team-subscribe'],
    queriesToInvalidate: [`team-search`],
    successMessage: 'Subscription updated successfully',
  }) as any;
  const { data: loggedInData } = useUser();
  const { data: profileData } = useApiHook({
    method: 'GET',
    key: ['profile', 'athlete'],
    url: `/athlete/profile/${loggedInData?.profileRefs['athlete']}`,
    enabled: !!loggedInData?.profileRefs['athlete'],
  });

  const subscribeToTeam = (teamId: string) => {
    subscribe({
      url: `/feed/subscription/toggle`,
      formData: {
        subscriber: {
          role: 'athlete',
          profileId: profileData.payload._id,
        },
        target: {
          role: 'team',
          profileId: teamId,
        },
      },
    });
  };

  const columns: ColumnsType<ITeamType> = [
    {
      title: 'Logo',
      dataIndex: 'logoUrl',
      key: 'logo',
      render: (logoUrl: string, record) => (logoUrl ? <Avatar src={logoUrl} alt={`${record.name} logo`} shape="square" size={48} /> : null),
    },
    {
      title: 'Team Name',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record) => <span className="text-blue-600 hover:underline">{text}</span>,
    },
    {
      title: 'Status',
      dataIndex: 'openToTryouts',
      key: 'status',
      render: (open: boolean) => (open ? <Tag color="green">Open to Tryouts</Tag> : <Tag color="gray">Not Recruiting</Tag>),
    },
    {
      title: 'Coach',
      dataIndex: 'coachName',
      key: 'coach',
      render: (coach: string) => coach || 'N/A',
    },
    {
      title: 'State',
      dataIndex: 'location',
      key: 'location',
      render: (loc: string) => loc || 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => {
        const subscribed = profileData?.payload?.subscriptions?.some((sub: any) => sub.targetProfileId === record._id) || false;
        return (
          <Space>
            <Link href={`/team/${record._id}`}>
              <Button icon={<IoMdOpen />} />
            </Link>
            {subscribed ? (
              <Button type="primary" onClick={() => subscribeToTeam(record._id)} disabled>
                ✔ Subscribed
              </Button>
            ) : (
              <Button icon={<IoMdAdd />} onClick={() => subscribeToTeam(record._id)} disabled>
                Subscribe
              </Button>
            )}
          </Space>
        );
      },
    },
  ];

  if (!teams) {
    return <div>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Table columns={columns} dataSource={teams} rowKey="_id" pagination={false} />
    </div>
  );
};

export default TeamTable;
