import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Box from 'components/UI/Box';

import Header from './Header';
import Sidebar from './Sidebar';

const LayoutWrapper = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  overflow-y: auto;
  main {
    display: flex;
    flex-direction: column;
    position: relative;
    overflow-y: auto;
    width: 100%;
  }
`;

const Layout: React.FC = () => {
  return (
    <LayoutWrapper>
      <Sidebar />
      <main>
        <Header />
        <Box p="32px" overflowX="hidden" minHeight="calc(100vh - 64px)">
          <Outlet />
        </Box>
      </main>
    </LayoutWrapper>
  );
};

export default Layout;
