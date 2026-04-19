import Box from 'components/UI/Box';
import Button from 'components/UI/Button';
import React from 'react';

const PageButton = () => {
  return (
    <Box display="flex" justifyContent="end" alignItems="center" mt="32px">
      <Button size="xs" width="80px">
        엑셀 다운로드
      </Button>
    </Box>
  );
};

export default PageButton;
