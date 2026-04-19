import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { PATH } from 'utils/path';

import Box from 'components/UI/Box';
import Button from 'components/UI/Button';
import Typography from 'components/UI/Typography';

const NotFoundWrapper = styled(Box)`
  height: 100vh;
  display: flex;
  img {
    width: 280px;
    height: 260px;
  }
`;

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const onBack = () => {
    if (location.key !== 'default') {
      navigate(-1);
      return;
    }
    navigate(PATH.MAIN);
  };
  return (
    <NotFoundWrapper>
      <Box width="498px" margin="auto">
        <Box display="flex" justifyContent="center">
          <img src="/images/not-found/cover.png" alt="404이미지" />
        </Box>
        <Typography fontSize={theme.fontSize.text20} fontWeight={theme.fontWeight.bold} color={theme.color.black} mt="32px" textAlign="center">
          죄송합니다. 해당 페이지를 찾을 수 없습니다
        </Typography>
        <Typography fontSize={theme.fontSize.text14} color={theme.color.gray700} mt="16px" textAlign="center">
          찾으시는 주소가 잘못 입력되었거나, 요청하신 주소가 변경 또는 삭제되어 찾을 수 없습니다.
        </Typography>
        <Typography fontSize={theme.fontSize.text14} color={theme.color.gray700} mt="8px" textAlign="center">
          올바른 주소를 입력하였는지 한 번 더 확인해 주세요. 감사합니다
        </Typography>
        <Box display="flex" mt="24px" justifyContent="center">
          <Link to={PATH.MAIN} style={{ marginRight: '16px' }}>
            <Button variant="outline" size="s" width="120px">
              메인으로
            </Button>
          </Link>
          <Button size="s" width="120px" onClick={onBack}>
            이전으로
          </Button>
        </Box>
      </Box>
    </NotFoundWrapper>
  );
};

export default NotFound;
