'use client';
import React from 'react';
import { EventDocument } from '@/types/IEventType';
import { IoCalendarOutline, IoLocationOutline, IoTimeOutline, IoPeopleOutline } from 'react-icons/io5';
import { MdSportsSoccer } from 'react-icons/md';
import styles from './EventCard.module.scss';

interface EventCardProps {
  event: EventDocument;
}

const EventCard = ({ event }: EventCardProps) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getEventTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return styles.statusScheduled;
      case 'active':
        return styles.statusActive;
      case 'completed':
        return styles.statusCompleted;
      case 'canceled':
        return styles.statusCanceled;
      case 'postponed':
        return styles.statusPostponed;
      default:
        return '';
    }
  };

  const getLocationDisplay = () => {
    if (event.location.kind === 'virtual') {
      return event.location.virtual?.platform || 'Virtual Event';
    }
    if (event.location.physical) {
      const parts = [event.location.physical.venueName, event.location.physical.city, event.location.physical.state].filter(Boolean);
      return parts.join(', ') || 'Physical Location';
    }
    return 'Location TBD';
  };

  return (
    <div className={styles.container}>
      {/* Event Header */}
      <div className={styles.header}>
        <div className={styles.typeAndStatus}>
          <span className={styles.eventType}>{getEventTypeLabel(event.type)}</span>
          <span className={`${styles.status} ${getStatusColor(event.status)}`}>{event.status.toUpperCase()}</span>
        </div>
        {event.sport && (
          <div className={styles.sport}>
            <MdSportsSoccer size={16} />
            <span>{event.sport}</span>
          </div>
        )}
      </div>

      {/* Event Title & Description */}
      <div className={styles.eventInfo}>
        <h3 className={styles.title}>{event.title}</h3>
        {event.description && <p className={styles.description}>{event.description}</p>}
      </div>

      {/* Event Details Grid */}
      <div className={styles.detailsGrid}>
        {/* Date & Time */}
        <div className={styles.detailItem}>
          <IoCalendarOutline size={20} className={styles.icon} />
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Date</span>
            <span className={styles.detailValue}>{formatDate(event.startsAt)}</span>
          </div>
        </div>

        <div className={styles.detailItem}>
          <IoTimeOutline size={20} className={styles.icon} />
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Time</span>
            <span className={styles.detailValue}>{event.allDay ? 'All Day' : `${formatTime(event.startsAt)} - ${formatTime(event.endsAt)}`}</span>
          </div>
        </div>

        {/* Location */}
        <div className={styles.detailItem}>
          <IoLocationOutline size={20} className={styles.icon} />
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Location</span>
            <span className={styles.detailValue}>{getLocationDisplay()}</span>
          </div>
        </div>

        {/* Audience */}
        <div className={styles.detailItem}>
          <IoPeopleOutline size={20} className={styles.icon} />
          <div className={styles.detailContent}>
            <span className={styles.detailLabel}>Audience</span>
            <span className={styles.detailValue}>{event.audience.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Registration Info */}
      {event.registration?.required && (
        <div className={styles.registrationInfo}>
          <div className={styles.registrationHeader}>
            <span className={styles.registrationLabel}>Registration Required</span>
            {event.registration.capacity && <span className={styles.capacity}>Capacity: {event.registration.capacity}</span>}
          </div>
          {event.registration.opensAt && event.registration.closesAt && (
            <p className={styles.registrationDates}>
              Opens: {formatDate(event.registration.opensAt)} | Closes: {formatDate(event.registration.closesAt)}
            </p>
          )}
          {event.registration.price && (
            <p className={styles.price}>
              Price: ${event.registration.price} {event.registration.currency || 'USD'}
            </p>
          )}
        </div>
      )}

      {/* Eligibility */}
      {event.eligibility && (
        <div className={styles.eligibility}>
          <span className={styles.eligibilityLabel}>Eligibility:</span>
          {event.eligibility.positions && event.eligibility.positions.length > 0 && (
            <span className={styles.eligibilityItem}>Positions: {event.eligibility.positions.join(', ')}</span>
          )}
          {event.eligibility.ageRange && (
            <span className={styles.eligibilityItem}>
              Age: {event.eligibility.ageRange.min || '?'} - {event.eligibility.ageRange.max || '?'}
            </span>
          )}
        </div>
      )}

      {/* Tags */}
      {event.tags && event.tags.length > 0 && (
        <div className={styles.tags}>
          {event.tags.map((tag, index) => (
            <span key={index} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Button */}
      <div className={styles.actions}>
        <button className={styles.primaryButton}>{event.registration?.required ? 'Register Now' : 'View Details'}</button>
        {event.location.kind === 'virtual' && event.location.virtual?.meetingUrl && <button className={styles.secondaryButton}>Join Virtual Event</button>}
      </div>
    </div>
  );
};

export default EventCard;
