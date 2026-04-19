import React, { useRef } from 'react';
import styled, { css } from 'styled-components';
import { theme } from 'styles/theme';
import { useOnClickOutside } from 'usehooks-ts';

import CloseLine from 'components/SVG/icons/close-line';
import Box from 'components/UI/Box';
import Typography from 'components/UI/Typography';

const ModalLayoutWrapper = styled.div<{ $width: string; $p: string; scroll?: string }>`
  width: ${({ $width }) => $width};
  ${({ $p }) => ($p === '24px' ? 'padding: 24px;' : 'padding-top: 24px;')};
  border-radius: 12px;
  box-shadow: 4px 0px 8px 0px rgba(0, 0, 0, 0.1), 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  ${({ scroll, theme }) =>
    scroll
      ? css`
          margin: auto;
          background-color: ${theme.color.white};
        `
      : ''};
  .close {
    cursor: pointer;
  }
`;

interface IModalLayout {
  width: string;
  children: React.ReactNode;
  title: string;
  p?: string;
  onClose: () => void;
  scroll?: boolean;
}

const ModalLayout: React.FC<IModalLayout> = ({ title, width, children, p = '24px', onClose, scroll }) => {
  const ref = useRef(null);
  const handleClickOutside = () => {
    onClose();
  };

  useOnClickOutside(ref, handleClickOutside);

  return (
    <ModalLayoutWrapper $width={width} $p={p} scroll={scroll ? 'scroll' : ''} ref={scroll ? ref : undefined}>
      <Box display="flex" justifyContent="space-between" p={p === '24px' ? '0' : '0px 24px'}>
        <Typography fontSize={theme.fontSize.text24} fontWeight={theme.fontWeight.semiBold}>
          {title}
        </Typography>
        <CloseLine className="close" width="24" height="24" color={theme.color.gray500} onClick={onClose} />
      </Box>
      {children}
    </ModalLayoutWrapper>
  );
};

export default ModalLayout;
