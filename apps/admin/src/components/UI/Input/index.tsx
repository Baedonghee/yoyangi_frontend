import React, { forwardRef } from 'react';
import { RegisterOptions, UseFormRegister } from 'react-hook-form';
import classNames from 'classnames';
import styled from 'styled-components';

interface IStyle {
  width?: string;
  m?: string;
  mb?: string;
  ml?: string;
  mr?: string;
  mt?: string;
  p?: string;
  pb?: string;
  pl?: string;
  pr?: string;
  pt?: string;
  size?: 'xs' | 's' | 'm' | 'l';
}

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  register?: UseFormRegister<any>;
  error?: string;
  options?: RegisterOptions;
  className?: string;
  icon?: React.ReactNode;
  success?: string;
  onlyBorder?: boolean;
  iconAlign?: 'none' | 'left' | 'right';
}

type InputProps = {
  size?: 'xs' | 's' | 'm' | 'l';
} & Omit<IInput, 'size'>;

const InputWrapper = styled.div<IStyle>`
  width: ${({ width }) => width};
  ${({ m }) => (m ? `margin: ${m}` : null)};
  ${({ mb }) => (mb ? `margin-bottom: ${mb}` : null)};
  ${({ ml }) => (ml ? `margin-left: ${ml}` : null)};
  ${({ mr }) => (mr ? `margin-right: ${mr}` : null)};
  ${({ mt }) => (mt ? `margin-top: ${mt}` : null)};
  ${({ p }) => (p ? `padding: ${p}` : null)};
  ${({ pb }) => (pb ? `padding-bottom: ${pb}` : null)};
  ${({ pl }) => (pl ? `padding-left: ${pl}` : null)};
  ${({ pr }) => (pr ? `padding-right: ${pr}` : null)};
  ${({ pt }) => (pt ? `padding-top: ${pt}` : null)};
  position: relative;
  & > div {
    position: relative;
    width: 100%;
    &.left {
      input {
        padding: 0px 16px 0px 44px;
      }
      svg {
        left: 16px;
        right: auto;
      }
    }
    &.right {
      input {
        padding: 0px 44px 0px 16px;
      }
    }
    input {
      width: 100%;
      height: 48px;
      padding: 0 16px;
      border: none;
      border-radius: 8px;
      font-size: ${({ theme }) => theme.fontSize.text14};
      font-weight: ${({ theme }) => theme.fontWeight.normal};
      color: ${({ theme }) => theme.color.black};
      border: 1px solid ${({ theme }) => theme.color.gray300};
      border-radius: 8px;
      &::placeholder {
        color: ${({ theme }) => theme.color.gray400};
      }
      &:focus {
        border: 1px solid ${({ theme }) => theme.color.gray900};
      }
      &:disabled {
        background-color: ${({ theme }) => theme.color.gray100};
        border: 1px solid ${({ theme }) => theme.color.gray300};
        color: ${({ theme }) => theme.color.gray400};
      }
      &.xs {
        height: 32px;
        border-radius: 4px;
        font-size: ${({ theme }) => theme.fontSize.text12};
      }
      &.s {
        height: 40px;
        border-radius: 4px;
      }
      &.l {
        height: 52px;
        font-size: ${({ theme }) => theme.fontSize.text16};
      }
      &.success {
        border: 1px solid ${({ theme }) => theme.color.green500};
      }
      &.error {
        border: 1px solid ${({ theme }) => theme.color.red500};
      }
    }
    svg {
      position: absolute;
      top: 50%;
      right: 16px;
      transform: translateY(-50%);
      cursor: pointer;
    }
  }
  p {
    margin-top: 4px;
    font-size: ${({ theme }) => theme.fontSize.text12};
    font-weight: ${({ theme }) => theme.fontWeight.normal};
    text-align: left;
    &.success {
      color: ${({ theme }) => theme.color.green500};
    }
    &.error {
      color: ${({ theme }) => theme.color.red500};
    }
  }
`;

type IInputProps = IStyle & InputProps;

const Input: React.ForwardRefRenderFunction<HTMLInputElement, IInputProps> = (
  {
    name,
    register,
    options,
    size = 'm',
    width = '208px',
    m,
    mb,
    ml,
    mr,
    mt,
    p,
    pb,
    pl,
    pr,
    pt,
    className,
    error,
    success,
    icon,
    iconAlign = 'none',
    onlyBorder,
    ...props
  },
  ref,
) => {
  return (
    <InputWrapper width={width} m={m} mb={mb} ml={ml} mr={mr} mt={mt} p={p} pb={pb} pl={pl} pr={pr} pt={pt}>
      <div className={classNames({ [iconAlign]: iconAlign })}>
        {register ? (
          <input
            id={name}
            className={classNames(className, {
              error,
              success,
              icon: !!icon,
              [size]: size,
            })}
            {...register(name, options)}
            {...props}
          />
        ) : (
          <input
            id={name}
            name={name}
            className={classNames(className, {
              error,
              success,
              icon: !!icon,
              [size]: size,
            })}
            ref={ref}
            {...props}
          />
        )}
        {icon && icon}
      </div>
      {success && <p className="success">{success}</p>}
      {error && !onlyBorder && <p className="error">{error}</p>}
    </InputWrapper>
  );
};

export default forwardRef(Input);
