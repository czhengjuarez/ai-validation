# Custom Actions Feature

## Overview

Users can now define **custom actions** for escalation paths instead of being limited to predefined options. This allows for flexible, organization-specific workflows.

## How It Works

### In the Editor
- The "Action" field is now a **text input** instead of a dropdown
- Users can type any action they want
- Helpful description shows common action examples

### In the Viewer
- Custom actions are displayed with appropriate styling
- Known actions get specific icons and colors
- Unknown actions get a default icon (checkmark) and purple color
- Action labels are automatically capitalized

## Supported Actions

### Pre-defined Actions (with custom icons/colors)

| Action | Label | Icon | Color | Use Case |
|--------|-------|------|-------|----------|
| `verify` | Verify Internally | ✓ Check | Blue | Internal team verification |
| `consult` | Consult Experts | ⚠ Alert Triangle | Orange | Expert consultation needed |
| `avoid` | Avoid AI Content | 🚫 Ban | Red | Don't use AI for this |
| `escalate` | Escalate | 🔴 Alert Circle | Red | Escalate to higher authority |
| `review` | Review | 👁 Eye | Cyan | Review by team |
| `approve` | Approve | ✓ User Check | Green | Approve for use |
| `flag` | Flag for Review | 🚩 Flag | Yellow | Flag for attention |

### Custom Actions

Any other action you type will:
- Display with a checkmark icon (✓)
- Show in purple color
- Have the first letter capitalized
- Work exactly like pre-defined actions

## Examples of Custom Actions

### Common Use Cases
- `legal-review` - Legal team review required
- `compliance-check` - Compliance verification
- `security-audit` - Security team audit
- `stakeholder-approval` - Stakeholder sign-off needed
- `peer-review` - Peer review process
- `quality-assurance` - QA testing required
- `risk-assessment` - Risk evaluation needed
- `executive-approval` - Executive approval required

### Industry-Specific Examples

**Healthcare:**
- `hipaa-review`
- `clinical-validation`
- `patient-safety-check`

**Finance:**
- `regulatory-compliance`
- `fraud-detection`
- `audit-trail`

**Legal:**
- `contract-review`
- `disclosure-check`
- `liability-assessment`

**Content Moderation:**
- `community-guidelines-check`
- `hate-speech-review`
- `age-restriction`

## Technical Implementation

### Type Definition
```typescript
export type EscalationPath = {
  id: string;
  name: string;
  description: string;
  action: string; // Any string allowed
  conditions: string[];
};
```

### Action Matching
- Actions are matched **case-insensitively**
- `Verify`, `verify`, `VERIFY` all map to the same icon/color
- Custom actions preserve their original casing in storage

### Display Logic
```typescript
// Icon selection
getActionIcon(action: string) {
  const lowerAction = action.toLowerCase();
  // Check known actions first
  // Fall back to default icon for custom actions
}

// Color selection
getActionColor(action: string) {
  const lowerAction = action.toLowerCase();
  // Check known actions first
  // Fall back to purple for custom actions
}

// Label formatting
getActionLabel(action: string) {
  // Check known actions for friendly labels
  // Capitalize first letter for custom actions
}
```

## Benefits

1. **Flexibility**: Organizations can define workflows that match their processes
2. **No Code Changes**: Add new actions without modifying the application
3. **Consistency**: Pre-defined actions maintain consistent styling
4. **Extensibility**: Easy to add more pre-defined actions in the future
5. **User-Friendly**: Simple text input with helpful examples

## Best Practices

### Naming Conventions
- Use lowercase with hyphens: `legal-review`
- Or single words: `escalate`, `approve`
- Keep it short and descriptive
- Be consistent across your organization

### Documentation
- Document your organization's custom actions
- Share action naming conventions with your team
- Create internal guidelines for when to use each action

### Common Actions
Consider standardizing on these common actions:
- **verify** - Internal verification needed
- **review** - General review process
- **approve** - Final approval
- **escalate** - Escalate to higher level
- **flag** - Flag for attention
- **consult** - External consultation

## Migration

### Existing Playbooks
- All existing playbooks continue to work
- Pre-defined actions (`verify`, `consult`, `avoid`) unchanged
- No data migration needed

### Templates
- Built-in templates use standard actions
- Users can create custom templates with their own actions

## Future Enhancements

Potential future improvements:
1. **Action Library**: Save and reuse custom actions across playbooks
2. **Action Suggestions**: Auto-suggest based on previously used actions
3. **Custom Icons**: Allow users to select icons for custom actions
4. **Action Categories**: Group related actions together
5. **Action Workflows**: Define multi-step workflows with action sequences
6. **Analytics**: Track which actions are most commonly used

## Testing Custom Actions

1. Create a new playbook
2. In an escalation path, type a custom action (e.g., `legal-review`)
3. Save the playbook
4. View the playbook - your custom action appears with purple badge
5. Edit the playbook - custom action is preserved
6. Try different actions to see the various icons and colors

## Support

For questions or suggestions about custom actions:
- Check the examples in this document
- Review the TESTING.md guide
- Open an issue on GitHub
