// src/types/machineTypes.ts
export interface Machine {
  id: number;
  name: string;
  image: string;
  level: number;
  process: string | null;
  created_at: string;
  updated_at: string;
}

export interface OperatorMaster {
  id: number;
  name: string;
  // Add other operator properties as needed
}

export interface MachineAllocation {
  id: number;
  machine: number;
  machine_name: string;
  employee: number;
  employee_name: string;
  allocated_at: string;
  approval_status: 'pending' | 'approved';
}

export const LEVEL_CHOICES = [
  { value: 1, label: 'Level 1' },
  { value: 2, label: 'Level 2' },
  { value: 3, label: 'Level 3' },
  { value: 4, label: 'Level 4' },
];

export const APPROVAL_STATUS_CHOICES = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
];