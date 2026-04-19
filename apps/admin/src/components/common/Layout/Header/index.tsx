import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthActions from 'actions/auth-actions';
import { useRecoilValue } from 'recoil';
import { authUserSelector } from 'stores/auth';
import { theme } from 'styles/theme';
import { PATH } from 'utils/path';

import Avatar from 'components/SVG/icons/avatar';
import Box from 'components/UI/Box';
import Button from 'components/UI/Button';
import Typography from 'components/UI/Typography';

const MyHeader = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(authUserSelector);
  const { logout } = useAuthActions();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate(PATH.LOGIN);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="end"
      p="9px 40px 10px"
      alignItems="center"
      width="100%"
      position="sticky"
      top="0px"
      left="0px"
      height="60px"
      borderBottom={`1px solid ${theme.color.gray300}`}
    >
      <Box display="flex" alignItems="center" mr="24px">
        <Avatar width="36" height="36" />
        <Box ml="12px">
          <Typography fontSize={theme.fontSize.text14} fontWeight={theme.fontWeight.semiBold} color={theme.color.gray900} mb="2px" lineHeight="17px">
            {user?.email}
          </Typography>
          <Typography fontSize={theme.fontSize.text12} color={theme.color.gray700}>
            {user?.profile.name}
          </Typography>
        </Box>
      </Box>
      <Button width="81px" color="neutral" variant="outline" size="s" onClick={handleLogout}>
        로그아웃
      </Button>
    </Box>
  );
};

export default MyHeader;
