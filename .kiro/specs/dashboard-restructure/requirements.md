# Dashboard Restructure - Requirements

## 1. Overview
Restructure the dashboard page from a simple "coming soon" placeholder to a full-featured three-section layout that occupies the full screen, displaying project summary, tasks, and an integrated AI assistant.

## 2. Goals
- Transform the dashboard from a placeholder to a functional workspace
- Provide users with immediate visibility into project metrics and status
- Integrate AI assistance directly into the dashboard workflow
- Create an intuitive navigation structure for the application

## 2. Goals
- Transform the dashboard from a placeholder to a functional workspace
- Provide users with immediate visibility into project metrics and status
- Integrate AI assistance directly into the dashboard workflow
- Create an intuitive navigation structure for the application

## 3. User Stories

### 1. As a user, I want to see a comprehensive dashboard layout
**Acceptance Criteria:**
- 1.1 The dashboard must occupy the full screen height and width
- 1.2 The layout must have three distinct sections: left sidebar, main content area, and right sidebar
- 1.3 The existing dark theme (black/zinc colors with gold accents) must be maintained
- 1.4 The layout must be responsive and adapt to different screen sizes

### 2. As a user, I want to see my project summary at a glance
**Acceptance Criteria:**
- 2.1 The main content area must display a "Project Summary" section at the top
- 2.2 Three metric cards must be displayed horizontally: "Estimated time to finish", "Estimated Budget", and "Confidence"
- 2.3 Each card must have a distinct color scheme (blue, dark gray/navy, and green respectively)
- 2.4 Each card must display an icon, title, and placeholder text
- 2.5 Cards must have rounded corners and proper spacing

### 3. As a user, I want to access uploaded documents quickly
**Acceptance Criteria:**
- 3.1 An "Uploaded documents" button/section must be prominently displayed below the metric cards
- 3.2 The button must use the blue accent color from the theme
- 3.3 Clicking the button must navigate to the documents page
- 3.4 The button must have an upload icon

### 4. As a user, I want to see my tasks and gap analysis
**Acceptance Criteria:**
- 4.1 A "Tasks" section must be displayed below the uploaded documents section
- 4.2 The section must show "No tasks created yet" when there are no tasks
- 4.3 A "Gap analysis" link must be visible in the tasks header
- 4.4 A "See all questions" button must be displayed at the bottom of the tasks section
- 4.5 The button must use the dark theme styling

### 5. As a user, I want to interact with the AI assistant from the dashboard
**Acceptance Criteria:**
- 5.1 The right sidebar must display the "Reqsy AI" assistant
- 5.2 The AI assistant must show suggested action buttons (Risks, Summarize progress, Blockers, Doc highlights, Project status, Next steps)
- 5.3 The AI assistant must have a message input field at the bottom
- 5.4 The AI assistant must maintain the existing chat functionality
- 5.5 A chat bubble icon/illustration must be displayed in the assistant area

### 6. As a user, I want to navigate between different sections
**Acceptance Criteria:**
- 6.1 The left sidebar must display navigation items: Dashboard, Upload Docs, Gap Analysis, Master Requirements, Forecast, Request for Proposal
- 6.2 The current page (Dashboard) must be visually highlighted
- 6.3 Navigation items must be clickable and route to their respective pages
- 6.4 A "PROJECTS" section with "See all" button must be displayed at the bottom of the sidebar

## 4. Technical Requirements

### Layout Structure
- Use CSS Grid or Flexbox for the three-column layout
- Left sidebar: ~240px fixed width
- Main content: flexible width (remaining space)
- Right sidebar: ~320px fixed width
- Full viewport height (100vh)

### Styling Requirements
- Maintain existing color scheme:
  - Background: radial gradient from #1b1b1b to #050505 to #000000
  - Text: zinc-100, zinc-300, zinc-400
  - Borders: zinc-800/70, zinc-700/70
  - Accent: amber-400 (gold)
- Use rounded corners (rounded-2xl, rounded-3xl, rounded-full)
- Apply shadow effects for depth
- Maintain backdrop blur effects on cards

### Component Integration
- Integrate existing AIAssistant component in the right sidebar
- Reuse existing navigation structure from SiteShell
- Maintain ErrorBoundary wrapper
- Use existing routing with Next.js router

## 5. Out of Scope
- Backend API integration for real project data (use placeholder data)
- Real-time task updates
- Advanced AI assistant features beyond existing functionality
- Mobile-specific optimizations (focus on desktop first)
- User authentication changes

## 6. Dependencies
- Existing AIAssistant component
- Existing navigation/routing structure
- Existing theme and styling system
- Next.js App Router
