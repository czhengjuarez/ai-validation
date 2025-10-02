import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

// Import styles
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import './index.css';

import App from './App';
import { ThemeProvider } from './theme/ThemeProvider';

// Set light theme as default
document.documentElement.classList.add('light');
document.documentElement.setAttribute('data-theme', 'light');

const theme = createTheme({});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider theme={theme}>
      <Notifications />
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </MantineProvider>
  </StrictMode>,
);
