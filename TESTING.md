# Testing Guide

## Issue Fixed

**Problem**: The "Create Playbook" button wasn't saving playbooks because the backend API wasn't deployed yet.

**Solution**: Implemented localStorage fallback so the app works immediately without needing to deploy the Cloudflare Worker.

## How It Works Now

The storage service now has **automatic fallback**:

1. **First tries**: Cloudflare R2 API (if deployed)
2. **Falls back to**: Browser localStorage (if API unavailable)
3. **User sees**: Success notification either way

## Testing the Create Playbook Feature

### Step 1: Navigate to Create Playbook
1. Open the app at `http://localhost:3001`
2. Click the "Create New Playbook" button on the homepage

### Step 2: Fill in Playbook Details
1. **Title**: Enter a title (e.g., "My Custom Validation Workflow")
2. **Description**: Enter a description (e.g., "Custom workflow for my team")

### Step 3: Configure Escalation Paths
The form comes with 3 default paths. You can:
- Edit the existing paths
- Add new paths with the "Add Escalation Path" button
- Remove paths (if more than 1 exists)

For each path:
- **Path Name**: e.g., "Legal Review"
- **Description**: e.g., "Content requiring legal approval"
- **Action**: Type any custom action! Common examples:
  - `verify` - Verify Internally
  - `consult` - Consult External Experts
  - `avoid` - Avoid AI Content
  - `escalate` - Escalate to higher authority
  - `review` - Review by team
  - `approve` - Approve for use
  - `flag` - Flag for review
  - Or any custom action like `legal-review`, `compliance-check`, etc.
- **Conditions**: Add conditions with the "Add Condition" button

### Step 4: Save the Playbook
1. Click the "Create Playbook" button at the bottom
2. You should see a **green success notification**: "Playbook created successfully!"
3. You'll be automatically redirected to view your new playbook

### Step 5: Verify It Saved
1. Click "Back to Playbooks" or navigate to the homepage
2. Your custom playbook should appear in the list alongside the templates
3. The playbook is saved in **localStorage** (browser storage)

### Step 6: Test Print/Download
1. View your playbook
2. Click the **Print** button to open the print dialog
3. Click the **Download JSON** button to download the playbook as a file

## Where Data is Stored

### Current Setup (No Backend)
- **Location**: Browser localStorage
- **Key**: `ai-validation-playbooks`
- **Persistence**: Data stays until you clear browser data
- **Limitation**: Only available on this browser/device

### With Backend Deployed
- **Location**: Cloudflare R2 storage
- **Persistence**: Permanent, accessible from any device
- **Sharing**: Can share playbooks across team

## Viewing Stored Data

### Check localStorage in Browser DevTools
1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage** → `http://localhost:3001`
4. Look for key: `ai-validation-playbooks`
5. You'll see your playbooks in JSON format

### Clear localStorage (if needed)
```javascript
// In browser console
localStorage.removeItem('ai-validation-playbooks');
```

## Expected Behavior

### ✅ Should Work
- Creating new playbooks
- Viewing saved playbooks
- Editing playbook details
- Printing playbooks
- Downloading playbooks as JSON
- Playbooks persist across page refreshes

### ⚠️ Limitations (Without Backend)
- Playbooks only stored in current browser
- Can't share playbooks with others
- Data lost if browser cache is cleared
- No sync across devices

## Console Messages

You'll see these messages in the browser console (this is normal):

```
API not available, using localStorage fallback
```

This means the app is working correctly with localStorage since the backend isn't deployed yet.

## Next Steps

### To Deploy Backend (Optional)
Follow the instructions in [SETUP.md](./SETUP.md) to:
1. Deploy the Cloudflare Worker
2. Create R2 bucket
3. Update `VITE_API_URL` environment variable

Once deployed, the app will automatically use R2 storage instead of localStorage.

## Troubleshooting

### Playbook doesn't save
- Check browser console for errors
- Verify you filled in all required fields (title, description)
- Make sure browser allows localStorage

### Can't see saved playbooks
- Check if localStorage is enabled in your browser
- Look in DevTools → Application → Local Storage
- Try refreshing the page

### Success notification doesn't appear
- Check if Mantine notifications are properly configured
- Look for errors in browser console

## Testing Edit Functionality

### Step 1: Create a Playbook First
Follow the "Testing the Create Playbook Feature" steps above to create a playbook.

### Step 2: Edit the Playbook
1. From the playbook view, click the **"Edit Playbook"** button
2. The editor should load with all your existing data pre-filled
3. Make changes (e.g., update title, add/remove paths)
4. Click "Update Playbook" button
5. You should see: "Playbook updated successfully!"
6. You'll be redirected back to the playbook view with your changes

### Step 3: Verify Changes Persisted
1. Navigate back to homepage
2. Click on your edited playbook
3. Verify all changes are saved

### Important Notes
- **Templates cannot be edited**: The "Default AI Validation" and "Content Moderation" templates don't show an Edit button
- **Only user-created playbooks** can be edited
- **Edit preserves creation date** but updates the "updatedAt" timestamp

## Testing Checklist

### Create Functionality
- [ ] Create a new playbook with custom title/description
- [ ] Add/remove escalation paths
- [ ] Add/remove conditions
- [ ] Add custom actions
- [ ] Save the playbook successfully
- [ ] See success notification
- [ ] Redirected to playbook view
- [ ] Playbook appears on homepage

### Read Functionality
- [ ] View playbook details from homepage
- [ ] See all escalation paths
- [ ] Interactive decision tree works
- [ ] Custom actions display correctly
- [ ] Templates load properly
- [ ] User-created playbooks load properly

### Update (Edit) Functionality
- [ ] Click "Edit Playbook" on a user-created playbook
- [ ] Editor loads with existing data
- [ ] Make changes to title/description
- [ ] Add/remove escalation paths
- [ ] Update conditions
- [ ] Change actions
- [ ] Update playbook successfully
- [ ] See "updated successfully" notification
- [ ] Changes persist after refresh

### Delete Functionality
- [ ] Delete button appears on user-created playbooks only
- [ ] Click delete button shows confirmation dialog
- [ ] Cancel confirmation keeps playbook
- [ ] Confirm deletion removes playbook
- [ ] See "deleted successfully" notification
- [ ] Redirected to homepage
- [ ] Playbook no longer appears in list
- [ ] Delete from homepage card works
- [ ] Delete from playbook viewer works

### View/Export Functionality
- [ ] Print button works
- [ ] Download JSON button works
- [ ] Playbook persists after page refresh
- [ ] Can view playbook details again

### Template Restrictions
- [ ] Templates (default, content-moderation) don't show Edit button
- [ ] Templates don't show Delete button
- [ ] Templates can be printed
- [ ] Templates can be downloaded
- [ ] Templates cannot be modified

### HomePage Actions
- [ ] Edit icon appears on user playbooks only
- [ ] Delete icon appears on user playbooks only
- [ ] Edit icon navigates to editor
- [ ] Delete icon shows confirmation
- [ ] Actions don't appear on templates

All items should be checked! ✓
