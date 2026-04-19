import React from 'react';
import { layout, LayoutProps, space, SpaceProps } from '@techstack/styled-system';
import classNames from 'classnames';
import styled from 'styled-components';

interface IStyle {
  $borderRadius?: '4px' | '8px' | '30px' | '100px' | '4px !important' | '8px !important' | '30px !important' | '100px !important';
}

interface IButton extends LayoutProps, SpaceProps {
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  color?: 'primary' | 'neutral' | 'error';
  variant?: 'fill' | 'outline';
  size?: 'xs' | 's' | 'm' | 'l' | 'xl';
  children: React.ReactNode;
  icon?: 'left' | 'right';
  borderRadius?: '4px' | '8px' | '30px' | '100px' | '4px !important' | '8px !important' | '30px !important' | '100px !important';
}

type ButtonProps = IButton & React.ButtonHTMLAttributes<HTMLButtonElement>;

const ButtonWrapper = styled.button<ButtonProps & IStyle>`
  font-size: ${({ theme }) => theme.fontSize.text14};
  font-weight: ${({ theme }) => theme.fontWeight.normal};
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.color.white};
  border-radius: ${({ $borderRadius }) => $borderRadius};
  background-color: ${({ theme }) => theme.color.primary500};
  border: 1px solid ${({ theme }) => theme.color.primary500};
  ${layout}
  ${space}
  &:hover {
    background-color: ${({ theme }) => theme.color.primary700};
    border: 1px solid ${({ theme }) => theme.color.primary700};
  }
  &:disabled {
    background-color: ${({ theme }) => theme.color.gray200} !important;
    border: 1px solid ${({ theme }) => theme.color.gray200} !important;
    color: ${({ theme }) => theme.color.gray400} !important;
    cursor: not-allowed;
  }
  &.outline {
    background-color: ${({ theme }) => theme.color.white};
    color: ${({ theme }) => theme.color.primary500};
    &:hover {
      background-color: ${({ theme }) => theme.color.primary100};
      color: ${({ theme }) => theme.color.primary500};
    }
  }
  &.neutral {
    background-color: ${({ theme }) => theme.color.gray100};
    border: 1px solid ${({ theme }) => theme.color.gray100};
    color: ${({ theme }) => theme.color.gray900};
    &:hover {
      background-color: ${({ theme }) => theme.color.gray200};
      border: 1px solid ${({ theme }) => theme.color.gray200};
      color: ${({ theme }) => theme.color.gray900};
    }
    &.outline {
      border: 1px solid ${({ theme }) => theme.color.gray300};
      background-color: ${({ theme }) => theme.color.white};
      &:hover {
        background-color: ${({ theme }) => theme.color.gray100};
        border: 1px solid ${({ theme }) => theme.color.gray300};
      }
    }
  }
  &.error {
    background-color: ${({ theme }) => theme.color.red500};
    color: ${({ theme }) => theme.color.white};
    border: 1px solid ${({ theme }) => theme.color.red500};
    &:hover {
      background-color: ${({ theme }) => theme.color.red600};
      border: 1px solid ${({ theme }) => theme.color.red600};
    }
    &.outline {
      background-color: ${({ theme }) => theme.color.white};
      color: ${({ theme }) => theme.color.red500};
      border: 1px solid ${({ theme }) => theme.color.red500};
      &:hover {
        background-color: ${({ theme }) => theme.color.red50};
        border: 1px solid ${({ theme }) => theme.color.red500};
      }
    }
  }
  &.left {
    svg {
      margin-right: 8px;
    }
  }
  &.right {
    svg {
      margin-left: 8px;
    }
  }
  &.xs {
    height: 32px;
    font-size: ${({ theme }) => theme.fontSize.text12};
  }

  &.m {
    height: 48px;
  }
  &.s {
    height: 40px;
    border-radius: 4px;
  }
  &.l {
    height: 52px;
    font-size: ${({ theme }) => theme.fontSize.text16};
  }
  &.xl {
    height: 56px;
    font-size: ${({ theme }) => theme.fontSize.text18};
  }
`;

const Button: React.FC<ButtonProps & IStyle> = ({
  type = 'button',
  className,
  variant = 'fill',
  color = 'primary',
  size = 'm',
  children,
  borderRadius = '8px',
  icon = 'left',
  ...props
}) => {
  return (
    <ButtonWrapper
      type={type}
      className={classNames(className, {
        [variant]: true,
        [color]: true,
        [size]: true,
        [icon]: true,
      })}
      $borderRadius={borderRadius}
      {...props}
    >
      {children}
    </ButtonWrapper>
  );
};

export default Button;
