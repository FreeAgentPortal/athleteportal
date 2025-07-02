import Error from '@/components/error/Error.component';
import Loader from '@/components/loader/Loader.component';
import Container from '@/layout/container/Container.layout';
import { useUser } from '@/state/auth';
import { useWarnIfUnsavedChanges } from '@/utils/useWarnIfUnsavedChanges';
import { Form } from 'antd';
import React, { useEffect, useState } from 'react';

import SettingsForm from './components/settingsForm/SettingsForm.component';
import styles from './Settings.module.scss';

const SettingsView = () => {
  const { data: loggedInData, error, isLoading } = useUser();
  // const { mutate: updateUser, isLoading: userUpdateIsLoading } =
  //   useUpdateUser();
  const [form] = Form.useForm();
  const [unsaved, setUnsaved] = useState(false);
  useWarnIfUnsavedChanges(unsaved, () => {
    return confirm('Warning! You have unsaved changes.');
  });

  const onFinish = (values: any) => {
    // updateUser(values);
    setUnsaved(false);
  };

  useEffect(() => {
    form.setFieldsValue({});
  }, []);

  return (
    <div className={styles.container}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        onFieldsChange={() => {
          setUnsaved(true);
        }}
      >
        <Container title="Settings">{isLoading ? <Loader /> : <SettingsForm />}</Container>
        {/* <SaveButton
        isLoading={userUpdateIsLoading}
        /> */}
      </Form>
    </div>
  );
};

export default SettingsView;
