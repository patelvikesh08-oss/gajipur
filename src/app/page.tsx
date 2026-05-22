
"use client";

import { MainLayout } from "@/components/layout/main-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { GenderChart } from "@/components/dashboard/gender-chart";
import { StandardChart } from "@/components/dashboard/standard-chart";
import { AgeChart } from "@/components/dashboard/age-chart";
import { useStudentStore } from "@/lib/student-store";
import { Users, UserCheck, GraduationCap, Calendar } from "lucide-react";

export default function Dashboard() {
  const { students, isLoaded } = useStudentStore();

  if (!isLoaded) return null;

  const totalStudents = students.length;
  const maleCount = students.filter(s => s.gender === 'Male').length;
  const femaleCount = students.filter(s => s.gender === 'Female').length;
  const otherCount = students.filter(s => s.gender === 'Other').length;

  const genderData = [
    { name: "Male", value: maleCount },
    { name: "Female", value: femaleCount },
    { name: "Other", value: otherCount },
  ];

  const standardMap = students.reduce((acc, s) => {
    acc[s.academicStandard] = (acc[s.academicStandard] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const standardData = Object.entries(standardMap).map(([name, students]) => ({
    name,
    students,
  })).sort((a, b) => a.name.localeCompare(b.name));

  const ageMap = students.reduce((acc, s) => {
    const ageLabel = `${s.age} Yrs`;
    acc[ageLabel] = (acc[ageLabel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ageData = Object.entries(ageMap).map(([age, count]) => ({
    age,
    count,
  })).sort((a, b) => parseInt(a.age) - parseInt(b.age));

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Enrollment"
          value={totalStudents}
          description="Active students"
          icon={Users}
          trend={{ value: 4.5, isPositive: true }}
        />
        <StatCard
          title="Gender Balance"
          value={`${Math.round((femaleCount / totalStudents) * 100)}%`}
          description="Female participation"
          icon={UserCheck}
        />
        <StatCard
          title="Avg. Grade Load"
          value={Math.round(totalStudents / (standardData.length || 1))}
          description="Students per standard"
          icon={GraduationCap}
        />
        <StatCard
          title="Median Age"
          value={12}
          description="Years old"
          icon={Calendar}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <GenderChart data={genderData} />
        </div>
        <div className="lg:col-span-2">
          <StandardChart data={standardData} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AgeChart data={ageData} />
      </div>
    </MainLayout>
  );
}
