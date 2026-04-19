import Box from 'components/UI/Box';
import Typography from 'components/UI/Typography';
import React, { Fragment } from 'react';
import { theme } from 'styles/theme';

interface IPageHeader {
  title: string;
}

const PageHeader: React.FC<IPageHeader> = ({ title }) => {
  return (
    <Box display="flex" alignItems="center">
      <Typography fontSize={theme.fontSize.text20} fontWeight={theme.fontWeight.bold} color={theme.color.gray900}>
        {title}
      </Typography>
    </Box>
  );
};

export default PageHeader;
