'use client';
import React, { useState } from 'react';
import styles from './ControlSearch.module.scss';
import { Button, Checkbox, Input, Select, Slider } from 'antd';
import useApiHook from '@/hooks/useApi';
import { useSearchStore } from '@/state/search';

const ControlSearch = () => {
  const { pageNumber, filter, modifyFilter } = useSearchStore((state) => state);
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    sport: '',
    positions: [],
    stateRegion: '',
    ageRange: [18, 30],
    verifiedOnly: false,
    openToTryouts: false,
  });

  const onChangeHandler = (key: string, value: any) => {
    setSearchParams((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = () => {
    // create an array of keys
    const keys = Object.keys(searchParams);
    // create an array of values
    const values = Object.values(searchParams);
    //create a string of key-value pairs seperated by ; and |
    const filterString = keys.map((key, index) => `${key};${values[index]}`).join('|');
    modifyFilter(filterString);
  };

  return (
    <div className={styles.container}>
      <h3>Search Teams</h3>

      <div className={styles.field}>
        <label>Keyword</label>
        <Input value={searchParams.keyword} onChange={(e) => onChangeHandler('keyword', e.target.value)} placeholder="Team name, coach, etc." />
      </div>

      <div className={styles.field}>
        <label>Sport / Program</label>
        <Select value={searchParams.sport} onChange={(e) => onChangeHandler('sport', e)} placeholder="Select sport">
          <Select.Option value="football">Football</Select.Option>
          <Select.Option value="basketball">Basketball</Select.Option>
          <Select.Option value="baseball">Baseball</Select.Option>
          <Select.Option value="soccer">Soccer</Select.Option>
        </Select>
      </div>

      <div className={styles.field}>
        <label>Positions Needed</label>
        <Select mode="multiple" value={searchParams.positions} onChange={(value) => onChangeHandler('positions', value)} placeholder="e.g., QB, WR, CB">
          <Select.Option value="QB">Quarterback</Select.Option>
          <Select.Option value="WR">Wide Receiver</Select.Option>
          <Select.Option value="CB">Cornerback</Select.Option>
          {/* Add more as needed */}
        </Select>
      </div>

      <div className={styles.field}>
        <label>State</label>
        <Select value={searchParams.stateRegion} onChange={(value) => onChangeHandler('stateRegion', value)} placeholder="e.g., Texas">
          <Select.Option value="TX">Texas</Select.Option>
          <Select.Option value="CA">California</Select.Option>
          <Select.Option value="FL">Florida</Select.Option>
          {/* Pull from US states list eventually */}
        </Select>
      </div>

      <div className={styles.field}>
        <label>Age Range</label>
        <Slider
          range
          min={16}
          max={35}
          value={searchParams.ageRange}
          onChange={(value) => {
            onChangeHandler('ageRange', value);
          }}
        />
      </div>

      <div className={styles.checkboxGroup}>
        <Checkbox checked={searchParams.verifiedOnly} onChange={(e) => onChangeHandler('verifiedOnly', e.target.checked)}>
          Only show verified organizations
        </Checkbox>
        <Checkbox checked={searchParams.openToTryouts} onChange={(e) => onChangeHandler('openToTryouts', e.target.checked)}>
          Currently recruiting
        </Checkbox>
      </div>
      <Button type="primary" onClick={handleSubmit} className={styles.searchButton}>
        Search
      </Button>
    </div>
  );
};

export default ControlSearch;
