import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, InputNumber, Modal, Select, Popconfirm } from 'antd';
import useApiHook from '@/hooks/useApi';
import { IAthlete } from '@/types/IAthleteType';
import styles from './Measurements.module.scss';

const allowedMeasurements = [
  { key: 'height', label: 'Height', unit: 'inches' },
  { key: 'weight', label: 'Weight', unit: 'lbs' },
  { key: 'armLength', label: 'Arm Length', unit: 'inches' },
  { key: 'handSize', label: 'Hand Size', unit: 'inches' },
];

const Measurements = () => {
  const queryClient = useQueryClient();
  const profile = queryClient.getQueryData(['profile', 'athlete']) as any;
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const { mutate: updateProfile } = useApiHook({
    method: 'PUT',
    key: 'updateProfile',
    queriesToInvalidate: ['profile,athlete'],
    successMessage: 'Profile updated successfully',
  }) as any;

  React.useEffect(() => {
    if (profile?.payload) {
      form.setFieldsValue({
        ...profile?.payload,
      });
    }
  }, [profile, form]);

  const handleSubmit = async (values: IAthlete) => {
    await updateProfile({
      url: `/athlete/${profile?.payload?._id}`,
      formData: values,
    });
  };

  const handleSaveMeasurement = () => {
    if (!selectedMeasurement || inputValue === null) return;

    const updatedMeasurements = {
      ...(profile?.payload?.measurements || {}),
      [selectedMeasurement]: inputValue,
    };

    handleSubmit({
      ...profile?.payload,
      measurements: updatedMeasurements,
    });

    resetModal();
  };

  const handleDeleteMeasurement = (key: string) => {
    const updatedMeasurements = { ...(profile?.payload?.measurements || {}) };
    delete updatedMeasurements[key];

    handleSubmit({
      ...profile?.payload,
      measurements: updatedMeasurements,
    });
  };

  const openEditModal = (key: string, value: any) => {
    setSelectedMeasurement(key);
    setInputValue(Number(value));
    setIsEditing(true);
    setModalOpen(true);
  };

  const resetModal = () => {
    setModalOpen(false);
    setSelectedMeasurement(null);
    setInputValue(null);
    setIsEditing(false);
  };

  const renderMeasurements = () => {
    const measurements = profile?.payload?.measurements || {};
    const entries = Object.entries(measurements);

    if (entries.length === 0) {
      return <p>No measurements added yet.</p>;
    }

    return (
      <div className={styles.measurementsGrid}>
        {entries.map(([key, value]: any) => {
          const meta = allowedMeasurements.find((m) => m.key === key);
          const label = meta?.label || key;
          const unit = meta?.unit || '';

          return (
            <Card key={key} className={styles.measurementCard}>
              <div className={styles.label}>{label}</div>
              <div className={styles.value}>
                {value} {unit}
              </div>
              <div className={styles.actions}>
                <Button type="link" onClick={() => openEditModal(key, value)}>
                  Edit
                </Button>
                <Popconfirm title="Are you sure you want to delete this measurement?" onConfirm={() => handleDeleteMeasurement(key)} okText="Yes" cancelText="No">
                  <Button type="link" danger>
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            </Card>
          );
        })}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h2>Measurements</h2>

      {renderMeasurements()}

      <Button type="dashed" block onClick={() => setModalOpen(true)} className={styles.addButton}>
        + Add Measurement
      </Button>

      <Modal open={modalOpen} title={isEditing ? 'Edit Measurement' : 'Add Measurement'} onCancel={resetModal} onOk={handleSaveMeasurement} okText="Save">
        <Select placeholder="Select Measurement" style={{ width: '100%', marginBottom: '1rem' }} onChange={setSelectedMeasurement} value={selectedMeasurement} disabled={isEditing}>
          {allowedMeasurements
            .filter((m) => {
              // Filter out existing measurements unless we're editing that exact one
              const existing = profile?.payload?.measurements?.[m.key];
              return !existing || (isEditing && m.key === selectedMeasurement);
            })
            .map((m) => (
              <Select.Option key={m.key} value={m.key}>
                {m.label}
              </Select.Option>
            ))}
        </Select>

        {selectedMeasurement && (
          <InputNumber
            style={{ width: '100%' }}
            placeholder={`Enter value in ${allowedMeasurements.find((m) => m.key === selectedMeasurement)?.unit}`}
            value={inputValue}
            onChange={(val) => setInputValue(val)}
          />
        )}
      </Modal>
    </div>
  );
};

export default Measurements;
