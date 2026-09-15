# SESSION 20 — Team Manager Application (Angular)

A responsive, interactive **Team Manager Application** built using **Angular 22** strictly adhering to the Session 20 curriculum requirements.

This project is a standalone, client-side Angular application designed to demonstrate state management, user interactions, reactive form bindings, and Angular built-in control flow without external backend or database dependencies.

---

## 🎯 1. Project Objective

The objective of Session 20 is to practice essential modern Angular capabilities:
- **Component State**: Managing application data reactively inside standalone Angular components.
- **User Interactions**: Handling user clicks, inputs, selections, and immediate UI reactivity.
- **Forms & Two-Way Binding**: Synchronizing form inputs with component properties via `[(ngModel)]`.
- **Dynamic UI**: Switching presentation modes (Card View vs List View) and managing active filter selections.
- **Angular Control Flow**: Utilizing modern control flow syntax (`@for`, `@if`, `@switch`) rather than legacy structural directives (`*ngFor`, `*ngIf`, `*ngSwitch`).

---

## 📁 2. Project Structure

```
session-20/
├── src/
│   ├── app/
│   │   ├── app.ts                  # Standalone root component logic & state
│   │   ├── app.html                # Template featuring @for, @if, @switch & [(ngModel)]
│   │   ├── app.css                 # Component scoped styling for cards, lists, & filters
│   │   ├── app.config.ts           # Application configuration
│   │   ├── app.spec.ts             # 14-test unit and DOM test suite
│   │   └── team-member.model.ts    # TypeScript types and TeamMember interface
│   ├── index.html                  # HTML entry point with Plus Jakarta Sans typography
│   ├── main.ts                     # Application bootstrap
│   └── styles.css                  # Global resets and CSS custom properties
├── angular.json                    # Angular CLI build & test configuration
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
└── README.md                       # Comprehensive documentation
```

---

## 🧠 3. Angular Concepts Used

### A. Component State
The application state is encapsulated cleanly in `src/app/app.ts`:
- `teamMembers: TeamMember[]`: Array of team members (preloaded with sample members: *Ahmed*, *Esraa*, *Mohamed*, *Sara*).
- `departments: FilterDepartment[]`: Array containing strictly `'All Departments'`, `'Development'`, `'Marketing'`, and `'Design'`.
- `selectedDepartment: FilterDepartment`: Current active filter category (defaults to `'All Departments'`).
- `currentView: ViewMode`: View presentation mode (`'card'` | `'list'`).
- `newMember`: Form state bound to inputs for capturing new member information.
- `validationError`: Inline error message displayed when required data is missing or invalid.
- `filteredMembers`: Derived getter filtering team members by selected department.
- `availableCount` & `unavailableCount`: Computed getters tracking real-time status counts.

### B. Two-Way Data Binding (`[(ngModel)]`)
Configured with `FormsModule` in `App`:
- `[(ngModel)]="newMember.name"`: Binds text input for member name.
- `[(ngModel)]="newMember.age"`: Binds numerical input for member age.
- `[(ngModel)]="newMember.department"`: Binds dropdown selection for department.
- `[(ngModel)]="newMember.available"`: Binds checkbox for initial availability status.

### C. Event Binding (`(click)`)
- `(click)="addMember()"`: Validates entered data, creates the member, and resets form inputs.
- `(click)="toggleAvailability(member)"`: Instantly flips availability between `Available` and `Unavailable`.
- `(click)="setDepartmentFilter(dept)"`: Activates the selected department filter.
- `(click)="setViewMode('card')"` & `(click)="setViewMode('list')"`: Switches display modes.

### D. Modern Angular Built-In Control Flow

#### 1. `@for` (Looping)
- **Department Filter Pills**: Loops through `departments` to render filter buttons.
  ```html
  @for (dept of departments; track dept) {
    <button class="filter-pill" [class.active]="selectedDepartment === dept" (click)="setDepartmentFilter(dept)">
      {{ dept }}
    </button>
  }
  ```
- **Form Department Options**: Loops through `formDepartments` to generate select options.
- **Team Member Cards / List Rows**: Loops through `filteredMembers` with `track member.id`.

#### 2. `@if` (Conditional Rendering)
- **Validation Messages**: Shows validation banner if `validationError` is present.
  ```html
  @if (validationError) {
    <div class="validation-alert">{{ validationError }}</div>
  }
  ```
- **Empty States**: Renders dedicated empty state templates if total team is empty or if no members match the current department filter.
- **Status Badges & Icons**: Dynamically renders `✔️ Available` or `❌ Unavailable` badges and toggle button text.

#### 3. `@switch` (Switching Views)
- Smoothly alternates between **Card View** and **List View**:
  ```html
  @switch (currentView) {
    @case ('card') {
      <div class="cards-grid">...</div>
    }
    @case ('list') {
      <div class="list-container">...</div>
    }
    @default {
      <p>Please select a valid view mode.</p>
    }
  }
  ```

---

## ✨ 4. Features Implemented

1. **Team Members Information**:
   - Each member contains: `Name`, `Age`, `Department` (*Development*, *Marketing*, or *Design*), and `Availability status` (*Available* / *Unavailable*).
2. **Display Team Members**:
   - Renders all member attributes with distinct styling for badges and departments.
3. **Add New Team Member**:
   - Interactive form with validation (name required, age must be integer between 16 and 100, department selection, availability checkbox).
   - Automatically resets form on successful addition.
4. **Department Filter**:
   - Supports: `All Departments`, `Development`, `Marketing`, `Design`.
   - Selecting a filter instantly filters visible members; "All Departments" shows all members.
5. **Display Modes**:
   - **Card View**: Responsive card grid with avatar initials, department badge, status badge, and large toggle button.
   - **List View**: Compact tabular list format adhering to the task specification (`Esraa - Development - ✔️`, `Ahmed - Marketing - ❌`).
6. **Toggle Availability**:
   - Inverts availability status immediately on click and updates global statistics and badge styling.

---

## 🎁 5. Bonus Features Implemented

- **Empty State when No Members Match Filter**: Displays a helpful prompt with a button to reset filter to "All Departments".
- **Empty State when All Members are Removed**: Friendly banner indicating the team list is empty.
- **Enhanced Card Styling**: Glassmorphic card surfaces with subtle hover elevation and modern typography.
- **Differentiated Availability Styling**:
  - `Available`: Emerald/green accents, soft green badge, and `✔️` indicator.
  - `Unavailable`: Rose/red accents, soft red badge, and `❌` indicator.
- **Form Validation Feedback**: Clear inline alert banner pointing out specific validation requirements when submitted with invalid inputs.
- **Header Stats Counter**: Live badges showing Total Members, Available count, and Unavailable count.

---

## 🚀 6. How to Run Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Installation & Execution
```bash
# 1. Navigate to session-20 directory
cd session-20

# 2. Install dependencies (if not already installed)
npm install

# 3. Start development server
npm start
# or: ng serve
```
Open your browser and navigate to `http://localhost:4200/`.

### Running Automated Tests
```bash
npm test -- --watch=false
```

### Production Build
```bash
npm run build
```
The compiled bundle will be output to `dist/session-20`.

---

## 🧪 7. Test Results

The suite in `src/app/app.spec.ts` verifies 14 test cases covering component logic and DOM interactions:

```text
 ✓  session-20  src/app/app.spec.ts (14 tests) 373ms

 Test Files  1 passed (1)
      Tests  14 passed (14)
```

1. Component initialization
2. Default state and preloaded members
3. Availability counts calculation
4. Department filtering (Development, Marketing, Design, All Departments)
5. Availability toggling logic
6. Adding a valid team member and form reset
7. Validation: Rejection of empty/missing name
8. Validation: Rejection of invalid/out-of-range age
9. View mode switching (Card View <-> List View)
10. Empty state logic when filter matches zero members
11. DOM: Member cards rendering and update upon filter click
12. DOM: Switching between Card and List view in the DOM via `@switch`
13. DOM: Real-time availability toggle in DOM on button click
14. DOM: Empty state display when team is empty
