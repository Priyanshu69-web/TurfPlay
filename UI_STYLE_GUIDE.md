# TurfPlay UI/UX Style Guide

## 🎨 Color Palette

### Primary Colors
- **Green** (Primary CTA): `from-green-500 to-green-600`
- **Dark Background**: `bg-gradient-to-br from-black via-gray-900 to-black`
- **Light Backgrounds**: `bg-base-200`

### Status Badge Colors
```javascript
{
  confirmed: "bg-green-500/20 text-green-300 border border-green-500/30",
  pending: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30",
  cancelled: "bg-red-500/20 text-red-300 border border-red-500/30",
  completed: "bg-blue-500/20 text-blue-300 border border-blue-500/30",
  failed: "bg-red-500/20 text-red-300 border border-red-500/30",
  available: "bg-green-500/20 text-green-300 border border-green-500/30",
  booked: "bg-red-500/20 text-red-300 border border-red-500/30",
  blocked: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
  active: "bg-green-500/20 text-green-300 border border-green-500/30",
  inactive: "bg-gray-500/20 text-gray-300 border border-gray-500/30",
}
```

---

## 🎯 Component Patterns

### 1. Page Header
```jsx
<DashboardHeader 
  title="Page Title" 
  subtitle="Page description" 
/>
```

### 2. Status Badge
```jsx
<StatusBadge status="confirmed" size="md" />
// sizes: sm, md, lg
```

### 3. Data Table Structure
```jsx
<div className="card bg-base-200 shadow-xl overflow-x-auto">
  <table className="table w-full">
    <thead className="bg-base-300">
      {/* headers */}
    </thead>
    <tbody>
      {/* rows */}
    </tbody>
  </table>
</div>
```

### 4. Filter Section
```jsx
<div className="card bg-base-200 shadow-xl">
  <div className="card-body">
    <h2 className="card-title text-lg mb-4">Filters</h2>
    {/* filter inputs in grid */}
  </div>
</div>
```

### 5. Modal Dialog
```jsx
{selectedItem && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="card bg-base-100 shadow-2xl max-w-md w-full mx-4">
      <div className="card-body">
        {/* content */}
      </div>
    </div>
  </div>
)}
```

### 6. Pagination
```jsx
<div className="flex justify-center gap-2">
  <button className="btn btn-sm">Previous</button>
  <span className="flex items-center px-4">Page 1 of 5</span>
  <button className="btn btn-sm">Next</button>
</div>
```

---

## 📏 Spacing Guidelines

### Standard Padding
- Cards: `p-4`, `p-6`, `p-8`
- Sections: `gap-4`, `gap-6`, `gap-8`
- Inline: `px-4 py-3`

### Standard Margins
- Section spacing: `space-y-6`, `space-y-4`
- Grid gaps: `gap-4`, `gap-6`

---

## 🔤 Typography

### Headings
- Page Title: `text-4xl font-bold`
- Card Title: `card-title text-lg` or `text-2xl font-bold`
- Section Title: `text-lg font-semibold`
- Label: `text-sm font-semibold`

### Text
- Primary: `text-white` or `text-base-content`
- Secondary: `text-gray-300` or `opacity-75`
- Meta: `text-xs` or `text-sm`

---

## 🎬 Animation & Transitions

### Hover Effects
- Buttons: `hover:scale-102 transition`
- Cards: `hover:bg-base-300`
- Links: `hover:text-green-300 transition-colors`

### Loading States
```jsx
<span className="loading loading-spinner loading-sm"></span>
<span className="loading loading-spinner loading-lg"></span>
```

---

## 📱 Responsive Design

### Grid Layouts
```jsx
// Grid that adjusts by breakpoint
grid-cols-1 md:grid-cols-2 lg:grid-cols-4
```

### Mobile First
- Base: Mobile layout
- `md:` - Medium screens (768px+)
- `lg:` - Large screens (1024px+)

### Tables on Mobile
```jsx
// Use overflow-x-auto for horizontal scroll
<div className="overflow-x-auto">
  <table>...</table>
</div>
```

---

## 🎯 Form Inputs

### Standard Input
```jsx
<input 
  type="text" 
  className="input input-bordered w-full" 
  placeholder="Placeholder"
/>
```

### Select Dropdown
```jsx
<select className="select select-bordered w-full">
  <option>Option 1</option>
</select>
```

### Textarea
```jsx
<textarea 
  className="textarea textarea-bordered w-full" 
  rows="3"
  placeholder="Message"
></textarea>
```

### Date Input
```jsx
<input 
  type="date" 
  className="input input-bordered w-full"
/>
```

---

## 🔘 Buttons

### Primary Button
```jsx
<button className="btn btn-primary">Action</button>
```

### Secondary Button
```jsx
<button className="btn btn-ghost">Cancel</button>
```

### Danger Button
```jsx
<button className="btn btn-error">Delete</button>
```

### Success Button
```jsx
<button className="btn btn-success">Approve</button>
```

### Button States
```jsx
disabled={isLoading}
className="btn btn-primary"
// Shows opacity-50 automatically

{isLoading ? "Loading..." : "Submit"}
```

---

## 🎨 Admin Dashboard Colors

- **Primary Action**: Green
- **Danger Action**: Red (delete, block, cancel)
- **Info Action**: Blue (view, info)
- **Success Action**: Green (approve, accept)
- **Warning Action**: Yellow/Orange (caution)

---

## ✨ Best Practices

1. **Always use StatusBadge for statuses** - Don't create custom badges
2. **Use consistent card layouts** - Use `card` class with `bg-base-200`
3. **Maintain spacing** - Use `space-y-*` or `gap-*` utilities
4. **Responsive tables** - Always wrap in `overflow-x-auto`
5. **Loading states** - Show spinner + disable button
6. **Error handling** - Use toast notifications
7. **Confirmation dialogs** - Use modals for destructive actions
8. **Consistent styling** - Follow existing components as reference

---

## 📸 Example: Complete Admin Page

```jsx
import DashboardHeader from "../../../components/Dashboard/DashboardHeader";
import StatusBadge from "../../../components/Dashboard/StatusBadge";

export default function ManageFeature() {
  return (
    <div className="space-y-6">
      <DashboardHeader 
        title="Manage Feature" 
        subtitle="Description" 
      />

      {/* Filters */}
      <div className="card bg-base-200 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-lg mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input className="input input-bordered" />
            <select className="select select-bordered" />
            <button className="btn btn-ghost">Reset</button>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="card bg-base-200 shadow-xl overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-base-300">
            <tr><th>Column 1</th><th>Column 2</th></tr>
          </thead>
          <tbody>
            <tr className="hover:bg-base-300">
              <td>Data</td>
              <td><StatusBadge status="confirmed" size="sm" /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-2">
        <button className="btn btn-sm">Previous</button>
        <span className="flex items-center px-4">Page 1 of 5</span>
        <button className="btn btn-sm">Next</button>
      </div>
    </div>
  );
}
```

---

**Remember**: Consistency is key! Always follow these patterns across the application.
