// import { createContext, useContext, useState, useMemo } from 'react';

// interface Skill {
//   skill: string;
//   skill_level: string;
//   start_date: string;
//   end_date: string;
//   status?: string;
//   notes?: string;
// }

// interface Employee {
//   card_no: string;
//   pay_code: string;
//   employee_id: number;
//   name: string;
//   joining_date: string;
//   department: string;
//   section: string;
//   skills?: Skill[];
// }

// interface Stats {
//   scheduled: number;
//   in_progress: number;
//   completed: number;
//   total: number;
// }

// interface SkillFilterContextType {
//   statusFilter: string;
//   dateFilter: string;
//   setStatusFilter: (filter: string) => void;
//   setDateFilter: (filter: string) => void;
//   stats: Stats;
//   setStats: (stats: Stats) => void;
//   allEmployees: Employee[];
//   setAllEmployees: (employees: Employee[]) => void;
//   filteredEmployees: Employee[];
// }

// const SkillFilterContext = createContext<SkillFilterContextType | undefined>(undefined);

// export const SkillFilterProvider = ({ children }: { children: React.ReactNode }) => {
//   const [statusFilter, setStatusFilter] = useState<string>('all');
//   const [dateFilter, setDateFilter] = useState<string>('all-time');
//   const [stats, setStats] = useState<Stats>({
//     scheduled: 0,
//     in_progress: 0,
//     completed: 0,
//     total: 0
//   });
//   const [allEmployees, setAllEmployees] = useState<Employee[]>([]);

//   const filteredEmployees = useMemo(() => {
//     return allEmployees.filter(employee => {
//       // Filter by status
//       if (statusFilter !== 'all') {
//         const hasMatchingStatus = employee.skills?.some(skill => 
//           skill.status?.toLowerCase() === statusFilter.toLowerCase()
//         );
//         if (!hasMatchingStatus) return false;
//       }

//       // Filter by date
//       if (dateFilter !== 'all-time') {
//         const today = new Date();
//         today.setHours(0, 0, 0, 0); // Normalize to start of day
        
//         const hasMatchingDate = employee.skills?.some(skill => {
//           if (!skill.start_date || !skill.end_date) return false;
          
//           const startDate = new Date(skill.start_date);
//           const endDate = new Date(skill.end_date);
          
//           startDate.setHours(0, 0, 0, 0);
//           endDate.setHours(0, 0, 0, 0);

//           switch(dateFilter) {
//             case 'today':
//               return startDate <= today && endDate >= today;
//             case 'this-week': {
//               const endOfWeek = new Date(today);
//               endOfWeek.setDate(today.getDate() + 6); // 6 days from today (Sunday to Saturday)
//               return startDate <= endOfWeek && endDate >= today;
//             }
//             case 'this-month': {
//               const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
//               return startDate <= endOfMonth && endDate >= today;
//             }
//             default:
//               return true;
//           }
//         });
//         if (!hasMatchingDate) return false;
//       }

//       return true;
//     });
//   }, [allEmployees, statusFilter, dateFilter]);

//   const value = {
//     statusFilter, 
//     dateFilter, 
//     setStatusFilter, 
//     setDateFilter,
//     stats,
//     setStats,
//     allEmployees,
//     setAllEmployees,
//     filteredEmployees
//   };

//   return (
//     <SkillFilterContext.Provider value={value}>
//       {children}
//     </SkillFilterContext.Provider>
//   );
// };

// export const useSkillFilter = (): SkillFilterContextType => {
//   const context = useContext(SkillFilterContext);
//   if (context === undefined) {
//     throw new Error('useSkillFilter must be used within a SkillFilterProvider');
//   }
//   return context;
// };
import { createContext, useContext, useState, useMemo } from 'react';

interface Skill {
  skill: string;
  skill_level: string;
  start_date: string;
  end_date: string;
  status?: string;          // Original status from DB (optional)
  current_status?: string;  // Dynamic status reflecting date; use this for filtering
  notes?: string;
}

interface Employee {
  card_no: string;
  pay_code: string;
  employee_id: number;
  name: string;
  joining_date: string;
  department: string;
  section: string;
  skills?: Skill[];
}

interface Stats {
  scheduled: number;
  in_progress: number;
  completed: number;
  total: number;
}

interface SkillFilterContextType {
  statusFilter: string;
  dateFilter: string;
  setStatusFilter: (filter: string) => void;
  setDateFilter: (filter: string) => void;
  stats: Stats;
  setStats: (stats: Stats) => void;
  allEmployees: Employee[];
  setAllEmployees: (employees: Employee[]) => void;
  filteredEmployees: Employee[];
}

const SkillFilterContext = createContext<SkillFilterContextType | undefined>(undefined);

export const SkillFilterProvider = ({ children }: { children: React.ReactNode }) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all-time');
  const [stats, setStats] = useState<Stats>({
    scheduled: 0,
    in_progress: 0,
    completed: 0,
    total: 0,
  });
  const [allEmployees, setAllEmployees] = useState<Employee[]>([]);

  const filteredEmployees = useMemo(() => {
    return allEmployees.filter(employee => {
      // Filter by status -- use current_status for dynamic status
      if (statusFilter !== 'all') {
        const hasMatchingStatus = employee.skills?.some(skill =>
          skill.current_status?.toLowerCase() === statusFilter.toLowerCase()
        );
        if (!hasMatchingStatus) return false;
      }

      // Filter by date range
      if (dateFilter !== 'all-time') {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize time to start of the day

        const hasMatchingDate = employee.skills?.some(skill => {
          if (!skill.start_date || !skill.end_date) return false;

          const startDate = new Date(skill.start_date);
          const endDate = new Date(skill.end_date);

          startDate.setHours(0, 0, 0, 0);
          endDate.setHours(0, 0, 0, 0);

          switch (dateFilter) {
            case 'today':
              return startDate <= today && endDate >= today;
            case 'this-week': {
              const endOfWeek = new Date(today);
              endOfWeek.setDate(today.getDate() + 6);
              return startDate <= endOfWeek && endDate >= today;
            }
            case 'this-month': {
              const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
              return startDate <= endOfMonth && endDate >= today;
            }
            default:
              return true;
          }
        });

        if (!hasMatchingDate) return false;
      }

      return true;
    });
  }, [allEmployees, statusFilter, dateFilter]);

  const value = {
    statusFilter,
    dateFilter,
    setStatusFilter,
    setDateFilter,
    stats,
    setStats,
    allEmployees,
    setAllEmployees,
    filteredEmployees,
  };

  return <SkillFilterContext.Provider value={value}>{children}</SkillFilterContext.Provider>;
};

export const useSkillFilter = (): SkillFilterContextType => {
  const context = useContext(SkillFilterContext);
  if (context === undefined) {
    throw new Error('useSkillFilter must be used within a SkillFilterProvider');
  }
  return context;
};
