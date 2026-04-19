import React from 'react';
import parse from 'html-react-parser';
import styled from 'styled-components';
import { theme } from 'styles/theme';

import CheckFilled from 'components/SVG/icons/check-filled';
import CloseRound from 'components/SVG/icons/close-round';
import Warning from 'components/SVG/icons/warning';

import Box from '../Box';
import Button from '../Button';
import Typography from '../Typography';

const AlertWrapper = styled.div`
  width: 560px;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 4px 0px 8px 0px rgba(0, 0, 0, 0.1), 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  .close {
    cursor: pointer;
  }
`;

interface IAlert {
  title: string;
  type: 'check' | 'error' | 'warning' | 'info' | 'success';
  alertType: 'alert' | 'confirm';
  description?: string;
  confirmText: string;
  onClose: () => void;
  onConfirm: () => void;
}

const Alert: React.FC<IAlert> = ({ title, type, alertType, description, confirmText, onClose, onConfirm }) => {
  return (
    <AlertWrapper>
      <Box display="flex" justifyContent="space-between" mb="24px">
        {(type === 'check' || type === 'success') && <CheckFilled width="32" height="32" color={theme.color.green500} />}
        {type === 'error' && <Warning width="32" height="32" color={theme.color.red500} />}
        {(type === 'warning' || type === 'info') && <Warning width="32" height="32" color={theme.color.primary500} />}
        <CloseRound className="close" width="24" height="24" color={theme.color.gray500} onClick={onClose} />
      </Box>
      <Typography fontSize={theme.fontSize.text24} fontWeight={theme.fontWeight.semiBold} mb="12px">
        {title}
      </Typography>
      {description && (
        <Typography fontSize={theme.fontSize.text16} mb="32px" lineHeight="24px">
          {parse(description)}
        </Typography>
      )}
      <Box display="flex" justifyContent="end">
        {alertType === 'confirm' && (
          <Button width="120px" size="m" variant="outline" color="neutral" mr="12px" onClick={onClose}>
            취소
          </Button>
        )}
        <Button
          width="120px"
          size="m"
          onClick={onConfirm}
          color={type === 'check' || type === 'warning' || type === 'success' || type === 'info' ? 'primary' : 'error'}
        >
          {confirmText}
        </Button>
      </Box>
    </AlertWrapper>
  );
};

export default Alert;
