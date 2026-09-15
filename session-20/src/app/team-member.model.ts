/**
 * Team Member Model Definition
 * Strictly contains: Name, Age, Department, and Availability status per Session 20 specification.
 */

export type Department = 'Development' | 'Marketing' | 'Design';
export type FilterDepartment = 'All Departments' | Department;
export type ViewMode = 'card' | 'list';

export interface TeamMember {
  id: number;
  name: string;
  age: number;
  department: Department;
  available: boolean;
}
