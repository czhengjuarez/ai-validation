import { useState } from 'react';
import {
  Card,
  Text,
  Button,
  Stack,
  Group,
  Badge,
  ThemeIcon,
  Box,
  Paper,
  Transition,
} from '@mantine/core';
import {
  IconCheck,
  IconAlertTriangle,
  IconBan,
  IconArrowRight,
  IconRefresh,
  IconFlag,
  IconEye,
  IconUserCheck,
  IconAlertCircle,
} from '@tabler/icons-react';
import { Playbook, EscalationPath } from '@/data/templates';
import { useTheme } from '@/theme/ThemeProvider';

type Result = {
  action: string;
  title: string;
  description: string;
  conditions: string[];
  pathName: string;
};

type DecisionTreeProps = {
  playbook: Playbook;
};

export function DecisionTree({ playbook }: DecisionTreeProps) {
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Get all unique conditions from all escalation paths
  const allConditions = Array.from(
    new Set(
      playbook.escalationPaths.flatMap((path) => path.conditions)
    )
  );

  const handleConditionSelect = (condition: string, isMatch: boolean) => {
    const updatedConditions = isMatch 
      ? [...selectedConditions, condition] 
      : selectedConditions;
    
    if (isMatch) {
      setSelectedConditions(updatedConditions);
      
      // Check if this condition matches a high-priority path that should short-circuit
      // Priority order: avoid > consult > verify (reverse order of escalation paths)
      for (const path of [...playbook.escalationPaths].reverse()) {
        if (path.conditions.includes(condition)) {
          // Found a match - show this result immediately
          setResult({
            action: path.action,
            title: path.name,
            description: path.description,
            conditions: path.conditions,
            pathName: path.name,
          });
          return; // Short-circuit - don't ask more questions
        }
      }
    }
    
    // Move to next step or show result
    if (currentStep < allConditions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Find the best matching escalation path
      findBestMatch(updatedConditions);
    }
  };

  const findBestMatch = (conditions: string[]) => {
    // Find escalation paths that match the selected conditions
    let bestMatch: EscalationPath | null = null;
    let maxMatches = 0;

    for (const path of playbook.escalationPaths) {
      const matches = path.conditions.filter((c) => 
        conditions.includes(c)
      ).length;

      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = path;
      }
    }

    // If no matches, use the first path as default
    if (!bestMatch) {
      bestMatch = playbook.escalationPaths[0];
    }

    setResult({
      action: bestMatch.action,
      title: bestMatch.name,
      description: bestMatch.description,
      conditions: bestMatch.conditions,
      pathName: bestMatch.name,
    });
  };

  const handleReset = () => {
    setSelectedConditions([]);
    setResult(null);
    setCurrentStep(0);
  };

  const getActionIcon = (action: string) => {
    const lowerAction = action.toLowerCase();
    switch (lowerAction) {
      case 'verify':
        return <IconCheck size={20} />;
      case 'consult':
        return <IconAlertTriangle size={20} />;
      case 'avoid':
        return <IconBan size={20} />;
      case 'escalate':
        return <IconAlertCircle size={20} />;
      case 'review':
        return <IconEye size={20} />;
      case 'approve':
        return <IconUserCheck size={20} />;
      case 'flag':
        return <IconFlag size={20} />;
      default:
        return <IconCheck size={20} />;
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
        return 'grape';
    }
  };

  const getActionLabel = (action: string) => {
    const lowerAction = action.toLowerCase();
    switch (lowerAction) {
      case 'verify':
        return 'VERIFY INTERNALLY';
      case 'consult':
        return 'CONSULT EXPERTS';
      case 'avoid':
        return 'AVOID AI CONTENT';
      case 'escalate':
        return 'ESCALATE';
      case 'review':
        return 'REVIEW';
      case 'approve':
        return 'APPROVE';
      case 'flag':
        return 'FLAG FOR REVIEW';
      default:
        return action.toUpperCase();
    }
  };

  // If there are no conditions, show a simple list of paths
  if (allConditions.length === 0) {
    return (
      <Card 
        withBorder 
        shadow="md" 
        radius="md" 
        p="xl"
        style={{
          backgroundColor: isDark ? '#1e293b' : '#ffffff',
          borderColor: isDark ? '#334155' : '#dee2e6',
        }}
      >
        <Stack gap="lg">
          <Box>
            <Text size="xl" fw={600} mb="md" style={{ color: isDark ? '#f1f5f9' : '#212529' }}>
              Available Escalation Paths
            </Text>
            <Text size="sm" style={{ color: isDark ? '#94a3b8' : '#868e96' }}>
              This playbook doesn't have specific conditions defined. Here are the available escalation paths:
            </Text>
          </Box>

          <Stack gap="sm">
            {playbook.escalationPaths.map((path, index) => (
              <Paper 
                key={index} 
                p="md" 
                withBorder 
                radius="sm"
                style={{
                  backgroundColor: isDark ? '#334155' : '#f8f9fa',
                  borderColor: isDark ? '#475569' : '#dee2e6',
                }}
              >
                <Group gap="md" align="flex-start">
                  <ThemeIcon
                    size="lg"
                    radius="md"
                    variant="light"
                    color={getActionColor(path.action)}
                  >
                    {getActionIcon(path.action)}
                  </ThemeIcon>
                  <Box style={{ flex: 1 }}>
                    <Group gap="xs" mb="xs">
                      <Badge color={getActionColor(path.action)} variant="filled">
                        {getActionLabel(path.action)}
                      </Badge>
                      <Text fw={600} style={{ color: isDark ? '#f1f5f9' : '#212529' }}>{path.name}</Text>
                    </Group>
                    <Text size="sm" style={{ color: isDark ? '#94a3b8' : '#868e96' }}>
                      {path.description}
                    </Text>
                  </Box>
                </Group>
              </Paper>
            ))}
          </Stack>
        </Stack>
      </Card>
    );
  }

  if (result) {
    return (
      <Transition mounted={true} transition="fade" duration={300} timingFunction="ease">
        {(styles) => (
          <Card 
            withBorder 
            shadow="lg" 
            radius="md" 
            p="xl" 
            style={{
              ...styles,
              backgroundColor: isDark ? '#1e293b' : '#ffffff',
              borderColor: isDark ? '#334155' : '#dee2e6',
            }}
          >
            <Stack gap="lg">
              <Group justify="space-between" align="flex-start">
                <Group gap="md">
                  <ThemeIcon
                    size="xl"
                    radius="md"
                    variant="light"
                    color={getActionColor(result.action)}
                  >
                    {getActionIcon(result.action)}
                  </ThemeIcon>
                  <div>
                    <Badge
                      color={getActionColor(result.action)}
                      variant="filled"
                      size="lg"
                      mb="xs"
                    >
                      {getActionLabel(result.action)}
                    </Badge>
                    <Text size="xl" fw={700} style={{ color: isDark ? '#f1f5f9' : '#212529' }}>
                      {result.title}
                    </Text>
                  </div>
                </Group>
                <Button
                  variant="subtle"
                  color="gray"
                  leftSection={<IconRefresh size={16} />}
                  onClick={handleReset}
                >
                  Start Over
                </Button>
              </Group>

              <Text size="md" style={{ color: isDark ? '#94a3b8' : '#868e96' }}>
                {result.description}
              </Text>

              <Box>
                <Text fw={600} mb="md" size="lg" style={{ color: isDark ? '#f1f5f9' : '#212529' }}>
                  When content contains or involves:
                </Text>
                <Stack gap="sm">
                  {result.conditions.map((condition, index) => (
                    <Paper 
                      key={index} 
                      p="md" 
                      withBorder 
                      radius="sm"
                      style={{
                        backgroundColor: isDark ? '#334155' : '#f8f9fa',
                        borderColor: isDark ? '#475569' : '#dee2e6',
                      }}
                    >
                      <Group gap="md" align="flex-start">
                        <ThemeIcon
                          size="md"
                          radius="xl"
                          variant="filled"
                          color={getActionColor(result.action)}
                        >
                          <Text size="xs" fw={700}>
                            {index + 1}
                          </Text>
                        </ThemeIcon>
                        <Text size="sm" style={{ flex: 1, color: isDark ? '#cbd5e1' : '#495057' }}>
                          {condition}
                        </Text>
                      </Group>
                    </Paper>
                  ))}
                </Stack>
              </Box>

              <Text size="sm" mt="md" style={{ color: isDark ? '#94a3b8' : '#868e96' }}>
                Based on your answers, this escalation path best matches your content validation needs.
              </Text>
            </Stack>
          </Card>
        )}
      </Transition>
    );
  }

  const currentCondition = allConditions[currentStep];

  return (
    <Transition mounted={true} transition="fade" duration={300} timingFunction="ease">
      {(styles) => (
        <Card 
          withBorder 
          shadow="md" 
          radius="md" 
          p="xl" 
          style={{
            ...styles,
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderColor: isDark ? '#334155' : '#dee2e6',
          }}
        >
          <Stack gap="lg">
            <Box>
              <Text size="sm" mb="xs" style={{ color: isDark ? '#94a3b8' : '#868e96' }}>
                Question {currentStep + 1} of {allConditions.length}
              </Text>
              <Text size="xl" fw={600} style={{ color: isDark ? '#f1f5f9' : '#212529' }}>
                Does your content involve or contain:
              </Text>
              <Text size="lg" fw={500} mt="md" style={{ color: isDark ? '#cbd5e1' : '#475569' }}>
                {currentCondition}
              </Text>
            </Box>

            <Group gap="md" grow>
              <Button
                variant="filled"
                size="lg"
                color="gray"
                rightSection={<IconArrowRight size={18} />}
                onClick={() => handleConditionSelect(currentCondition, true)}
              >
                Yes
              </Button>
              <Button
                variant="light"
                size="lg"
                color="gray"
                rightSection={<IconArrowRight size={18} />}
                onClick={() => handleConditionSelect(currentCondition, false)}
              >
                No
              </Button>
            </Group>

            {currentStep > 0 && (
              <Button
                variant="subtle"
                color="gray"
                leftSection={<IconRefresh size={16} />}
                onClick={handleReset}
                mt="md"
              >
                Start Over
              </Button>
            )}

            <Text size="xs" c="dimmed" mt="md">
              Progress: {selectedConditions.length} conditions matched
            </Text>
          </Stack>
        </Card>
      )}
    </Transition>
  );
}
