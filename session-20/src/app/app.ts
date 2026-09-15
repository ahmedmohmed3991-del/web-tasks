import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TeamMember, Department, FilterDepartment, ViewMode } from './team-member.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // 1. Team Members State (Pre-populated with task-specified examples)
  teamMembers: TeamMember[] = [
    { id: 1, name: 'Ahmed', age: 28, department: 'Development', available: true },
    { id: 2, name: 'Esraa', age: 26, department: 'Development', available: true },
    { id: 3, name: 'Mohamed', age: 32, department: 'Marketing', available: false },
    { id: 4, name: 'Sara', age: 24, department: 'Design', available: true }
  ];

  // 2. Departments Filter Options (Strictly: All Departments, Development, Marketing, Design)
  departments: FilterDepartment[] = [
    'All Departments',
    'Development',
    'Marketing',
    'Design'
  ];

  // 3. Departments available for the Add Form
  formDepartments: Department[] = ['Development', 'Marketing', 'Design'];

  // 4. Selected Department Filter State
  selectedDepartment: FilterDepartment = 'All Departments';

  // 5. Current View Mode State ('card' | 'list')
  currentView: ViewMode = 'card';

  // 6. Form Data State (bound with [(ngModel)])
  newMember: {
    name: string;
    age: number | null;
    department: Department;
    available: boolean;
  } = {
    name: '',
    age: null,
    department: 'Development',
    available: true
  };

  // 7. Form Validation Error State
  validationError: string = '';

  // Getter: Filtered Members based on selectedDepartment
  get filteredMembers(): TeamMember[] {
    if (this.selectedDepartment === 'All Departments') {
      return this.teamMembers;
    }
    return this.teamMembers.filter(
      (member) => member.department === this.selectedDepartment
    );
  }

  // Getter: Available count
  get availableCount(): number {
    return this.teamMembers.filter((m) => m.available).length;
  }

  // Getter: Unavailable count
  get unavailableCount(): number {
    return this.teamMembers.filter((m) => !m.available).length;
  }

  // Action: Add New Team Member
  addMember(): void {
    const trimmedName = this.newMember.name?.trim();
    const ageValue = Number(this.newMember.age);

    // Validation: Name required
    if (!trimmedName) {
      this.validationError = 'Member name is required.';
      return;
    }

    if (trimmedName.length < 2) {
      this.validationError = 'Member name must be at least 2 characters long.';
      return;
    }

    // Validation: Age required and must be a valid positive number
    if (
      this.newMember.age === null ||
      this.newMember.age === undefined ||
      isNaN(ageValue) ||
      ageValue <= 0 ||
      !Number.isInteger(ageValue)
    ) {
      this.validationError = 'Please enter a valid whole number for age.';
      return;
    }

    if (ageValue < 16 || ageValue > 100) {
      this.validationError = 'Member age must be between 16 and 100.';
      return;
    }

    // Validation: Department valid
    if (!this.formDepartments.includes(this.newMember.department)) {
      this.validationError = 'Please select a valid department.';
      return;
    }

    // Create and add new member
    const nextId =
      this.teamMembers.length > 0
        ? Math.max(...this.teamMembers.map((m) => m.id)) + 1
        : 1;

    const createdMember: TeamMember = {
      id: nextId,
      name: trimmedName,
      age: ageValue,
      department: this.newMember.department,
      available: Boolean(this.newMember.available)
    };

    this.teamMembers.push(createdMember);

    // Reset Form
    this.clearForm();
    this.validationError = '';
  }

  // Action: Clear Form
  clearForm(): void {
    this.newMember = {
      name: '',
      age: null,
      department: 'Development',
      available: true
    };
    this.validationError = '';
  }

  // Action: Toggle Member Availability Status
  toggleAvailability(member: TeamMember): void {
    member.available = !member.available;
  }

  // Action: Set Department Filter
  setDepartmentFilter(dept: FilterDepartment): void {
    this.selectedDepartment = dept;
  }

  // Action: Set View Mode
  setViewMode(mode: ViewMode): void {
    this.currentView = mode;
  }

  // Action: Remove Member (bonus convenience)
  removeMember(id: number): void {
    this.teamMembers = this.teamMembers.filter((m) => m.id !== id);
  }
}
