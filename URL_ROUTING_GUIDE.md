# Content Management System - URL Routing Guide

## Overview

The content management system now supports URL-based navigation with query parameters for easy identification and routing within the same page. This allows users to bookmark specific views and share direct links to different sections.

## Base URL Structure

```
http://localhost:8080/coach/content?view={view}&courseId={courseId}&moduleId={moduleId}&lessonId={lessonId}&action={action}&sectionId={sectionId}
```

## URL Parameters

| Parameter | Description | Values |
|-----------|-------------|---------|
| `view` | Main view/tab to display | `overview`, `courses`, `bundles`, `create-course`, `edit-course`, `preview-course`, `content`, `modules`, `lessons`, `sections`, `analytics` |
| `courseId` | Selected course ID | UUID string |
| `moduleId` | Selected module ID | UUID string |
| `lessonId` | Selected lesson ID | UUID string |
| `sectionId` | Selected section ID | UUID string |
| `action` | Specific action to perform | `create-module`, `edit-module`, `create-lesson`, `edit-lesson`, `manage-sections`, `create-section`, `edit-section` |

## URL Examples

### 1. Content Management Overview
```
http://localhost:8080/coach/content?view=overview
```
- Shows the main content management dashboard
- Displays course statistics and recent courses

### 2. Courses List
```
http://localhost:8080/coach/content?view=courses
```
- Shows all courses in a list/grid view
- Allows searching and filtering courses

### 3. Create New Course
```
http://localhost:8080/coach/content?view=create-course
```
- Opens the course creation wizard
- Guides through course setup process

### 4. Edit Existing Course
```
http://localhost:8080/coach/content?view=edit-course&courseId=123e4567-e89b-12d3-a456-426614174000
```
- Opens course editor for specific course
- Allows editing course details, tags, pricing, etc.

### 5. Preview Course
```
http://localhost:8080/coach/content?view=preview-course&courseId=123e4567-e89b-12d3-a456-426614174000
```
- Shows course preview as students would see it
- Displays course content and structure

### 6. Manage Course Content (Modules)
```
http://localhost:8080/coach/content?view=content&courseId=123e4567-e89b-12d3-a456-426614174000
```
- Shows modules tab for the course
- Lists all modules in the course

### 7. View Modules Tab
```
http://localhost:8080/coach/content?view=modules&courseId=123e4567-e89b-12d3-a456-426614174000
```
- Direct access to modules tab
- Lists all modules in the course

### 8. Create New Module
```
http://localhost:8080/coach/content?view=modules&courseId=123e4567-e89b-12d3-a456-426614174000&action=create-module
```
- Opens module creation form
- Creates a new module within the course

### 9. Edit Module
```
http://localhost:8080/coach/content?view=modules&courseId=123e4567-e89b-12d3-a456-426614174000&moduleId=456e7890-e89b-12d3-a456-426614174000&action=edit-module
```
- Opens module editing form
- Allows editing module details

### 10. View Lessons in Module
```
http://localhost:8080/coach/content?view=lessons&courseId=123e4567-e89b-12d3-a456-426614174000&moduleId=456e7890-e89b-12d3-a456-426614174000
```
- Shows lessons tab for the specific module
- Lists all lessons within the module

### 11. Create New Lesson
```
http://localhost:8080/coach/content?view=lessons&courseId=123e4567-e89b-12d3-a456-426614174000&moduleId=456e7890-e89b-12d3-a456-426614174000&action=create-lesson
```
- Opens lesson creation form
- Creates a new lesson within the module

### 12. Edit Lesson
```
http://localhost:8080/coach/content?view=lessons&courseId=123e4567-e89b-12d3-a456-426614174000&moduleId=456e7890-e89b-12d3-a456-426614174000&lessonId=789e0123-e89b-12d3-a456-426614174000&action=edit-lesson
```
- Opens lesson editing form
- Allows editing lesson details

### 13. Manage Sections in Lesson
```
http://localhost:8080/coach/content?view=sections&courseId=123e4567-e89b-12d3-a456-426614174000&moduleId=456e7890-e89b-12d3-a456-426614174000&lessonId=789e0123-e89b-12d3-a456-426614174000&action=manage-sections
```
- Shows sections tab for the specific lesson
- Lists all content sections within the lesson

### 14. Create New Section
```
http://localhost:8080/coach/content?view=sections&courseId=123e4567-e89b-12d3-a456-426614174000&moduleId=456e7890-e89b-12d3-a456-426614174000&lessonId=789e0123-e89b-12d3-a456-426614174000&action=create-section
```
- Opens section creation form
- Creates a new content section within the lesson

### 15. Edit Section
```
http://localhost:8080/coach/content?view=sections&courseId=123e4567-e89b-12d3-a456-426614174000&moduleId=456e7890-e89b-12d3-a456-426614174000&lessonId=789e0123-e89b-12d3-a456-426614174000&sectionId=abc12345-e89b-12d3-a456-426614174000&action=edit-section
```
- Opens section editing form
- Allows editing section content and properties

### 16. View Analytics
```
http://localhost:8080/coach/content?view=analytics&courseId=123e4567-e89b-12d3-a456-426614174000
```
- Shows analytics dashboard for the course
- Displays content performance metrics

## Navigation Flow

### Course Level
1. **Overview** → **Courses** → **Create Course** / **Edit Course** / **Preview Course**
2. **Courses** → **Manage Content** (for specific course)

### Module Level
1. **Manage Content** → **Modules Tab** → **Create Module** / **Edit Module**
2. **Modules** → **View Lessons** (for specific module)

### Lesson Level
1. **View Lessons** → **Create Lesson** / **Edit Lesson**
2. **Lessons** → **Manage Sections** (for specific lesson)

### Section Level
1. **Manage Sections** → **Create Section** / **Edit Section**

## URL Patterns by Action

### Module Actions
- **View Modules**: `?view=modules&courseId={courseId}`
- **Create Module**: `?view=modules&courseId={courseId}&action=create-module`
- **Edit Module**: `?view=modules&courseId={courseId}&moduleId={moduleId}&action=edit-module`

### Lesson Actions
- **View Lessons**: `?view=lessons&courseId={courseId}&moduleId={moduleId}`
- **Create Lesson**: `?view=lessons&courseId={courseId}&moduleId={moduleId}&action=create-lesson`
- **Edit Lesson**: `?view=lessons&courseId={courseId}&moduleId={moduleId}&lessonId={lessonId}&action=edit-lesson`

### Section Actions
- **View Sections**: `?view=sections&courseId={courseId}&moduleId={moduleId}&lessonId={lessonId}&action=manage-sections`
- **Create Section**: `?view=sections&courseId={courseId}&moduleId={moduleId}&lessonId={lessonId}&action=create-section`
- **Edit Section**: `?view=sections&courseId={courseId}&moduleId={moduleId}&lessonId={lessonId}&sectionId={sectionId}&action=edit-section`

## Benefits

### 1. Bookmarkable URLs
- Users can bookmark any specific view
- Direct access to specific content management sections
- Share links with team members

### 2. Browser Navigation
- Back/Forward buttons work correctly
- Browser history is maintained
- Refresh page preserves current state

### 3. Deep Linking
- Direct links to specific courses, modules, lessons, or sections
- Easy sharing of specific content management views
- Integration with external systems

### 4. State Persistence
- URL reflects current application state
- No loss of context on page refresh
- Consistent user experience

## Implementation Details

### URL State Management
- Uses React Router's `useSearchParams` hook
- Automatic synchronization between URL and component state
- Clean URL parameter handling

### Navigation Functions
- `navigateToView()` - Navigate to different views
- `updateURL()` - Update URL parameters
- Automatic state restoration from URL

### Error Handling
- Graceful fallbacks for invalid URLs
- Default values for missing parameters
- Validation of course/module/lesson IDs

## Usage Examples

### For Users
1. **Bookmark frequently used views**
2. **Share direct links** to specific content
3. **Use browser navigation** (back/forward)
4. **Refresh page** without losing context

### For Developers
1. **Test specific flows** with direct URLs
2. **Debug navigation issues** with URL inspection
3. **Implement deep linking** in external systems
4. **Create automated tests** with specific URLs

## Best Practices

1. **Always use the navigation functions** instead of direct state changes
2. **Validate IDs** before using them in URLs
3. **Provide fallback values** for missing parameters
4. **Keep URLs clean** by removing unnecessary parameters
5. **Test URL persistence** across page refreshes

## Troubleshooting

### Common Issues
1. **URL not updating** - Check if navigation functions are being called
2. **State not syncing** - Verify useEffect dependencies
3. **Invalid IDs** - Validate course/module/lesson IDs exist
4. **Missing parameters** - Provide default values

### Debug Tips
1. **Check browser console** for navigation errors
2. **Inspect URL parameters** in browser address bar
3. **Verify component state** matches URL parameters
4. **Test with different browsers** for compatibility

## Quick Reference URLs

### Your Specific Course
```
Base: http://localhost:8080/coach/content?courseId=4c716fa1-df39-4957-b2b0-798ef7b1fda1

Modules: ?view=modules&courseId=4c716fa1-df39-4957-b2b0-798ef7b1fda1
Lessons: ?view=lessons&courseId=4c716fa1-df39-4957-b2b0-798ef7b1fda1&moduleId=52536111-333f-474a-8dc0-3bef113d935f
Sections: ?view=sections&courseId=4c716fa1-df39-4957-b2b0-798ef7b1fda1&moduleId=52536111-333f-474a-8dc0-3bef113d935f&lessonId={lessonId}
```

### Actions
```
Create Module: ?view=modules&courseId=4c716fa1-df39-4957-b2b0-798ef7b1fda1&action=create-module
Edit Module: ?view=modules&courseId=4c716fa1-df39-4957-b2b0-798ef7b1fda1&moduleId=52536111-333f-474a-8dc0-3bef113d935f&action=edit-module
Create Lesson: ?view=lessons&courseId=4c716fa1-df39-4957-b2b0-798ef7b1fda1&moduleId=52536111-333f-474a-8dc0-3bef113d935f&action=create-lesson
Create Section: ?view=sections&courseId=4c716fa1-df39-4957-b2b0-798ef7b1fda1&moduleId=52536111-333f-474a-8dc0-3bef113d935f&lessonId={lessonId}&action=create-section
``` 