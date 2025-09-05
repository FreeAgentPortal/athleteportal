'use client';
import React, { useState, useEffect } from 'react';
import styles from './BasicInfo.module.scss';
import formStyles from '@/styles/Form.module.scss';
import { Button, DatePicker, Form, Input, Card, Space, Select, Checkbox } from 'antd';
import { UserOutlined, MailOutlined, PhoneOutlined, SaveOutlined, CalendarOutlined } from '@ant-design/icons';
import { useQueryClient } from '@tanstack/react-query';
import { IAthlete } from '@/types/IAthleteType';
import useApiHook from '@/hooks/useApi';
import PhotoUpload from '@/components/photoUpload/PhotoUpload.component';
import dayjs from 'dayjs';
import { useInterfaceStore } from '@/state/interface';
import { availablePositions } from '@/data/positions';

const { Option } = Select;

const BasicInfo = () => {
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData(['profile', 'athlete']) as any;
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);
  const [hasAgent, setHasAgent] = useState(false);
  const { addAlert } = useInterfaceStore((state) => state);

  // Get athlete data
  const { data: athleteData } = useApiHook({
    url: `/athlete/${profile?.payload?._id}`,
    key: ['athlete', profile?.payload?._id as string],
    method: 'GET',
  });

  // Update athlete basic info
  const { mutate: updateProfile, isLoading: isUpdating } = useApiHook({
    method: 'PUT',
    url: `/athlete/${profile?.payload?._id}`,
    key: 'updateProfile',
    queriesToInvalidate: ['profile', 'athlete'],
  }) as any;

  useEffect(() => {
    if (athleteData?.payload || profile?.payload) {
      const data = athleteData?.payload || profile?.payload;
      const hasAgentData = data.agent && (data.agent.name || data.agent.email || data.agent.phone);
      setHasAgent(hasAgentData);

      form.setFieldsValue({
        fullName: data.fullName,
        email: data.email,
        contactNumber: data.contactNumber,
        birthdate: data.birthdate ? dayjs(data.birthdate) : null,
        college: data.college,
        highSchool: data.highSchool,
        graduationYear: data.graduationYear,
        bio: data.bio,
        profileImageUrl: data.profileImageUrl,
        experienceYears: data.experienceYears,
        positions: data.positions ? data.positions.map((pos: any) => pos.abbreviation) : [],
        agent: data.agent || {},
      });
    }
  }, [athleteData, profile, form]);

  const handleBasicInfoSubmit = (values: any) => {
    console.log('Basic Info Submitted:', values);

    // Convert position abbreviations back to position objects
    const selectedPositions = values.positions
      ? values.positions.map((abbr: string) => availablePositions.find((pos) => pos.abbreviation === abbr)).filter(Boolean) // Remove any undefined values
      : [];

    const formData = {
      ...values,
      birthdate: values.birthdate ? values.birthdate.toISOString() : null,
      positions: selectedPositions,
      agent: hasAgent ? values.agent : undefined, // Only include agent data if hasAgent is true
    };

    updateProfile(
      {
        formData,
      },
      {
        onSuccess: () => {
          addAlert({
            type: 'success',
            message: 'Athlete profile updated successfully',
            duration: 3000,
          });
          setIsEditing(false);
          queryClient.invalidateQueries({ queryKey: ['profile', 'athlete'] });
        },
        onError: (error: any) => {
          addAlert({
            type: 'error',
            message: error?.response?.data?.message || 'Failed to update athlete profile',
            duration: 5000,
          });
        },
      }
    );
  };
  return (
    <div className={styles.container}>
      <div className={styles.contentContainer}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Basic Information Section */}
          <Card
            title="Basic Information"
            extra={
              <Button type="link" onClick={() => setIsEditing(!isEditing)} icon={isEditing ? <SaveOutlined /> : <UserOutlined />}>
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            }
          >
            <div className={formStyles.form}>
              <Form form={form} layout="vertical" onFinish={handleBasicInfoSubmit} disabled={!isEditing}>
                {/* Profile Image Section */}
                <div className={formStyles.row}>
                  <div className={`${styles.imageContainer} ${formStyles.field}`}>
                    <PhotoUpload
                      default={athleteData?.payload?.profileImageUrl || profile?.payload?.profileImageUrl}
                      name="profileImageUrl"
                      action={`${process.env.API_URL}/upload/cloudinary/file`}
                      isAvatar={true}
                      form={form}
                      aspectRatio={1}
                      placeholder="Upload your profile photo"
                      imgStyle={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                      }}
                    />
                  </div>
                </div>

                {/* Basic Info Fields */}
                <div className={formStyles.row}>
                  <Form.Item name="fullName" label="Full Name" rules={[{ required: true, message: 'Please enter your full name' }]} className={formStyles.field}>
                    <Input prefix={<UserOutlined />} placeholder="Enter your full name" />
                  </Form.Item>

                  <Form.Item
                    name="email"
                    label="Email Address"
                    rules={[
                      { required: true, message: 'Please enter your email' },
                      { type: 'email', message: 'Please enter a valid email' },
                    ]}
                    className={formStyles.field}
                  >
                    <Input prefix={<MailOutlined />} placeholder="Enter your email address" />
                  </Form.Item>
                </div>

                <div className={formStyles.row}>
                  <Form.Item name="contactNumber" label="Phone Number" rules={[{ required: true, message: 'Please enter your phone number' }]} className={formStyles.field}>
                    <Input prefix={<PhoneOutlined />} placeholder="Enter your phone number" />
                  </Form.Item>

                  <Form.Item name="birthdate" label="Birth Date" className={formStyles.field}>
                    <DatePicker prefix={<CalendarOutlined />} placeholder="Select your birth date" format="MM/DD/YYYY" style={{ width: '100%' }} />
                  </Form.Item>
                </div>

                <div className={formStyles.row}>
                  <Form.Item name="college" label="College" className={formStyles.field}>
                    <Input placeholder="Enter your college" />
                  </Form.Item>

                  <Form.Item name="highSchool" label="High School" className={formStyles.field}>
                    <Input placeholder="Enter your high school" />
                  </Form.Item>
                </div>

                <div className={formStyles.row}>
                  <Form.Item name="graduationYear" label="Graduation Year" className={formStyles.field}>
                    <Select placeholder="Select graduation year" allowClear>
                      {Array.from({ length: 20 }, (_, i) => {
                        const year = new Date().getFullYear() + 10 - i;
                        return (
                          <Option key={year} value={year}>
                            {year}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>

                  <Form.Item name="experienceYears" label="Years of Experience" className={formStyles.field}>
                    <Select placeholder="Select years of experience" allowClear>
                      {Array.from({ length: 20 }, (_, i) => (
                        <Option key={i} value={i}>
                          {i} {i === 1 ? 'year' : 'years'}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <Form.Item name="positions" label="Positions" tooltip="Select all positions you can play">
                  <Select
                    mode="multiple"
                    placeholder="Select your positions"
                    allowClear
                    showSearch
                    filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
                    options={availablePositions.map((position) => ({
                      value: position.abbreviation,
                      label: `${position.name} (${position.abbreviation})`,
                      key: position.abbreviation,
                    }))}
                  />
                </Form.Item>

                <Form.Item name="bio" label="Biography">
                  <Input.TextArea rows={4} placeholder="Tell us about yourself, your athletic journey, goals, and what makes you unique..." maxLength={500} showCount />
                </Form.Item>

                {/* Agent Information Section */}
                <Form.Item>
                  <Checkbox
                    checked={hasAgent}
                    onChange={(e) => {
                      setHasAgent(e.target.checked);
                      if (!e.target.checked) {
                        // Clear agent fields when unchecked
                        form.setFieldsValue({
                          agent: {
                            name: undefined,
                            email: undefined,
                            phone: undefined,
                          },
                        });
                      }
                    }}
                  >
                    Do you have an agent?
                  </Checkbox>
                </Form.Item>

                {hasAgent && (
                  <>
                    <div className={formStyles.row}>
                      <Form.Item name={['agent', 'name']} label="Agent Name" className={formStyles.field}>
                        <Input prefix={<UserOutlined />} placeholder="Enter your agent's name" />
                      </Form.Item>

                      <Form.Item
                        name={['agent', 'email']}
                        label="Agent Email"
                        rules={[{ type: 'email', message: 'Please enter a valid email address' }]}
                        className={formStyles.field}
                      >
                        <Input prefix={<MailOutlined />} placeholder="Enter your agent's email" />
                      </Form.Item>
                    </div>

                    <div className={formStyles.row}>
                      <Form.Item name={['agent', 'phone']} label="Agent Phone Number" className={formStyles.field}>
                        <Input prefix={<PhoneOutlined />} placeholder="Enter your agent's phone number" />
                      </Form.Item>
                    </div>
                  </>
                )}

                {isEditing && (
                  <Form.Item>
                    <Space>
                      <Button type="primary" htmlType="submit" loading={isUpdating} icon={<SaveOutlined />}>
                        Save Changes
                      </Button>
                      <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                    </Space>
                  </Form.Item>
                )}
              </Form>
            </div>
          </Card>
        </Space>
      </div>
    </div>
  );
};

export default BasicInfo;
