import React from 'react';
import formStyles from '@/styles/Form.module.scss';
import { Form, FormInstance, Input, Select } from 'antd';
import useApiHook from '@/hooks/useApi';
import { ISupportGroup } from '@/types/ISupport';

interface SupportFormProps {
  form: FormInstance;
}

const SupportForm = ({ form }: SupportFormProps) => {
  const { data } = useApiHook({
    url: `/support/support_group`,
    key: 'support_groups',
    method: 'GET',
  }) as any;

  return (
    <Form form={form} layout="vertical">
      <Form.Item
        name="subject"
        label="Subject"
        rules={[
          {
            required: true,
            message: 'Please enter the subject',
          },
        ]}
      >
        <Input placeholder="Subject" />
      </Form.Item>
      <Form.Item
        name="category"
        label="Category"
        rules={[
          {
            required: true,
            message: 'Please select a category',
          },
        ]}
      >
        <Select
          placeholder="Select a category"
          className={formStyles.select}
          allowClear
          mode="multiple"
          options={data?.payload?.map((group: ISupportGroup) => ({
            label: group.name,
            value: group.name,
          }))}
        />
      </Form.Item>
      <Form.Item
        name="message"
        label="Message"
        rules={[
          {
            required: true,
            message: 'Please enter your message',
          },
        ]}
      >
        <Input.TextArea placeholder="Message" />
      </Form.Item>
    </Form>
  );
};

export default SupportForm;
