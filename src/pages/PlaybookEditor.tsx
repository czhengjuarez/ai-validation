import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { Playbook, EscalationPath } from '@/data/templates';
import { storageService } from '@/services/storage';
import { useTheme } from '@/theme/ThemeProvider';
import {
  Container,
  Title,
  Text,
  TextInput,
  Textarea,
  Button,
  Stack,
  Group,
  Card,
  Box,
} from '@mantine/core';
import { IconPlus, IconTrash } from '@tabler/icons-react';

export function PlaybookEditor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(!!editId);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const form = useForm<Omit<Playbook, 'id' | 'createdAt' | 'updatedAt'>>({
    initialValues: {
      title: '',
      description: '',
      escalationPaths: [
        {
          id: '1',
          name: 'Internal Verification',
          description: 'Content should be verified by internal team members',
          action: 'verify',
          conditions: [
            'Sensitive business information',
            'Legal or compliance implications',
          ],
        },
        {
          id: '2',
          name: 'External Expert Review',
          description: 'Content should be reviewed by subject matter experts',
          action: 'consult',
          conditions: [
            'Technical or specialized domain knowledge required',
            'High-impact decisions',
          ],
        },
        {
          id: '3',
          name: 'Avoid AI Content',
          description: 'Do not use AI-generated content in this case',
          action: 'avoid',
          conditions: [
            'Highly sensitive personal information',
            'Legal or medical advice',
            'Content requiring human judgment',
          ],
        },
      ],
    },
    validate: {
      title: (value) => (value.trim().length < 3 ? 'Title is too short' : null),
      description: (value) =>
        value.trim().length < 10 ? 'Description is too short' : null,
    },
  });

  // Load playbook data if editing
  useEffect(() => {
    const loadPlaybook = async () => {
      if (!editId) return;

      try {
        const playbook = await storageService.getPlaybook(editId);
        form.setValues({
          title: playbook.title,
          description: playbook.description,
          escalationPaths: playbook.escalationPaths,
        });
        setIsEditing(true);
      } catch (error) {
        console.error('Failed to load playbook:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to load playbook for editing.',
          color: 'red',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadPlaybook();
  }, [editId]);

  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      if (isEditing && editId) {
        // Update existing playbook
        const updatedPlaybook = await storageService.updatePlaybook(editId, {
          ...values,
          updatedAt: new Date().toISOString(),
        });
        
        notifications.show({
          title: 'Success',
          message: 'Playbook updated successfully!',
          color: 'green',
        });
        
        navigate(`/playbook/${updatedPlaybook.id}`);
      } else {
        // Create new playbook
        const savedPlaybook = await storageService.savePlaybook({
          ...values,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        notifications.show({
          title: 'Success',
          message: 'Playbook created successfully!',
          color: 'green',
        });
        
        navigate(`/playbook/${savedPlaybook.id}`);
      }
    } catch (error) {
      console.error('Failed to save playbook:', error);
      notifications.show({
        title: 'Error',
        message: `Failed to ${isEditing ? 'update' : 'create'} playbook. Please try again.`,
        color: 'red',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addEscalationPath = () => {
    const newPath: EscalationPath = {
      id: Date.now().toString(),
      name: '',
      description: '',
      action: 'verify',
      conditions: [],
    };
    form.insertListItem('escalationPaths', newPath);
  };

  const removeEscalationPath = (index: number) => {
    form.removeListItem('escalationPaths', index);
  };

  const addCondition = (pathIndex: number) => {
    const newConditions = [...form.values.escalationPaths[pathIndex].conditions, ''];
    form.setFieldValue(`escalationPaths.${pathIndex}.conditions`, newConditions);
  };

  const updateCondition = (pathIndex: number, conditionIndex: number, value: string) => {
    const newConditions = [...form.values.escalationPaths[pathIndex].conditions];
    newConditions[conditionIndex] = value;
    form.setFieldValue(`escalationPaths.${pathIndex}.conditions`, newConditions);
  };

  const removeCondition = (pathIndex: number, conditionIndex: number) => {
    const newConditions = form.values.escalationPaths[pathIndex].conditions.filter(
      (_, i) => i !== conditionIndex
    );
    form.setFieldValue(`escalationPaths.${pathIndex}.conditions`, newConditions);
  };

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Loading playbook...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="xl">
          <div>
            <Title order={1} mb="xs" style={{ color: isDark ? '#f1f5f9' : '#212529' }}>
              {isEditing ? 'Edit Playbook' : 'Create New Playbook'}
            </Title>
            <Text style={{ color: isDark ? '#94a3b8' : '#868e96' }}>
              Define the validation workflow for AI-generated content in your organization
            </Text>
          </div>

          <Card 
            withBorder 
            p="lg" 
            radius="md"
            style={{
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              borderColor: isDark ? '#334155' : '#dee2e6',
            }}
          >
            <Stack gap="md">
              <TextInput
                label="Playbook Title"
                placeholder="e.g., Content Validation Workflow"
                required
                styles={{
                  label: { color: isDark ? '#f1f5f9' : '#212529' },
                }}
                {...form.getInputProps('title')}
              />
              <Textarea
                label="Description"
                placeholder="Describe the purpose of this playbook"
                minRows={3}
                required
                styles={{
                  label: { color: isDark ? '#f1f5f9' : '#212529' },
                }}
                {...form.getInputProps('description')}
              />
            </Stack>
          </Card>

          <Title order={2} mt="xl" mb="md" style={{ color: isDark ? '#f1f5f9' : '#212529' }}>
            Escalation Paths
          </Title>
          <Text mb="md" style={{ color: isDark ? '#94a3b8' : '#868e96' }}>
            Define when and how to handle different types of AI-generated content
          </Text>

          {form.values.escalationPaths.map((path, pathIndex) => (
            <Card 
              key={path.id} 
              withBorder 
              p="lg" 
              radius="md"
              style={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                borderColor: isDark ? '#334155' : '#dee2e6',
              }}
            >
              <Group justify="space-between" mb="md">
                <Title order={4} style={{ color: isDark ? '#f1f5f9' : '#212529' }}>Path {pathIndex + 1}</Title>
                {form.values.escalationPaths.length > 1 && (
                  <Button
                    variant="subtle"
                    color="red"
                    size="sm"
                    leftSection={<IconTrash size={16} />}
                    onClick={() => removeEscalationPath(pathIndex)}
                  >
                    Remove
                  </Button>
                )}
              </Group>

              <Stack gap="md">
                <TextInput
                  label="Path Name"
                  placeholder="e.g., Legal Review Required"
                  required
                  value={path.name}
                  styles={{
                    label: { color: isDark ? '#f1f5f9' : '#212529' },
                  }}
                  onChange={(e) =>
                    form.setFieldValue(`escalationPaths.${pathIndex}.name`, e.target.value)
                  }
                />
                <Textarea
                  label="Description"
                  placeholder="Describe when this path should be followed"
                  minRows={2}
                  required
                  value={path.description}
                  styles={{
                    label: { color: isDark ? '#f1f5f9' : '#212529' },
                  }}
                  onChange={(e) =>
                    form.setFieldValue(
                      `escalationPaths.${pathIndex}.description`,
                      e.target.value
                    )
                  }
                />
                <Box>
                  <Text size="sm" fw={500} mb="xs" style={{ color: isDark ? '#f1f5f9' : '#212529' }}>
                    Action <span style={{ color: 'red' }}>*</span>
                  </Text>
                  <TextInput
                    placeholder="e.g., verify, consult, escalate, review, approve"
                    value={path.action}
                    styles={{
                      description: { color: isDark ? '#94a3b8' : '#868e96' },
                    }}
                    onChange={(e) =>
                      form.setFieldValue(
                        `escalationPaths.${pathIndex}.action`,
                        e.target.value
                      )
                    }
                    description="Common actions: verify, consult, avoid, escalate, review, approve, flag"
                  />
                </Box>

                <Box>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm" fw={500} style={{ color: isDark ? '#f1f5f9' : '#212529' }}>
                      Conditions
                    </Text>
                    <Button
                      variant="subtle"
                      color="gray"
                      size="xs"
                      leftSection={<IconPlus size={14} />}
                      onClick={() => addCondition(pathIndex)}
                    >
                      Add Condition
                    </Button>
                  </Group>
                  <Stack gap="xs">
                    {path.conditions.map((condition, conditionIndex) => (
                      <Group key={conditionIndex} gap="xs">
                        <TextInput
                          placeholder="e.g., Contains sensitive information"
                          value={condition}
                          onChange={(e) =>
                            updateCondition(pathIndex, conditionIndex, e.target.value)
                          }
                          style={{ flex: 1 }}
                        />
                        <Button
                          variant="subtle"
                          color="red"
                          size="sm"
                          onClick={() => removeCondition(pathIndex, conditionIndex)}
                        >
                          <IconTrash size={16} />
                        </Button>
                      </Group>
                    ))}
                    {path.conditions.length === 0 && (
                      <Text size="sm" style={{ color: isDark ? '#94a3b8' : '#868e96' }}>
                        No conditions added yet. Click "Add Condition" to get started.
                      </Text>
                    )}
                  </Stack>
                </Box>
              </Stack>
            </Card>
          ))}

          <Button
            variant="outline"
            color="gray"
            leftSection={<IconPlus size={16} />}
            onClick={addEscalationPath}
            fullWidth
            mt="md"
          >
            Add Escalation Path
          </Button>

          <Group justify="flex-end" mt="xl">
            <Button variant="default" color="gray" type="button" onClick={() => navigate('/')}>
              Cancel
            </Button>
            <Button type="submit" color="gray" loading={isSubmitting}>
              {isEditing ? 'Update Playbook' : 'Create Playbook'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Container>
  );
}
