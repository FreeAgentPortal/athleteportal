'use client';
import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { EventDocument } from '@/types/IEventType';
import { IoInformationCircleOutline, IoPeopleOutline } from 'react-icons/io5';
import { MdSportsSoccer } from 'react-icons/md';
import { getEventTypeLabel, getStatusColor } from './utils/eventCardHelpers';
import EventInfoTab from './tabs/eventInfo/EventInfo.tab';
import EventAttendeesTab from './tabs/eventAttendees/EventAttendees.tab';
import styles from './EventDetailCard.module.scss';

interface EventDetailCardProps {
  event: EventDocument;
}

const EventDetailCard = ({ event }: EventDetailCardProps) => {
  const tabItems: TabsProps['items'] = [
    {
      key: 'details',
      label: (
        <span className={styles.tabLabel}>
          <IoInformationCircleOutline size={20} />
          <span>Event Details</span>
        </span>
      ),
      children: <EventInfoTab event={event} />,
    },
    {
      key: 'attendees',
      label: (
        <span className={styles.tabLabel}>
          <IoPeopleOutline size={20} />
          <span>Attendees</span>
        </span>
      ),
      children: <EventAttendeesTab event={event} />,
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <span className={styles.eventType}>{getEventTypeLabel(event.type)}</span>
          <span className={`${styles.status} ${getStatusColor(event.status, styles)}`}>{event.status.toUpperCase()}</span>
        </div>
        {event.sport && (
          <div className={styles.sport}>
            <MdSportsSoccer size={18} />
            <span>{event.sport}</span>
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div className={styles.titleSection}>
        <h2 className={styles.title}>{event.title}</h2>
        {event.description && <p className={styles.description}>{event.description}</p>}
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="details" items={tabItems} className={styles.tabs} />
    </div>
  );
};

export default EventDetailCard;
