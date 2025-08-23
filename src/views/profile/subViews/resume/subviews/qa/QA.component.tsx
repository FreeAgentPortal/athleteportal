import React, { useState } from 'react';
import { Typography, Empty, Button, Dropdown, MenuProps, Progress, Tag } from 'antd';
import { MoreOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { IResumeProfile, IQA } from '@/types/IResumeTypes';
import { PROSPECT_QUESTIONS, QUESTION_CATEGORIES } from '@/data/prospectQuestions';
import styles from './QA.module.scss';
import useApiHook from '@/hooks/useApi';
import QAModal from '../../modals/QAModal.component';

const { Text } = Typography;

interface QAProps {
  resumeData: IResumeProfile | null;
}

const renderEmptyState = (title: string, description: string) => (
  <Empty
    image={Empty.PRESENTED_IMAGE_SIMPLE}
    description={
      <div>
        <Text strong>{title}</Text>
        <br />
        <Text type="secondary">{description}</Text>
      </div>
    }
  />
);

const QA: React.FC<QAProps> = ({ resumeData }) => {
  // Modal state
  const [qaModalVisible, setQaModalVisible] = useState(false);
  const [editingQA, setEditingQA] = useState<IQA | null>(null);

  // API hooks - following the corrected pattern
  const { mutate: createQA, isPending: isCreatingQA } = useApiHook({
    key: 'create-qa',
    method: 'POST',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  const { mutate: updateQA, isPending: isUpdatingQA } = useApiHook({
    key: 'update-qa',
    method: 'PUT',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  const { mutate: deleteQA, isPending: isDeletingQA } = useApiHook({
    key: 'delete-qa',
    method: 'DELETE',
    queriesToInvalidate: ['resume-profile'],
  }) as any;

  // Get answered question IDs
  const answeredQuestionIds = resumeData?.qa?.map((qa) => qa.promptId) || [];
  const progressPercent = Math.round((answeredQuestionIds.length / PROSPECT_QUESTIONS.length) * 100);

  // Modal handlers
  const handleAddQA = () => {
    setEditingQA(null);
    setQaModalVisible(true);
  };

  const handleEditQA = (qa: IQA) => {
    setEditingQA(qa);
    setQaModalVisible(true);
  };

  const handleCloseQAModal = () => {
    setQaModalVisible(false);
    setEditingQA(null);
  };

  const handleDeleteQA = (qaId: string) => {
    deleteQA({
      url: `/profiles/resume/qa/${resumeData?._id}/${qaId}`,
    });
  };

  // QA submit handler
  const handleQASubmit = (qaData: Partial<IQA>) => {
    if (editingQA) {
      // Update existing QA
      updateQA({
        formData: { ...qaData, owner: resumeData?.owner },
        url: `/profiles/resume/qa/${editingQA._id}`,
      });
    } else {
      // Create new QA
      createQA({
        formData: { ...qaData, owner: resumeData?.owner },
        url: '/profiles/resume/qa',
      });
    }
    handleCloseQAModal();
  };

  // Get category for a question
  const getQuestionCategory = (promptId: string) => {
    const question = PROSPECT_QUESTIONS.find((q) => q.id === promptId);
    return question?.category || 'Unknown';
  };

  // Custom render section header with progress
  const renderQASectionHeader = () => (
    <div className={styles.qaHeader}>
      <div className={styles.headerTop}>
        <div className={styles.sectionTitle}>
          <h3>❓ Questions & Answers</h3>
          <span className={styles.subtitle}>Showcase your personality and character to teams</span>
        </div>
        <Button type="primary" icon={<QuestionCircleOutlined />} onClick={handleAddQA} size="small">
          Answer Question
        </Button>
      </div>
      <div className={styles.progressSection}>
        <div className={styles.progressInfo}>
          <span className={styles.progressText}>
            Progress: {answeredQuestionIds.length} of {PROSPECT_QUESTIONS.length} questions answered
          </span>
          <span className={styles.progressPercent}>{progressPercent}%</span>
        </div>
        <Progress percent={progressPercent} showInfo={false} strokeColor={progressPercent === 100 ? '#52c41a' : '#1890ff'} className={styles.progressBar} />
      </div>
    </div>
  );
  return (
    <div className={styles.qaContainer}>
      {renderQASectionHeader()}
      {!resumeData?.qa?.length ? (
        renderEmptyState('No Q&A added yet', 'Answer prospect questions to showcase your character and football IQ')
      ) : (
        <div className={styles.qaList}>
          {resumeData.qa.map((qa) => {
            const category = getQuestionCategory(qa.promptId);
            const menuItems: MenuProps['items'] = [
              {
                key: 'edit',
                label: 'Edit Answer',
                icon: <EditOutlined />,
                onClick: () => handleEditQA(qa),
              },
              {
                key: 'delete',
                label: 'Delete Answer',
                icon: <DeleteOutlined />,
                danger: true,
                onClick: () => handleDeleteQA(qa._id),
              },
            ];

            return (
              <div key={qa._id} className={styles.qaCard}>
                <div className={styles.qaCardHeader}>
                  <div className={styles.questionSection}>
                    <Tag color="blue" className={styles.categoryTag}>
                      {category}
                    </Tag>
                    <h5 className={styles.question}>❓ {qa.question}</h5>
                  </div>
                  <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
                    <Button type="text" icon={<MoreOutlined />} size="small" />
                  </Dropdown>
                </div>

                <div className={styles.answer}>
                  <p>{qa.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* QA Modal */}
      <QAModal visible={qaModalVisible} onClose={handleCloseQAModal} onSubmit={handleQASubmit} qa={editingQA} isEditing={!!editingQA} answeredQuestions={answeredQuestionIds} />
    </div>
  );
};

export default QA;
