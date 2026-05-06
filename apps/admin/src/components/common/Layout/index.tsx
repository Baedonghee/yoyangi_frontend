import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

import Header from './Header';
import Sidebar from './Sidebar';

const LayoutWrapper = styled.section`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  overflow: hidden;
  main {
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    min-height: 0;
    height: 100%;
    width: 100%;
  }
`;

const Content = styled.div`
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  overflow-anchor: none;
  padding: 32px;
`;

const Layout: React.FC = () => {
  return (
    <LayoutWrapper data-scroll-container="admin-layout">
      <Sidebar />
      <main data-scroll-container="admin-main">
        <Header />
        <Content data-scroll-container="admin-content">
          <Outlet />
        </Content>
      </main>
    </LayoutWrapper>
  );
};

export default Layout;
