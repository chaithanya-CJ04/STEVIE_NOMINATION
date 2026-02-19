# Upload Documents Feature

## Overview
Added an "Upload Documents" button to the dashboard that allows users to upload PDF and DOC files with validation and file management.

## Features

### Upload Button
- Located in the dashboard's left section (below "Coming soon" message)
- Styled with dark theme: zinc background with amber accents on hover
- Upload icon (cloud with arrow) for visual clarity
- Disabled state while uploading

### File Validation
- Accepted formats: PDF (.pdf), Word (.doc, .docx)
- Maximum file size: 10MB per file
- Multiple file upload supported
- Real-time validation with error toasts

### File Management
- Displays list of uploaded files with:
  - File icon
  - File name (truncated if too long)
  - File size in KB
  - Remove button (X icon)
- Scrollable list (max height 160px) for many files
- Remove individual files with one click

### User Feedback
- Success toast when files uploaded
- Error toasts for invalid file types or sizes
- Loading state during upload
- File count display

## Styling
- Matches existing dark theme (zinc/amber colors)
- Rounded corners (rounded-2xl for button, rounded-lg for file items)
- Hover effects with amber accent
- Focus states for accessibility
- Responsive design

## Accessibility
- Proper ARIA labels for screen readers
- Keyboard navigation support
- Focus indicators
- Hidden file input with accessible label

## Backend Integration (TODO)
The upload functionality is ready for backend integration:

```typescript
// In handleFileUpload function, uncomment:
const formData = new FormData();
validFiles.forEach(file => formData.append('files', file));
await fetch('/api/upload', { method: 'POST', body: formData });
```

Create a new API route at `frontend/app/api/upload/route.ts` to handle file uploads.

## Usage
1. Click "Upload Documents" button
2. Select one or more PDF/DOC files (max 10MB each)
3. Files appear in the list below the button
4. Click X icon to remove a file
5. Files are stored in component state (ready for backend submission)

## State Management
- `uploadedFiles`: Array of File objects
- `isUploading`: Boolean for loading state
- `fileInputRef`: Reference to hidden file input element
