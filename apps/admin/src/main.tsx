import { createRoot } from 'react-dom/client';
import { unstable_HistoryRouter as Router } from 'react-router-dom';
import isPropValid from '@emotion/is-prop-valid';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AlertProvider } from 'providers/index.ts';
import { RecoilRoot } from 'recoil';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import { GlobalStyle } from 'styles/global-styles.ts';
import { theme } from 'styles/theme.ts';
import history from 'utils/history';

import ScrollTop from 'components/common/ScrollTop/index.tsx';

import App from './App.tsx';

import '@toast-ui/editor/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <>
    <QueryClientProvider client={queryClient}>
      <StyleSheetManager shouldForwardProp={isPropValid}>
        <ThemeProvider theme={theme}>
          <GlobalStyle />
          <Router
            history={history as any}
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <ScrollTop />
            <RecoilRoot>
              <AlertProvider>
                <App />
              </AlertProvider>
            </RecoilRoot>
          </Router>
        </ThemeProvider>
      </StyleSheetManager>
    </QueryClientProvider>
  </>,
);
