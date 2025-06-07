"use client";
import React from "react";
import styles from "./MinistryAttendance.module.scss";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/state/auth";
import useApiHook from "@/state/useApi";
import MinistryType from "@/types/Ministry";
import { Select } from "antd";

const MinistryAttendance = () => {
  // set start date to today's date and end date to 30 days prior to today's date
  const [startDate, setStartDate] = React.useState(new Date().toISOString());
  const [endDate, setEndDate] = React.useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString());
  const { data: loggedInData } = useUser();
  const { data: selectedProfile } = useApiHook({
    url: `/ministry/${loggedInData?.user?.ministry?._id}`,
    key: "selectedProfile",
    enabled: !!loggedInData?.user?.ministry?._id,
    method: "GET",
  }) as any;
  const [ministryId, setMinistryId] = React.useState(selectedProfile?.ministry?._id);
  const [selectedMinistry, setSelectedMinistry] = React.useState(selectedProfile?.ministry);
  const { data: attendanceData } = useApiHook({
    url: `/ministry/attendance/data`,
    key: ["attendanceData", `${ministryId}`],
    enabled: !!selectedProfile?.ministry?._id,
    // set to 1 hour cache time and 1 hour stale time
    staleTime: 1000 * 60 * 60,
    method: "GET",
    filter: `ministry;${ministryId}|date;{"$lte":"${startDate}","$gte":"${endDate}"}`,
  }) as any;

  const { data: ministries } = useApiHook({
    url: `/ministry/${loggedInData?.user?._id}/subministries`,
    key: ["ministries", `${loggedInData?.user?._id}`],
    enabled: !!loggedInData?.user?._id,
    method: "GET",
    filter: `user;${loggedInData?.user?._id}`,
  }) as any;

  React.useEffect(() => {
    if (!ministryId) {
      setMinistryId(selectedProfile?.ministry?._id);
    }
  }, [selectedProfile]);
  console.log("attendanceData", attendanceData);
  const transformedData =
    attendanceData?.payload?.map((entry: any) => ({
      date: entry.date,
      ...entry.checkIns,
    })) || [];

  const allLocationTypes: string[] = Array.from(
    new Set(attendanceData?.payload?.flatMap((entry: any) => Object.keys(entry.checkIns || {})))
  );

  return (
    <div className={styles.container}>
      <div className={styles.topContainer}>
        <p>
          <strong>{selectedProfile?.ministry?.name}&apos;s</strong> attendance records between{" "}
          {new Date(endDate).toLocaleDateString()} - {new Date(startDate).toLocaleDateString()}
        </p>

        {/* dropdown container that will hold all of the ministries belonging to the user */}
        <div className={styles.dropdownContainer}>
          {ministryId && ministries?.payload && (
            <Select
              className={styles.dropdown}
              onChange={(value) => setMinistryId(value)}
              options={ministries.payload.map((ministry: MinistryType) => ({
                label: ministry.name,
                value: ministry._id,
              }))}
              value={ministryId}
            />
          )}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          {allLocationTypes.map((location, index) => (
            <Line
              key={index}
              type="monotone"
              dataKey={location}
              stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
              strokeWidth={2}
              dot={{ r: 3 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MinistryAttendance;
