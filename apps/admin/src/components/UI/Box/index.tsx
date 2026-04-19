import {
  border,
  BorderProps,
  color,
  ColorProps,
  flexbox,
  FlexboxProps,
  layout,
  LayoutProps,
  other,
  OtherProps,
  position,
  PositionProps,
  shadow,
  ShadowProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from '@techstack/styled-system';
import styled from 'styled-components';

type BoxProps = SpaceProps & LayoutProps & ColorProps & FlexboxProps & BorderProps & PositionProps & ShadowProps & TypographyProps & OtherProps;

const Box = styled.div<BoxProps>`
  ${space}
  ${layout}
  ${color}
  ${flexbox}
  ${border}
  ${position}
  ${shadow}
  ${typography}
  ${other}
`;

export default Box;
