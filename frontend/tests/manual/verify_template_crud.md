# Manual Test Plan: Template CRUD & Drafts

## 1. Autosave / Drafts
1. Navigate to **Workspaces > Discovery > Templates > New Template**.
2. Type "Draft Test Template" in the Name field.
3. Type "Testing persistence" in the Description.
4. Refresh the page (Cmd+R).
5. **Verify:** The Name and Description fields should still contain the text.
6. Click "Save Template".
7. Click "New Template" again.
8. **Verify:** The form should be empty (draft cleared).

## 2. Deletion Constraints
1. Create a template "Critical Template".
2. Assign it to a Space (requires backend setup or manual DB insertion).
3. Try to delete "Critical Template" from the list.
4. **Verify:** You should see an error message "Cannot delete template: It is used in Space X".

## 3. Validation
1. Clear the "Name" field in an existing template.
2. Click "Update".
3. **Verify:** "Name is required" error appears.
4. Enter a duplicate field name in Context items.
5. **Verify:** Validation error prevents saving.
