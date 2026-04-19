import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import qs from 'qs';
import styled from 'styled-components';
import { theme } from 'styles/theme';

import Next from 'components/SVG/icons/next';
import Prev from 'components/SVG/icons/prev';

import Box from '../Box';

interface IPaginationPrevProps {
  query: any; // Change the type if needed
  prev: number;
  pathname: string;
}

interface IPaginationNextProps {
  query: any; // Change the type if needed
  next: number;
  pathname: string;
}

interface IPaginationProps {
  totalPage: number;
}

const PaginationWrapper = styled(Box)`
  nav {
    .page-number {
      a {
        margin-right: 12px;
        &:last-child {
          margin-right: 0;
        }
      }
    }
    .dot-wrapper + .dot-wrapper {
      display: none !important;
    }
  }
`;

const PrevAndNextWrapper = styled(Box)`
  cursor: pointer;
  &:hover {
    span {
      color: ${({ theme }) => theme.color.gray600};
    }
    svg {
      path {
        stroke: ${({ theme }) => theme.color.gray600};
      }
    }
  }
`;

const PageWrapper = styled(Box)`
  cursor: pointer;
  &.active {
    &:hover {
      background-color: ${({ theme }) => theme.color.primary500};
    }
  }
  &:hover {
    background-color: ${({ theme }) => theme.color.primary50};
  }
`;

const PaginationPrev: React.FC<IPaginationPrevProps> = ({ query, prev, pathname }) => {
  const prevQuery = { ...query };
  prevQuery.page = String(prev);
  return (
    <Link to={`${pathname}?${qs.stringify(prevQuery)}`} style={{ marginRight: '12px' }}>
      <PrevAndNextWrapper display="flex" alignItems="center" width="28px" height="28px" justifyContent="center" borderRadius="4px">
        <Prev width="16" height="16" color={theme.color.gray700} />
      </PrevAndNextWrapper>
    </Link>
  );
};

const PaginationNext: React.FC<IPaginationNextProps> = ({ query, next, pathname }) => {
  const nextQuery = { ...query };
  nextQuery.page = String(next);
  return (
    <Link to={`${pathname}?${qs.stringify(nextQuery)}`} style={{ marginLeft: '12px' }}>
      <PrevAndNextWrapper display="flex" alignItems="center" width="28px" height="28px" justifyContent="center" borderRadius="4px">
        <Next width="16" height="16" color={theme.color.gray700} />
      </PrevAndNextWrapper>
    </Link>
  );
};

const Pagination: React.FC<IPaginationProps> = ({ totalPage }) => {
  const location = useLocation();
  const { search, pathname } = location;
  const query = qs.parse(search, { ignoreQueryPrefix: true });
  const currentPage = query?.page ? Number(query.page) : 1;
  const limit = 5;

  const handlePage = (pageIndex: number, index: number) => {
    const total = totalPage;
    const current = currentPage;
    const page = pageIndex + 1;

    const preservedDistanceToEdge = 3;
    const distanceToLastPage = Math.abs(total - page);
    const distanceToCurrent = Math.abs(page - current);
    const isEdgePage = page === total || page === 1;
    const isLastPreservedRange = total - current < preservedDistanceToEdge && distanceToLastPage < preservedDistanceToEdge;
    let isFirstPreservedRange = page <= preservedDistanceToEdge + 1 && current <= preservedDistanceToEdge + 1;

    if (current === preservedDistanceToEdge + 1 && total > limit) {
      isFirstPreservedRange = false;
    }
    if (total >= limit && current !== page && !isEdgePage && !isFirstPreservedRange && !isLastPreservedRange && distanceToCurrent > 3) {
      return (
        <Box className="dot-wrapper" key={`dot-${index}`} width="28px" height="28px" display="flex" justifyContent="center" mr="12px" lineHeight="28px">
          ...
        </Box>
      );
    }
    const newQuery = { ...query };
    newQuery.page = String(page);
    const active = page === current;
    return (
      <Link to={`${pathname}?${qs.stringify(newQuery)}`} key={`page-${index}`}>
        <PageWrapper
          width="28px"
          height="28px"
          fontSize={theme.fontSize.text14}
          color={active ? theme.color.white : theme.color.gray700}
          backgroundColor={active ? theme.color.primary500 : theme.color.white}
          border={active ? `1px solid ${theme.color.primary500}` : `1px solid ${theme.color.gray300}`}
          borderRadius="4px"
          display="flex"
          justifyContent="center"
          alignItems="center"
          textAlign="center"
          className={classNames({ active })}
        >
          {page}
        </PageWrapper>
      </Link>
    );
  };

  const pageArray = Array.from(Array(totalPage).keys());
  const prev = currentPage - 1;
  const next = currentPage + 1;

  return (
    <PaginationWrapper display="flex" justifyContent="end">
      <Box as="nav" display="flex" alignItems="center">
        {Number(currentPage) !== 1 && <PaginationPrev query={query} prev={prev} pathname={pathname} />}
        <Box className="page-number" display="flex">
          {pageArray.map((page, index) => handlePage(page, index))}
        </Box>
        {Number(currentPage) !== Number(totalPage) && <PaginationNext query={query} next={next} pathname={pathname} />}
      </Box>
    </PaginationWrapper>
  );
};

export default Pagination;
