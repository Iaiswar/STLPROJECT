import React, { useState, useEffect } from 'react';
import Nav from '../../HomeNav/nav';
import SkillMatrixTable from '../components/SkillMatrixTable';
import { fetchSkillMatrices, fetchOperations, fetchSections, fetchMonthlySkill } from '../api/api';
import { SkillMatrix, Operation, Section, MonthlySkill, Month, months } from '../api/types';

const SkillMatrixPage: React.FC = () => {
  const [skillMatrices, setSkillMatrices] = useState<SkillMatrix[]>([]);
  const [selectedMatrix, setSelectedMatrix] = useState<SkillMatrix | null>(null);
  const [employees, setEmployees] = useState<any[]>([]);
  const [operations, setOperations] = useState<Operation[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [monthlySkills, setMonthlySkills] = useState<MonthlySkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [matricesData, operationsData, sectionsData, monthlySkillsData] = await Promise.all([
          fetchSkillMatrices(),
          fetchOperations(),
          fetchSections(),
          fetchMonthlySkill()
        ]);

        // Extract unique employees from monthly skills
        const uniqueEmployees = monthlySkillsData.reduce((acc: any[], current) => {
          if (!acc.find(item => item.employee_code === current.employee_code)) {
            acc.push({
              employee_code: current.employee_code,
              full_name: current.full_name,
              designation: current.designation,
              date_of_join: current.date_of_join,
              department: current.department,
              section: sectionsData.find(s => s.name === current.section)?.id
            });
          }
          return acc;
        }, []);

        setSkillMatrices(matricesData);
        setEmployees(uniqueEmployees);
        setOperations(operationsData);
        setSections(sectionsData);
        setMonthlySkills(monthlySkillsData);

        if (matricesData.length > 0) {
          setSelectedMatrix(matricesData[0]);
        }

      } catch (err) {
        console.error('Error loading initial data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const handleMatrixChange = (matrix: SkillMatrix) => {
    setSelectedMatrix(matrix);
  };

  return (
    <>
      <Nav />
      <SkillMatrixTable
        skillMatrices={skillMatrices}
        selectedMatrix={selectedMatrix}
        employees={employees}
        operations={operations}
        sections={sections}
        monthlySkills={monthlySkills}
        months={months}
        isLoading={isLoading}
        error={error}
        onMatrixChange={handleMatrixChange}
      />
    </>
  );
};

export default SkillMatrixPage;