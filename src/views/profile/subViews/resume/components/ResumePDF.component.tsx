import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, Link } from '@react-pdf/renderer';
import { IResumeProfile, IExperience, IEducation, IAward, IQA, IReference, IMedia } from '@/types/IResumeTypes';
import { IAthlete } from '@/types/IAthleteType';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 40,
    paddingBottom: 80, // Extra bottom padding to avoid footer overlap
    fontFamily: 'Helvetica',
    fontSize: 11,
    lineHeight: 1.4,
  },

  // Header Section
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottom: '2pt solid #1890ff',
  },

  athleteInfo: {
    flex: 1,
  },

  athleteName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1890ff',
    marginBottom: 8,
  },

  athleteTitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },

  athleteLocation: {
    fontSize: 10,
    color: '#999999',
  },

  watermark: {
    alignItems: 'center',
    opacity: 0.7,
    padding: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },

  logo: {
    width: 20,
    height: 20,
    marginBottom: 5,
  },

  watermarkText: {
    fontSize: 8,
    color: '#666666',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  // Section Styles
  section: {
    marginBottom: 10, // Increased spacing between sections
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1890ff',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottom: '1pt solid #e8e8e8',
  },

  sectionContent: {
    paddingLeft: 10,
  },

  // Item Styles
  item: {
    marginBottom: 15,
  },

  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },

  itemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 3,
  },

  itemSubtitle: {
    fontSize: 11,
    color: '#1890ff',
    marginBottom: 5,
  },

  dateRange: {
    fontSize: 10,
    color: '#666666',
    fontWeight: 'bold',
  },

  tag: {
    backgroundColor: '#f0f9ff',
    color: '#1890ff',
    padding: '2 8',
    borderRadius: 12,
    fontSize: 9,
    marginRight: 5,
    marginBottom: 3,
  },

  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 10,
  },

  league: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1890ff',
  },

  location: {
    fontSize: 10,
    color: '#666666',
  },

  // Content Styles
  achievements: {
    marginTop: 8,
  },

  achievementTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 5,
  },

  achievementList: {
    paddingLeft: 15,
  },

  achievementItem: {
    fontSize: 10,
    marginBottom: 3,
    color: '#333333',
  },

  // Q&A Styles
  questionBox: {
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 6,
    borderLeft: '3pt solid #1890ff',
    marginBottom: 12,
    // Ensure it doesn't overlap with footer
    zIndex: 1,
  },

  question: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333333',
  },

  answer: {
    fontSize: 10,
    color: '#666666',
    paddingLeft: 10,
    lineHeight: 1.5,
  },

  // Contact and Organization
  organization: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 5,
  },

  // Media Styles
  mediaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    marginBottom: 10,
  },

  mediaContent: {
    flex: 1,
    marginRight: 10,
  },

  mediaLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },

  mediaLink: {
    fontSize: 10,
    color: '#1890ff',
    textDecoration: 'underline',
  },

  mediaType: {
    fontSize: 9,
    color: '#1890ff',
    backgroundColor: '#f0f9ff',
    padding: '3 8',
    borderRadius: 8,
    textTransform: 'uppercase',
    fontWeight: 'bold',
  },

  contactInfo: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 5,
  },

  contactItem: {
    fontSize: 10,
    color: '#333333',
  },

  notes: {
    fontSize: 10,
    color: '#666666',
    marginTop: 5,
    lineHeight: 1.4,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20, // Moved up slightly from bottom
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTop: '1pt solid #e8e8e8',
    backgroundColor: '#ffffff', // Solid background to prevent overlap
    zIndex: 10, // Higher z-index to stay on top
  },

  footerText: {
    fontSize: 8,
    color: '#999999',
  },
});

interface ResumePDFProps {
  resumeData: IResumeProfile;
  athlete: IAthlete | null;
}

const ResumePDF: React.FC<ResumePDFProps> = ({ resumeData, athlete }) => {
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

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.athleteInfo}>
        <Text style={styles.athleteName}>{athlete?.fullName || 'Athlete Name'}</Text>
        <Text style={styles.athleteTitle}>
          {athlete?.positions?.[0]?.name || 'Athlete'} | {athlete?.college || 'Sports'}
        </Text>
        {athlete?.birthPlace && <Text style={styles.athleteLocation}>{formatLocation(athlete.birthPlace)}</Text>}
      </View>
      <View style={styles.watermark}>
        <Image style={styles.logo} src="https://res.cloudinary.com/dsltlng97/image/upload/v1752863629/placeholder-logo_s7jg3y.png" />
        <Text style={styles.watermarkText}>FreeAgentPortal.com</Text>
      </View>
    </View>
  );

  const renderExperiences = () => {
    if (!resumeData.experiences?.length) return null;

    return (
      <View style={styles.section} break={false}>
        <Text style={styles.sectionTitle}>Athletic Experience</Text>
        <View style={styles.sectionContent}>
          {resumeData.experiences.map((experience: IExperience, index) => (
            <View key={experience._id} style={styles.item} break={index > 0}>
              <View style={styles.itemHeader}>
                <View>
                  <Text style={styles.itemTitle}>{experience.orgName}</Text>
                  {experience.position && <Text style={styles.itemSubtitle}>{experience.position}</Text>}
                </View>
                <Text style={styles.dateRange}>
                  {formatDate(experience.startDate)} - {experience.endDate ? formatDate(experience.endDate) : 'Present'}
                </Text>
              </View>

              <View style={styles.details}>
                {experience.league && <Text style={styles.league}>{experience.league}</Text>}
                {experience.level && <Text style={styles.tag}>{experience.level}</Text>}
                {experience.location && <Text style={styles.location}>{formatLocation(experience.location)}</Text>}
              </View>

              {experience.achievements && experience.achievements.length > 0 && (
                <View style={styles.achievements}>
                  <Text style={styles.achievementTitle}>Key Achievements:</Text>
                  <View style={styles.achievementList}>
                    {experience.achievements.map((achievement, idx) => (
                      <Text key={idx} style={styles.achievementItem}>
                        • {achievement}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderEducation = () => {
    if (!resumeData.education?.length) return null;

    return (
      <View style={styles.section} break={false}>
        <Text style={styles.sectionTitle}>Education</Text>
        <View style={styles.sectionContent}>
          {resumeData.education.map((education: IEducation) => (
            <View key={education._id} style={styles.item}>
              <View style={styles.itemHeader}>
                <View>
                  <Text style={styles.itemTitle}>{education.school}</Text>
                  {education.degreeOrProgram && <Text style={styles.itemSubtitle}>{education.degreeOrProgram}</Text>}
                </View>
                <Text style={styles.dateRange}>
                  {formatDate(education.startDate)} - {education.endDate ? formatDate(education.endDate) : 'Present'}
                </Text>
              </View>

              {education.notes && <Text style={styles.notes}>{education.notes}</Text>}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderMedia = () => {
    if (!resumeData.media?.length) return null;

    return (
      <View style={styles.section} break={false}>
        <Text style={styles.sectionTitle}>Media & Highlights</Text>
        <View style={styles.sectionContent}>
          {resumeData.media.map((media: IMedia) => (
            <View key={media._id} style={styles.mediaItem}>
              <View style={styles.mediaContent}>
                <Text style={styles.mediaLabel}>{media.label || 'Media Item'}</Text>
                <Link src={media.url} style={styles.mediaLink}>
                  Click to view {media.kind}
                </Link>
              </View>
              <Text style={styles.mediaType}>{media.kind}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderAwards = () => {
    if (!resumeData.awards?.length) return null;

    return (
      <View style={styles.section} break={false}>
        <Text style={styles.sectionTitle}>Awards & Recognition</Text>
        <View style={styles.sectionContent}>
          {resumeData.awards.map((award: IAward) => (
            <View key={award._id} style={styles.item}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{award.title}</Text>
                {award.year && <Text style={styles.dateRange}>{award.year}</Text>}
              </View>

              {award.org && <Text style={styles.organization}>{award.org}</Text>}

              {award.description && <Text style={styles.notes}>{award.description}</Text>}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderQA = () => {
    if (!resumeData.qa?.length) return null;
    return (
      <View style={styles.section} break={true}>
        <Text style={styles.sectionTitle}>Personality & Character</Text>
        <View style={styles.sectionContent}>
          {resumeData.qa.map((qa: IQA) => (
            <View key={qa._id} style={styles.item}>
              <View style={styles.questionBox}>
                <Text style={styles.question}>{qa.question}</Text>
              </View>
              <Text style={styles.answer}>{qa.answer}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderReferences = () => {
    if (!resumeData.references?.length) return null;

    return (
      <View style={styles.section} break={false}>
        <Text style={styles.sectionTitle}>References</Text>
        <View style={styles.sectionContent}>
          {resumeData.references.map((reference: IReference) => (
            <View key={reference._id} style={styles.item}>
              <View style={styles.itemHeader}>
                <View>
                  <Text style={styles.itemTitle}>{reference.name}</Text>
                  {reference.role && <Text style={styles.itemSubtitle}>{reference.role}</Text>}
                </View>
              </View>

              {reference.organization && <Text style={styles.organization}>{reference.organization}</Text>}

              {reference.contact && (
                <View style={styles.contactInfo}>
                  {reference.contact.email && <Text style={styles.contactItem}>Email: {reference.contact.email}</Text>}
                  {reference.contact.phone && <Text style={styles.contactItem}>Phone: {reference.contact.phone}</Text>}
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderFooter = () => (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>Generated on {new Date().toLocaleDateString()} via FreeAgentPortal.com</Text>
      <Text style={styles.footerText}>Visibility: {resumeData.visibility || 'Private'}</Text>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {renderHeader()}
        {renderExperiences()}
        {renderEducation()}
        {renderMedia()}
        {renderAwards()}
        {renderReferences()}
        {renderQA()}
        {renderFooter()}
      </Page>
    </Document>
  );
};

export default ResumePDF;
