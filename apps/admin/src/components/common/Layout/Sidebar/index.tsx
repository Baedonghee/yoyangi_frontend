import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import { authUserSelector } from 'stores/auth';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { PATH } from 'utils/path';
import { sideMenuLis } from 'utils/side-menu';

import Down from 'components/SVG/icons/down';
import Up from 'components/SVG/icons/up';
import Box from 'components/UI/Box';
import Typography from 'components/UI/Typography';

const SidebarWrapper = styled.aside`
  min-width: 180px;
  width: 180px;
  border-right: 1px solid ${({ theme }) => theme.color.gray300};
  position: sticky;
  left: 0;
  z-index: 800;
  background-color: ${({ theme }) => theme.color.white};
  & > ul {
    & > li {
      cursor: pointer;
      border-bottom: 1px solid ${({ theme }) => theme.color.gray200};
      &.active {
        position: relative;
        background-color: ${({ theme }) => theme.color.primary50};
      }
      & > a {
        display: flex;
        align-items: center;
        height: 52px;
        padding: 0px 16px;
        font-size: ${({ theme }) => theme.fontSize.text14};
        font-weight: ${({ theme }) => theme.fontWeight.semiBold};
        color: ${({ theme }) => theme.color.gray700};
        svg {
          margin-right: 12px;
        }
      }
      &.sidebar-link {
        & > a {
          &:hover {
            background-color: ${({ theme }) => theme.color.primary50};
            color: ${({ theme }) => theme.color.primary500};
          }
        }
      }
      .sidebar-title {
        &:hover {
          background-color: ${({ theme }) => theme.color.primary50};
          span {
            color: ${({ theme }) => theme.color.primary500};
          }
          path {
            stroke: ${({ theme }) => theme.color.primary500};
          }
        }
      }
      & > ul {
        & > li {
          display: flex;
          height: 40px;
          width: 100%;
          &.active {
            & > a {
              background-color: ${({ theme }) => theme.color.primary50};
              color: ${({ theme }) => theme.color.primary500};
            }
          }
          & > a {
            display: flex;
            align-items: center;
            height: 100%;
            width: 100%;
            padding: 0px 16px;
            font-size: ${({ theme }) => theme.fontSize.text12};
            font-weight: ${({ theme }) => theme.fontWeight.normal};
            color: ${({ theme }) => theme.color.gray600};
            &:hover {
              background-color: ${({ theme }) => theme.color.primary50};
              color: ${({ theme }) => theme.color.primary500};
            }
          }
        }
      }
    }
  }
`;

const Sidebar = () => {
  const user = useRecoilValue(authUserSelector);
  const [activeMenu, setActiveMenu] = useState('');
  const { pathname } = useLocation();

  const handleActiveMenu = (menu: string) => {
    if (activeMenu === menu) {
      setActiveMenu('');
    } else {
      setActiveMenu(menu);
    }
  };

  useEffect(() => {
    if (pathname) {
      const path = pathname.split('/')[1];
      setActiveMenu(path);
    }
  }, [pathname]);

  return (
    <SidebarWrapper>
      <Box cursor="pointer" backgroundColor={theme.color.primary500} color={theme.color.white} fontWeight={theme.fontWeight.bold}>
        <Link to={PATH.MAIN}>
          <Box display="flex" width="100%" alignItems="center" justifyContent="center" height="60px">
            요양이 ADMIN
          </Box>
        </Link>
      </Box>
      {/* <ul>
        {sideMenuLis.map((sideMenu) => {
          return (
            <li key={`menu-${sideMenu.name}`}>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                height="52px"
                p="0px 16px"
                className="sidebar-title"
                onClick={() => handleActiveMenu(sideMenu.name || '')}
              >
                <Typography
                  as="span"
                  fontSize={theme.fontSize.text14}
                  fontWeight={theme.fontWeight.semiBold}
                  color={sideMenu.name === activeMenu ? theme.color.primary500 : theme.color.gray700}
                >
                  {sideMenu.title}
                </Typography>
                {sideMenu.name === activeMenu ? (
                  <Down width="24" height="24" color={theme.color.primary500} />
                ) : (
                  <Up width="24" height="24" color={theme.color.gray700} />
                )}
              </Box>
              {sideMenu.name === activeMenu && sideMenu.list && (
                <ul>
                  {sideMenu.list.map((child, index) => {
                    return (
                      <li key={`menu-${sideMenu.name}-${index}`} className={classNames({ active: pathname === child.path })}>
                        <Link to={child.path!}>{child.title}</Link>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          );
        })}
      </ul> */}
      <ul>
        {sideMenuLis.map((sideMenu) => {
          if (user?.authorities.some((authority) => authority.code === sideMenu.code)) {
            return (
              <li key={`menu-${sideMenu.name}`}>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  height="52px"
                  p="0px 16px"
                  className="sidebar-title"
                  onClick={() => handleActiveMenu(sideMenu.name || '')}
                >
                  <Typography
                    as="span"
                    fontSize={theme.fontSize.text14}
                    fontWeight={theme.fontWeight.semiBold}
                    color={sideMenu.name === activeMenu ? theme.color.primary500 : theme.color.gray700}
                  >
                    {sideMenu.title}
                  </Typography>
                  {sideMenu.name === activeMenu ? (
                    <Down width="24" height="24" color={theme.color.primary500} />
                  ) : (
                    <Up width="24" height="24" color={theme.color.gray700} />
                  )}
                </Box>
                {sideMenu.name === activeMenu && sideMenu.list && (
                  <ul>
                    {sideMenu.list.map((child, index) => {
                      return (
                        <li key={`menu-${sideMenu.name}-${index}`} className={classNames({ active: pathname === child.path })}>
                          <Link to={child.path!}>{child.title}</Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          }
          return null;
        })}
      </ul>
    </SidebarWrapper>
  );
};

export default Sidebar;
