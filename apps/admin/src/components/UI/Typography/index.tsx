import {
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  LayoutProps,
  space,
  SpaceProps,
  typography,
  TypographyProps
} from '@techstack/styled-system';
import styled from 'styled-components';

type ITypographyProps = SpaceProps & LayoutProps & ColorProps & FlexboxProps & TypographyProps;

const Typography = styled.div<ITypographyProps>`
  ${space}
  ${color}
  ${flexbox}
  ${typography}
`;

export default Typography;
