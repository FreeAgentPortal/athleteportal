import React, { useEffect, useState } from 'react';
import { Modal, Form, Select, Input, Button, Divider, Typography, Badge } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { IQA } from '@/types/IResumeTypes';
import { PROSPECT_QUESTIONS, QUESTION_CATEGORIES, QuestionPrompt } from '@/data/prospectQuestions';
import styles from './Modal.module.scss';

const { Option } = Select;
const { TextArea } = Input;
const { Text, Title } = Typography;

interface QAModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (qaData: Partial<IQA>) => void;
  qa?: IQA | null;
  isEditing?: boolean;
  answeredQuestions?: string[]; // Array of promptIds that have been answered
}

const QAModal: React.FC<QAModalProps> = ({ visible, onClose, onSubmit, qa, isEditing = false, answeredQuestions = [] }) => {
  const [form] = Form.useForm();
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionPrompt | null>(null);

  // Reset form when modal opens/closes or when qa changes
  useEffect(() => {
    if (visible) {
      if (isEditing && qa) {
        const questionPrompt = PROSPECT_QUESTIONS.find((q) => q.id === qa.promptId);
        form.setFieldsValue({
          promptId: qa.promptId,
          answer: qa.answer,
        });
        if (questionPrompt) {
          setSelectedCategory(questionPrompt.category);
          setSelectedQuestion(questionPrompt);
        }
      } else {
        form.resetFields();
        setSelectedCategory('');
        setSelectedQuestion(null);
      }
    }
  }, [visible, qa, isEditing, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const questionPrompt = PROSPECT_QUESTIONS.find((q) => q.id === values.promptId);

      if (!questionPrompt) {
        console.error('Question not found');
        return;
      }

      const qaData = {
        promptId: values.promptId,
        question: questionPrompt.question,
        answer: values.answer,
      };

      onSubmit(qaData);
      form.resetFields();
      setSelectedCategory('');
      setSelectedQuestion(null);
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedCategory('');
    setSelectedQuestion(null);
    onClose();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedQuestion(null);
    form.setFieldsValue({ promptId: undefined });
  };

  const handleQuestionChange = (promptId: string) => {
    const questionPrompt = PROSPECT_QUESTIONS.find((q) => q.id === promptId);
    setSelectedQuestion(questionPrompt || null);
  };

  // Filter questions by category and exclude already answered ones (unless editing)
  const getAvailableQuestions = (category: string) => {
    return PROSPECT_QUESTIONS.filter((q) => {
      const matchesCategory = q.category === category;
      const isAlreadyAnswered = answeredQuestions.includes(q.id);
      const isCurrentQuestion = isEditing && qa?.promptId === q.id;

      return matchesCategory && (!isAlreadyAnswered || isCurrentQuestion);
    });
  };

  const getUnansweredCount = (category: string) => {
    const categoryQuestions = PROSPECT_QUESTIONS.filter((q) => q.category === category);
    const answered = categoryQuestions.filter((q) => answeredQuestions.includes(q.id));
    return categoryQuestions.length - answered.length;
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <QuestionCircleOutlined />
          {isEditing ? 'Edit Q&A Response' : 'Add Q&A Response'}
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={700}
      className={styles.modal}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {isEditing ? 'Update Response' : 'Add Response'}
        </Button>,
      ]}
    >
      <div className={styles.modalContent}>
        <div className={styles.helperText}>
          <Title level={5}>💭 Showcase Your Personality</Title>
          <Text>
            These questions help teams understand who you are beyond your stats. Answer thoughtfully to show your character, football IQ, and team fit.
            <br />
            <strong>
              Progress: {answeredQuestions.length}/{PROSPECT_QUESTIONS.length} questions answered
            </strong>
          </Text>
        </div>

        <Form form={form} layout="vertical" className={styles.form} requiredMark={false}>
          {/* Category Selection */}
          <Form.Item label="Question Category" rules={[{ required: true, message: 'Please select a category' }]}>
            <Select placeholder="Choose a category to see available questions" size="large" value={selectedCategory} onChange={handleCategoryChange}>
              {QUESTION_CATEGORIES.map((category) => {
                const unansweredCount = getUnansweredCount(category);
                return (
                  <Option key={category} value={category} disabled={unansweredCount === 0 && !isEditing}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>{category}</span>
                      <Badge count={unansweredCount} style={{ backgroundColor: unansweredCount > 0 ? '#52c41a' : '#d9d9d9' }} />
                    </div>
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          {/* Question Selection */}
          {selectedCategory && (
            <Form.Item name="promptId" label="Select Question" rules={[{ required: true, message: 'Please select a question' }]}>
              <Select placeholder="Choose a question to answer" size="large" onChange={handleQuestionChange}>
                {getAvailableQuestions(selectedCategory).map((question) => (
                  <Option key={question.id} value={question.id}>
                    {question.question}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* Selected Question Display */}
          {selectedQuestion && (
            <div className={styles.selectedQuestion}>
              <Divider />
              <Title level={5} style={{ color: '#1890ff', margin: '0 0 12px 0' }}>
                ❓ {selectedQuestion.question}
              </Title>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                Take your time to provide a thoughtful, authentic response.
              </Text>
            </div>
          )}

          {/* Answer */}
          <Form.Item
            name="answer"
            label="Your Answer"
            rules={[
              { required: true, message: 'Please provide an answer' },
              { min: 10, message: 'Answer should be at least 10 characters' },
              { max: 2000, message: 'Answer should be less than 2000 characters' },
            ]}
          >
            <TextArea placeholder="Share your authentic response here..." rows={6} size="large" showCount maxLength={2000} />
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default QAModal;
