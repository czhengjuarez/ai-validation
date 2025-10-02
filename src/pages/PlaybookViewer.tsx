import { useParams, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { notifications } from '@mantine/notifications';
import { PLAYBOOK_TEMPLATES, Playbook, isBuiltInTemplate } from '@/data/templates';
import { storageService } from '@/services/storage';
import { useTheme } from '@/theme/ThemeProvider';
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  Group,
  Badge,
  Divider,
  Button,
  List,
  ThemeIcon,
  Box,
} from '@mantine/core';
import { IconArrowLeft, IconCheck, IconAlertTriangle, IconBan, IconDownload, IconPrinter, IconFlag, IconEye, IconUserCheck, IconAlertCircle, IconTrash } from '@tabler/icons-react';
import { DecisionTree } from '@/components/DecisionTree';


export function PlaybookViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [playbook, setPlaybook] = useState<Playbook | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchPlaybook = async () => {
      try {
        if (!id) {
          setIsLoading(false);
          return;
        }

        // Check if it's a template
        const template = PLAYBOOK_TEMPLATES.find(t => t.id === id);
        if (template) {
          setPlaybook(template);
          setIsLoading(false);
          return;
        }

        // Otherwise, fetch from R2 storage
        const fetchedPlaybook = await storageService.getPlaybook(id);
        setPlaybook(fetchedPlaybook);
      } catch (error) {
        console.error('Failed to fetch playbook:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaybook();
  }, [id]);

  const getActionIcon = (action: string) => {
    const lowerAction = action.toLowerCase();
    switch (lowerAction) {
      case 'verify':
        return <IconCheck size={16} />;
      case 'consult':
        return <IconAlertTriangle size={16} />;
      case 'avoid':
        return <IconBan size={16} />;
      case 'escalate':
        return <IconAlertCircle size={16} />;
      case 'review':
        return <IconEye size={16} />;
      case 'approve':
        return <IconUserCheck size={16} />;
      case 'flag':
        return <IconFlag size={16} />;
      default:
        return <IconCheck size={16} />; // Default icon for custom actions
    }
  };

  const getActionColor = (action: string) => {
    const lowerAction = action.toLowerCase();
    switch (lowerAction) {
      case 'verify':
        return 'blue';
      case 'consult':
        return 'orange';
      case 'avoid':
        return 'red';
      case 'escalate':
        return 'red';
      case 'review':
        return 'cyan';
      case 'approve':
        return 'green';
      case 'flag':
        return 'yellow';
      default:
        return 'grape'; // Purple for custom actions
    }
  };

  const getActionLabel = (action: string) => {
    const lowerAction = action.toLowerCase();
    switch (lowerAction) {
      case 'verify':
        return 'Verify Internally';
      case 'consult':
        return 'Consult Experts';
      case 'avoid':
        return 'Avoid AI Content';
      case 'escalate':
        return 'Escalate';
      case 'review':
        return 'Review';
      case 'approve':
        return 'Approve';
      case 'flag':
        return 'Flag for Review';
      default:
        // Capitalize first letter of custom actions
        return action.charAt(0).toUpperCase() + action.slice(1);
    }
  };

  const handleDownload = () => {
    if (!playbook) return;
    
    const dataStr = JSON.stringify(playbook, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `${playbook.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDeleteClick = async () => {
    if (!playbook || !id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${playbook.title}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await storageService.deletePlaybook(id);
      notifications.show({
        title: 'Success',
        message: 'Playbook deleted successfully',
        color: 'green',
      });
      navigate('/');
    } catch (error) {
      console.error('Failed to delete playbook:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to delete playbook. Please try again.',
        color: 'red',
      });
    }
  };

  if (isLoading) {
    return (
      <Container size="lg" py="xl">
        <Text>Loading playbook...</Text>
      </Container>
    );
  }

  if (!playbook) {
    return (
      <Container size="lg" py="xl">
        <Title order={2}>Playbook not found</Title>
        <Text mt="md">The requested playbook could not be found.</Text>
        <Button component={Link} to="/" mt="lg">
          Back to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <Button
        component={Link}
        to="/"
        variant="subtle"
        color="gray"
        leftSection={<IconArrowLeft size={16} />}
        mb="xl"
        px={0}
      >
        Back to Playbooks
      </Button>

      <Stack gap="xl">
        <div>
          <Title order={1} mb="xs" style={{ color: isDark ? '#f1f5f9' : '#212529' }}>
            {playbook.title}
          </Title>
          <Text size="lg" style={{ color: isDark ? '#94a3b8' : '#868e96' }}>
            {playbook.description}
          </Text>
          <Text size="sm" mt="xs" style={{ color: isDark ? '#94a3b8' : '#868e96' }}>
            Last updated: {new Date(playbook.updatedAt).toLocaleDateString()}
          </Text>
        </div>

        {playbook.contributor && (playbook.contributor.name || playbook.contributor.email) && (
          <Card 
            withBorder 
            p="md" 
            radius="md"
            style={{
              backgroundColor: isDark ? '#1e293b' : '#f8f9fa',
              borderColor: isDark ? '#334155' : '#dee2e6',
            }}
          >
            <Group gap="xs" mb="xs">
              <IconUserCheck size={18} style={{ color: isDark ? '#60a5fa' : '#228be6' }} />
              <Text size="sm" fw={600} style={{ color: isDark ? '#f1f5f9' : '#212529' }}>
                Contributor
              </Text>
            </Group>
            <Stack gap={4}>
              {playbook.contributor.name && (
                <Text size="sm" style={{ color: isDark ? '#94a3b8' : '#495057' }}>
                  {playbook.contributor.name}
                </Text>
              )}
              {playbook.contributor.email && (
                <Text 
                  size="sm" 
                  component="a" 
                  href={`mailto:${playbook.contributor.email}`}
                  style={{ 
                    color: isDark ? '#60a5fa' : '#228be6',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                  {playbook.contributor.email}
                </Text>
              )}
            </Stack>
          </Card>
        )}

        <Divider my="md" />

        <Title order={2} mb="md" style={{ color: isDark ? '#f1f5f9' : '#212529' }}>
          Interactive Validation Guide
        </Title>
        <Text mb="lg" style={{ color: isDark ? '#94a3b8' : '#868e96' }}>
          Answer a few questions to get personalized validation recommendations
        </Text>

        <DecisionTree playbook={playbook} />

        <Divider my="xl" />

        <Title order={2} mb="md" style={{ color: isDark ? '#f1f5f9' : '#212529' }}>
          All Escalation Paths
        </Title>
        <Text mb="lg" size="sm" style={{ color: isDark ? '#94a3b8' : '#868e96' }}>
          Quick reference guide for all validation scenarios
        </Text>

        <Stack gap="xl">
          {playbook.escalationPaths.map((path) => (
            <Card 
              key={path.id} 
              withBorder 
              shadow="sm" 
              radius="md"
              style={{
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                color: isDark ? '#f1f5f9' : '#212529',
                borderColor: isDark ? '#334155' : '#dee2e6',
              }}
            >
              <Group justify="space-between" mb="md">
                <Group gap="xs">
                  <Badge
                    leftSection={
                      <ThemeIcon
                        variant="light"
                        color={getActionColor(path.action)}
                        size="xs"
                        mr={5}
                      >
                        {getActionIcon(path.action)}
                      </ThemeIcon>
                    }
                    color={getActionColor(path.action)}
                    variant="outline"
                    size="lg"
                    radius="sm"
                    c={isDark ? 'gray.0' : 'dark.7'}
                  >
                    {getActionLabel(path.action)}
                  </Badge>
                  <Title order={3} style={{ color: isDark ? '#f1f5f9' : '#212529' }}>{path.name}</Title>
                </Group>
              </Group>

              <Text mb="md" style={{ color: isDark ? '#cbd5e1' : '#495057' }}>{path.description}</Text>

              <Box>
                <Text fw={500} mb="sm" style={{ color: isDark ? '#cbd5e1' : '#495057' }}>
                  When content contains or involves:
                </Text>
                <List
                  spacing="xs"
                  size="sm"
                  center
                  icon={
                    <ThemeIcon color={getActionColor(path.action)} size={16} radius="xl">
                      <Box style={{ width: 6, height: 6 }} />
                    </ThemeIcon>
                  }
                >
                  {path.conditions.map((condition, index) => (
                    <List.Item key={index}>
                      <Text style={{ color: isDark ? '#cbd5e1' : '#495057' }}>{condition}</Text>
                    </List.Item>
                  ))}
                </List>
              </Box>
            </Card>
          ))}
        </Stack>

        <Group justify="space-between" align="flex-end" mt="xl">
          {/* Only show Edit/Delete buttons for user-created playbooks (not templates) */}
          {!isBuiltInTemplate(id || '') ? (
            <Group>
              <Button
                component={Link}
                to={`/editor?edit=${id}`}
                variant="outline"
              >
                Edit Playbook
              </Button>
              <Button
                variant="outline"
                color="red"
                leftSection={<IconTrash size={16} />}
                onClick={handleDeleteClick}
              >
                Delete
              </Button>
            </Group>
          ) : (
            <div />
          )}
          <Group>
            <Button
              variant="outline"
              leftSection={<IconPrinter size={16} />}
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button
              variant="outline"
              leftSection={<IconDownload size={16} />}
              onClick={handleDownload}
            >
              Download JSON
            </Button>
          </Group>
        </Group>
      </Stack>
    </Container>
  );
}
