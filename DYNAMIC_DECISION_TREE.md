# Dynamic Decision Tree Feature

## Overview

The Decision Tree component now **dynamically generates** questions based on each playbook's escalation paths and conditions. This means every custom playbook automatically gets its own interactive validation guide!

## How It Works

### Before (Hardcoded)
- Decision tree had fixed questions for all playbooks
- Same questions regardless of playbook content
- Not useful for custom workflows

### After (Dynamic)
- Decision tree reads the playbook's escalation paths
- Generates questions from the conditions in each path
- Matches user answers to find the best escalation path
- Works with ANY custom playbook

## Features

### 1. Condition-Based Questions
- Each unique condition becomes a Yes/No question
- Questions ask: "Does your content involve or contain: [condition]?"
- User answers Yes or No for each condition
- Progress tracker shows how many conditions matched

### 2. Smart Matching Algorithm
- Tracks which conditions the user selects
- Finds the escalation path with the most matching conditions
- Falls back to first path if no matches
- Shows the best-fit recommendation

### 3. No-Conditions Fallback
- If a playbook has no conditions defined
- Shows a simple list of all available escalation paths
- Users can see all options at once
- Still displays with proper icons and colors

### 4. Custom Action Support
- Works with all custom actions
- Displays custom action icons and colors
- Shows action labels properly formatted
- Fully integrated with the custom actions feature

## Example Flow

### Playbook with Conditions

**Playbook**: Legal Review Workflow
**Escalation Paths**:
1. **Internal Legal Review** (action: `verify`)
   - Conditions: ["Contract terms", "Pricing information", "Service agreements"]
   
2. **External Counsel Review** (action: `consult`)
   - Conditions: ["Regulatory compliance", "Litigation risk", "IP concerns"]
   
3. **No AI Content** (action: `avoid`)
   - Conditions: ["Legal advice", "Binding commitments", "Liability issues"]

**User Experience**:
1. Question 1: "Does your content involve or contain: Contract terms?" → User: Yes
2. Question 2: "Does your content involve or contain: Pricing information?" → User: Yes
3. Question 3: "Does your content involve or contain: Regulatory compliance?" → User: No
4. ... (continues through all conditions)
5. **Result**: Internal Legal Review (2 matches)

### Playbook without Conditions

**Playbook**: Simple Approval Workflow
**Escalation Paths**:
1. **Manager Approval** (action: `approve`)
2. **Director Approval** (action: `escalate`)
3. **Executive Approval** (action: `consult`)

**User Experience**:
- Shows all three paths in a list
- User can see all options immediately
- No questions needed

## Benefits

### For Users
1. **Personalized Experience**: Each playbook has its own decision tree
2. **Relevant Questions**: Questions match the specific workflow
3. **Quick Decisions**: Get recommendations based on actual conditions
4. **Flexible**: Works with any number of paths and conditions

### For Organizations
1. **No Code Changes**: Create custom workflows without modifying the app
2. **Scalable**: Add as many playbooks as needed
3. **Consistent**: Same interface for all playbooks
4. **Maintainable**: Update conditions in one place

## Technical Implementation

### Component Props
```typescript
type DecisionTreeProps = {
  playbook: Playbook;
};
```

### Algorithm
```typescript
// 1. Extract all unique conditions
const allConditions = Array.from(
  new Set(
    playbook.escalationPaths.flatMap((path) => path.conditions)
  )
);

// 2. Ask user about each condition
// 3. Track selected conditions
// 4. Find best match
for (const path of playbook.escalationPaths) {
  const matches = path.conditions.filter((c) => 
    selectedConditions.includes(c)
  ).length;
  
  if (matches > maxMatches) {
    bestMatch = path;
  }
}
```

### State Management
- `selectedConditions`: Array of conditions user said "Yes" to
- `currentStep`: Current question number
- `result`: Final recommendation (escalation path)

## Use Cases

### 1. Content Moderation
**Conditions**: Hate speech, Violence, Spam, NSFW content
**Paths**: Auto-approve, Human review, Immediate removal

### 2. Legal Review
**Conditions**: Contract terms, Regulatory, IP, Liability
**Paths**: Internal review, External counsel, No AI

### 3. Technical Validation
**Conditions**: Code examples, API docs, Security, Performance
**Paths**: Peer review, Architect review, QA testing

### 4. Compliance Check
**Conditions**: PII, HIPAA, GDPR, Financial data
**Paths**: Privacy review, Legal review, Avoid AI

### 5. Marketing Approval
**Conditions**: Brand claims, Pricing, Testimonials, Comparisons
**Paths**: Manager approval, Legal review, Executive approval

## Best Practices

### Creating Effective Conditions
1. **Be Specific**: "Contains pricing information" vs "Important content"
2. **Use Clear Language**: Avoid jargon or ambiguous terms
3. **Keep it Simple**: One concept per condition
4. **Make it Binary**: Should be answerable with Yes/No

### Organizing Escalation Paths
1. **Distinct Conditions**: Each path should have unique conditions
2. **Appropriate Overlap**: Some overlap is okay for nuanced decisions
3. **Logical Grouping**: Related conditions in the same path
4. **Balanced Paths**: Try to have similar numbers of conditions per path

### Examples of Good Conditions
✅ "Contains customer personal information"
✅ "Involves financial transactions"
✅ "Requires technical expertise"
✅ "Has legal implications"

### Examples of Poor Conditions
❌ "Important stuff" (too vague)
❌ "Needs review" (not specific)
❌ "Complex" (subjective)
❌ "Maybe risky" (uncertain)

## Testing the Feature

### Test Case 1: Multiple Conditions
1. Create a playbook with 3 paths, each with 3-5 conditions
2. View the playbook
3. Answer the decision tree questions
4. Verify the correct path is recommended

### Test Case 2: No Conditions
1. Create a playbook with paths but no conditions
2. View the playbook
3. Verify it shows a list of all paths
4. No questions should appear

### Test Case 3: Single Path
1. Create a playbook with only 1 path
2. Add conditions to that path
3. View the playbook
4. Answer questions - should always recommend that path

### Test Case 4: Custom Actions
1. Create a playbook with custom actions
2. Add conditions to each path
3. View and complete the decision tree
4. Verify custom actions display correctly in results

## Future Enhancements

Potential improvements:
1. **Weighted Conditions**: Some conditions more important than others
2. **Conditional Logic**: "If X then ask Y"
3. **Multi-Select**: Allow selecting multiple conditions at once
4. **Skip Questions**: Option to skip irrelevant questions
5. **History**: Show path taken through questions
6. **Export Results**: Download recommendation as PDF
7. **Share Link**: Share specific decision tree results
8. **Analytics**: Track which paths are most commonly recommended

## Migration Notes

- Existing playbooks work automatically
- No data migration needed
- Old hardcoded tree removed
- All playbooks now use dynamic tree

## Troubleshooting

### Decision tree shows "No conditions"
- Check that escalation paths have conditions defined
- Add at least one condition to each path
- Conditions array should not be empty

### Wrong path recommended
- Review condition overlap between paths
- Make conditions more distinct
- Test with different answer combinations

### Questions seem random
- Conditions are shown in the order they appear
- Consider reordering conditions for better flow
- Group related conditions in the same path

## Summary

The dynamic decision tree makes every playbook interactive and personalized. Users get relevant questions based on the specific workflow, and organizations can create unlimited custom validation guides without any code changes!
