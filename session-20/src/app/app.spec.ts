import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { App } from './app';

describe('App (Session 20 Team Manager)', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App, FormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1. should create the application component', () => {
    expect(component).toBeTruthy();
  });

  it('2. should initialize with default team members and departments', () => {
    expect(component.teamMembers.length).toBe(4);
    expect(component.departments).toEqual([
      'All Departments',
      'Development',
      'Marketing',
      'Design'
    ]);
    expect(component.selectedDepartment).toBe('All Departments');
    expect(component.currentView).toBe('card');
  });

  it('3. should calculate available and unavailable counts accurately', () => {
    // Initial: 3 available (Ahmed, Esraa, Sara), 1 unavailable (Mohamed)
    expect(component.availableCount).toBe(3);
    expect(component.unavailableCount).toBe(1);
  });

  it('4. should filter members correctly by department', () => {
    component.setDepartmentFilter('Development');
    expect(component.filteredMembers.length).toBe(2);
    expect(component.filteredMembers.every((m) => m.department === 'Development')).toBe(true);

    component.setDepartmentFilter('Marketing');
    expect(component.filteredMembers.length).toBe(1);
    expect(component.filteredMembers[0].name).toBe('Mohamed');

    component.setDepartmentFilter('Design');
    expect(component.filteredMembers.length).toBe(1);
    expect(component.filteredMembers[0].name).toBe('Sara');

    component.setDepartmentFilter('All Departments');
    expect(component.filteredMembers.length).toBe(4);
  });

  it('5. should toggle a member availability status immediately', () => {
    const ahmed = component.teamMembers.find((m) => m.name === 'Ahmed')!;
    expect(ahmed.available).toBe(true);

    // Toggle to unavailable
    component.toggleAvailability(ahmed);
    expect(ahmed.available).toBe(false);
    expect(component.availableCount).toBe(2);

    // Toggle back to available
    component.toggleAvailability(ahmed);
    expect(ahmed.available).toBe(true);
    expect(component.availableCount).toBe(3);
  });

  it('6. should successfully add a valid team member and reset form fields', () => {
    component.newMember = {
      name: 'Nour',
      age: 27,
      department: 'Development',
      available: true
    };

    component.addMember();

    expect(component.teamMembers.length).toBe(5);
    const added = component.teamMembers.find((m) => m.name === 'Nour');
    expect(added).toBeDefined();
    expect(added?.age).toBe(27);
    expect(added?.department).toBe('Development');
    expect(added?.available).toBe(true);

    // Verify form was reset
    expect(component.newMember.name).toBe('');
    expect(component.newMember.age).toBeNull();
    expect(component.validationError).toBe('');
  });

  it('7. should reject adding member with empty or missing name', () => {
    component.newMember = {
      name: '   ',
      age: 30,
      department: 'Design',
      available: true
    };

    component.addMember();

    expect(component.teamMembers.length).toBe(4);
    expect(component.validationError).toBe('Member name is required.');
  });

  it('8. should reject adding member with invalid or out-of-range age', () => {
    // Missing age
    component.newMember = {
      name: 'Tamer',
      age: null,
      department: 'Marketing',
      available: false
    };
    component.addMember();
    expect(component.teamMembers.length).toBe(4);
    expect(component.validationError).toContain('valid whole number');

    // Negative age
    component.newMember.age = -5;
    component.addMember();
    expect(component.validationError).toContain('valid whole number');

    // Out of range (< 16)
    component.newMember.age = 12;
    component.addMember();
    expect(component.validationError).toContain('between 16 and 100');
  });

  it('9. should switch view modes between card and list', () => {
    expect(component.currentView).toBe('card');

    component.setViewMode('list');
    expect(component.currentView).toBe('list');

    component.setViewMode('card');
    expect(component.currentView).toBe('card');
  });

  it('10. should handle empty filter state when no members match', () => {
    // Remove all marketing members
    component.teamMembers = component.teamMembers.filter((m) => m.department !== 'Marketing');
    component.setDepartmentFilter('Marketing');

    expect(component.filteredMembers.length).toBe(0);
    expect(component.teamMembers.length).toBe(3);
  });

  it('11. should render member cards in DOM and update when filter is clicked', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    let cards = compiled.querySelectorAll('.member-card');
    expect(cards.length).toBe(4);

    // Click Development filter button
    const devFilterBtn = compiled.querySelector('#filter-development') as HTMLButtonElement;
    expect(devFilterBtn).toBeTruthy();
    devFilterBtn.click();
    fixture.detectChanges();

    cards = compiled.querySelectorAll('.member-card');
    expect(cards.length).toBe(2);
  });

  it('12. should switch between card and list view in DOM using @switch', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#cardViewContainer')).toBeTruthy();
    expect(compiled.querySelector('#listViewContainer')).toBeNull();

    // Click List View button
    const listBtn = compiled.querySelector('#viewListBtn') as HTMLButtonElement;
    listBtn.click();
    fixture.detectChanges();

    expect(compiled.querySelector('#cardViewContainer')).toBeNull();
    expect(compiled.querySelector('#listViewContainer')).toBeTruthy();
    const rows = compiled.querySelectorAll('.list-item-row');
    expect(rows.length).toBe(4);
  });

  it('13. should toggle availability in DOM on button click', () => {
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const toggleBtn = compiled.querySelector('#toggle-btn-1') as HTMLButtonElement;
    expect(toggleBtn).toBeTruthy();
    expect(toggleBtn.textContent).toContain('Mark Unavailable');

    // Click toggle button
    toggleBtn.click();
    fixture.detectChanges();

    expect(toggleBtn.textContent).toContain('Mark Available');
    const card = compiled.querySelector('#member-card-1');
    expect(card?.classList.contains('status-unavailable')).toBe(true);
  });

  it('14. should display empty state in DOM when filter matches zero members', () => {
    component.teamMembers = [];
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#emptyTotalState')).toBeTruthy();
  });
});
