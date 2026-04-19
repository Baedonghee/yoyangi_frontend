import React from 'react';
import { flexbox, FlexboxProps, layout, LayoutProps, space, SpaceProps } from '@techstack/styled-system';
import classNames from 'classnames';
import styled from 'styled-components';
import RadioOn from 'components/SVG/icons/radio-on';
import RadioOff from 'components/SVG/icons/radio-off';
import { theme } from 'styles/theme';

interface IRadio extends LayoutProps, SpaceProps, FlexboxProps {
  checked?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  disabled?: boolean;
}

type StyledTypes = LayoutProps & SpaceProps & FlexboxProps;

const RadioWrapper = styled.div<StyledTypes>`
  ${layout}
  ${space}
  ${flexbox}
  cursor: pointer;
  display: flex;
`;

const Radio: React.FC<IRadio> = ({ checked = false, className, onClick, disabled = false, width = '24px', height = '24px', ...props }) => {
  const onCheckClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (disabled) {
      return;
    }
    if (onClick) {
      onClick(e);
    }
  };
  return (
    <RadioWrapper onClick={onCheckClick} className={classNames(className)} {...props}>
      {checked ? (
        <RadioOn width={width as string} height={height as string} color={theme.color.black} />
      ) : (
        <RadioOff width="24" height="24" color={theme.color.black} />
      )}
    </RadioWrapper>
  );
};

export default Radio;
