import React from 'react';
import { Modal, Typography, Space, Tag, Divider, Button, Empty } from 'antd';
import { DownloadOutlined, PrinterOutlined, CloseOutlined } from '@ant-design/icons';
import { IResumeProfile, IExperience, IEducation, IAward, IQA, IReference, IMedia } from '@/types/IResumeTypes';
import { IAthlete } from '@/types/IAthleteType';
import styles from './ResumePreviewModal.module.scss';

const { Title, Text, Paragraph } = Typography;

interface ResumePreviewModalProps {
  visible: boolean;
  onClose: () => void;
  resumeData: IResumeProfile | null;
  athlete: IAthlete | null;
}

const ResumePreviewModal: React.FC<ResumePreviewModalProps> = ({ visible, onClose, resumeData, athlete }) => {
  const formatDate = (date: Date | string | undefined): string => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const formatLocation = (location?: { city?: string; state?: string; country?: string }): string => {
    if (!location) return '';
    return [location.city, location.state, location.country].filter(Boolean).join(', ');
  };

  const renderHeaderSection = () => (
    <div className={styles.headerSection}>
      <div className={styles.athleteInfo}>
        <Title level={1} className={styles.athleteName}>
          {athlete?.fullName || 'Athlete Name'}
        </Title>
        <Text className={styles.athleteTitle}>
          {athlete?.positions?.[0]?.name || 'Athlete'} | {athlete?.college || 'Sports'}
        </Text>
        {athlete?.birthPlace && <Text type="secondary">📍 {formatLocation(athlete.birthPlace)}</Text>}
      </div>
      <div className={styles.watermark}>
        <img src="/images/logo.png" alt="FAP" className={styles.logo} />
        <Text type="secondary" className={styles.watermarkText}>
          FreeAgentPortal.com
        </Text>
      </div>
    </div>
  );

  const renderExperiencesSection = () => {
    if (!resumeData?.experiences?.length) return null;

    return (
      <div className={styles.section}>
        <Title level={3} className={styles.sectionTitle}>
          🏈 Athletic Experience
        </Title>
        <div className={styles.sectionContent}>
          {resumeData.experiences.map((experience: IExperience, index) => (
            <div key={experience._id} className={styles.experienceItem}>
              <div className={styles.experienceHeader}>
                <div>
                  <Title level={4} className={styles.itemTitle}>
                    {experience.orgName}
                  </Title>
                  {experience.position && (
                    <Tag color="blue" className={styles.positionTag}>
                      {experience.position}
                    </Tag>
                  )}
                </div>
                <div className={styles.dateRange}>
                  {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                </div>
              </div>

              <div className={styles.experienceDetails}>
                {experience.league && <Text className={styles.league}>{experience.league}</Text>}
                {experience.level && <Tag className={styles.levelTag}>{experience.level}</Tag>}
                {experience.location && <Text type="secondary">📍 {formatLocation(experience.location)}</Text>}
              </div>

              {experience.achievements && experience.achievements.length > 0 && (
                <div className={styles.achievements}>
                  <Text strong>Key Achievements:</Text>
                  <ul>
                    {experience.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}

              {experience.media && experience.media.length > 0 && (
                <div className={styles.media}>
                  <Text strong>Media & Highlights:</Text>
                  <div className={styles.mediaLinks}>
                    {experience.media.map((mediaItem, idx) => (
                      <Tag key={idx} color="green">
                        {mediaItem.kind} {idx + 1}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {index < resumeData.experiences.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducationSection = () => {
    if (!resumeData?.education?.length) return null;

    return (
      <div className={styles.section}>
        <Title level={3} className={styles.sectionTitle}>
          🎓 Education
        </Title>
        <div className={styles.sectionContent}>
          {resumeData.education.map((education: IEducation, index) => (
            <div key={education._id} className={styles.educationItem}>
              <div className={styles.educationHeader}>
                <div>
                  <Title level={4} className={styles.itemTitle}>
                    {education.school}
                  </Title>
                  {education.degreeOrProgram && <Text className={styles.degree}>{education.degreeOrProgram}</Text>}
                </div>
                <div className={styles.dateRange}>
                  {formatDate(education.startDate)} - {education.endDate ? formatDate(education.endDate) : 'Present'}
                </div>
              </div>

              {education.notes && <Paragraph className={styles.notes}>{education.notes}</Paragraph>}

              {index < resumeData.education.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAwardsSection = () => {
    if (!resumeData?.awards?.length) return null;

    return (
      <div className={styles.section}>
        <Title level={3} className={styles.sectionTitle}>
          🏆 Awards & Recognition
        </Title>
        <div className={styles.sectionContent}>
          {resumeData.awards.map((award: IAward, index) => (
            <div key={award._id} className={styles.awardItem}>
              <div className={styles.awardHeader}>
                <Title level={4} className={styles.itemTitle}>
                  {award.title}
                </Title>
                {award.year && (
                  <Tag color="gold" className={styles.yearTag}>
                    {award.year}
                  </Tag>
                )}
              </div>

              {award.org && <Text className={styles.organization}>{award.org}</Text>}

              {award.description && <Paragraph className={styles.description}>{award.description}</Paragraph>}

              {index < resumeData.awards.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderQASection = () => {
    if (!resumeData?.qa?.length) return null;

    return (
      <div className={styles.section}>
        <Title level={3} className={styles.sectionTitle}>
          💭 Personality & Character
        </Title>
        <div className={styles.sectionContent}>
          {resumeData.qa.map((qa: IQA, index) => (
            <div key={qa._id} className={styles.qaItem}>
              <div className={styles.question}>
                <Text strong>{qa.question}</Text>
              </div>
              <div className={styles.answer}>
                <Paragraph>{qa.answer}</Paragraph>
              </div>

              {index < resumeData.qa.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderReferencesSection = () => {
    if (!resumeData?.references?.length) return null;

    return (
      <div className={styles.section}>
        <Title level={3} className={styles.sectionTitle}>
          👥 References
        </Title>
        <div className={styles.sectionContent}>
          {resumeData.references.map((reference: IReference, index) => (
            <div key={reference._id} className={styles.referenceItem}>
              <div className={styles.referenceHeader}>
                <Title level={4} className={styles.itemTitle}>
                  {reference.name}
                </Title>
                {reference.role && (
                  <Tag color="purple" className={styles.roleTag}>
                    {reference.role}
                  </Tag>
                )}
              </div>

              {reference.organization && <Text className={styles.organization}>{reference.organization}</Text>}

              {reference.contact && (
                <div className={styles.contactInfo}>
                  {reference.contact.email && <Text>📧 {reference.contact.email}</Text>}
                  {reference.contact.phone && <Text>📞 {reference.contact.phone}</Text>}
                </div>
              )}

              {index < resumeData.references.length - 1 && <Divider />}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMediaSection = () => {
    if (!resumeData?.media?.length) return null;

    return (
      <div className={styles.section}>
        <Title level={3} className={styles.sectionTitle}>
          📱 Media & Highlights
        </Title>
        <div className={styles.sectionContent}>
          <div className={styles.mediaGrid}>
            {resumeData.media.map((mediaItem: IMedia, index) => (
              <div key={mediaItem._id} className={styles.mediaItem}>
                <Tag color="cyan" className={styles.mediaTag}>
                  {mediaItem.kind}
                </Tag>
                <Text className={styles.mediaLabel}>{mediaItem.label || `${mediaItem.kind} ${index + 1}`}</Text>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF generation with FAP watermark
    console.log('PDF download functionality to be implemented');
  };

  const hasContent =
    resumeData &&
    (resumeData.experiences?.length ||
      resumeData.education?.length ||
      resumeData.awards?.length ||
      resumeData.qa?.length ||
      resumeData.references?.length ||
      resumeData.media?.length);

  return (
    <Modal
      title={
        <div className={styles.modalHeader}>
          <Space>
            <Button icon={<DownloadOutlined />} type="primary" onClick={handleDownloadPDF} disabled={!hasContent}>
              Download PDF
            </Button>
          </Space>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width="90vw"
      style={{ maxWidth: '800px' }}
      className={styles.previewModal}
      closeIcon={<CloseOutlined />}
    >
      <div className={styles.resumePreview} id="resume-preview">
        {!hasContent ? (
          <Empty description="Your resume is empty. Add some content to see the preview!" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <>
            {renderHeaderSection()}
            {renderExperiencesSection()}
            {renderEducationSection()}
            {renderAwardsSection()}
            {renderQASection()}
            {renderReferencesSection()}
            {renderMediaSection()}

            <div className={styles.footer}>
              <Divider />
              <div className={styles.footerContent}>
                <Text type="secondary">Generated on {new Date().toLocaleDateString()} via FreeAgentPortal.com</Text>
                <Text type="secondary">Visibility: {resumeData?.visibility || 'Private'}</Text>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default ResumePreviewModal;
