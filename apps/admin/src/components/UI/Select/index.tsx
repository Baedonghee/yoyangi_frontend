import React, { useEffect, useRef, useState } from 'react';
import { layout, LayoutProps, space, SpaceProps } from '@techstack/styled-system';
import classNames from 'classnames';
import styled from 'styled-components';
import { theme } from 'styles/theme';
import { IOption } from 'types/common';
import { useOnClickOutside } from 'usehooks-ts';

import Down from 'components/SVG/icons/down';
import Up from 'components/SVG/icons/up';

interface ISelect extends LayoutProps, SpaceProps {
  className?: string;
  list: IOption[];
  selectOption?: IOption | null;
  onClick?: (item: IOption) => void;
  placeholder?: string;
  size?: 'xs' | 's' | 'm' | 'l';
  disabled?: boolean;
  onlyBorder?: boolean;
  error?: string;
}

const SelectWrapper = styled.div<LayoutProps, SpaceProps>`
  ${layout}
  ${space}
  position: relative;
  cursor: pointer;
  .select {
    width: 100%;
    border-radius: 4px;
    border: 1px solid ${({ theme }) => theme.color.gray300};
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0px 16px;
    .icon {
      margin-right: 8px;
      display: flex;
    }
    span {
      font-size: ${({ theme }) => theme.fontSize.text14};
      font-weight: ${({ theme }) => theme.fontWeight.normal};
      color: ${({ theme }) => theme.color.gray900};
      display: flex;
      align-items: center;
      &.placeholder {
        color: ${({ theme }) => theme.color.gray400};
      }
    }
    &.xs {
      height: 32px;
      border-radius: 4px;
      svg {
        width: 16px;
        height: 16px;
      }
      span {
        font-size: ${({ theme }) => theme.fontSize.text12};
        &.placeholder {
          font-size: ${({ theme }) => theme.fontSize.text12};
        }
      }
    }
    &.s {
      height: 40px;
      svg {
        width: 20px;
        height: 20px;
      }
    }
    &.l {
      height: 52px;
    }
    &.disabled {
      background-color: ${({ theme }) => theme.color.gray100};
      color: ${({ theme }) => theme.color.gray400};
      cursor: not-allowed;
      span {
        color: ${({ theme }) => theme.color.gray400};
      }
    }
    &.error {
      border: 1px solid ${({ theme }) => theme.color.red500};
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
  ul {
    border-radius: 8px;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid ${({ theme }) => theme.color.gray300};
    top: 51px;
    left: 0;
    width: 100%;
    position: absolute;
    z-index: 10;
    background-color: ${({ theme }) => theme.color.white};
    &.xs {
      top: 36px;
      li {
        min-height: 32px;
      }
    }
    &.s {
      top: 48px;
      li {
        min-height: 44px;
      }
    }
    &.l {
      top: 56px;
      li {
        min-height: 52px;
      }
    }
    li {
      display: flex;
      align-items: center;
      width: 100%;
      min-height: 48px;
      padding: 0px 16px;
      font-size: ${({ theme }) => theme.fontSize.text14};
      color: ${({ theme }) => theme.color.gray900};
      cursor: pointer;
      font-weight: ${({ theme }) => theme.fontWeight.normal};
      .select-icon {
        margin-right: 8px;
        display: flex;
        align-items: center;
      }
      &:hover {
        &:first-child {
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        &:last-child {
          border-bottom-left-radius: 8px;
          border-bottom-right-radius: 8px;
        }
        background-color: ${({ theme }) => theme.color.gray50};
      }
    }
  }
`;

const Select: React.FC<ISelect> = ({ className, list, selectOption, onClick, placeholder, size = 'm', disabled, error, onlyBorder, ...props }) => {
  const selectRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLUListElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectOption) {
      const findOption = list.find((item) => item.value === selectOption?.value);
      if (findOption) {
        const index = list.indexOf(findOption);
        const ul = listRef.current;
        if (ul) {
          const liHeight = ul.querySelector('li')?.offsetHeight; // 각 li 요소의 높이를 가져옵니다.
          ul.scrollTop = index * (liHeight || 0); // 스크롤 위치를 조절합니다.
        }
      }
    }
  }, [list, selectOption, isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  useOnClickOutside(selectRef, handleClose);

  const handleOpen = () => {
    if (list.length && !disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOption = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, item: IOption) => {
    e.stopPropagation();
    setIsOpen(false);
    if (onClick) {
      onClick(item);
    }
  };

  return (
    <SelectWrapper {...props} className={className} ref={selectRef}>
      <div
        onClick={handleOpen}
        className={classNames('select', {
          [size]: size,
          disabled: !!disabled,
          error: !!error,
        })}
      >
        <span className={classNames({ placeholder: !selectOption })}>
          {selectOption?.icon && <div className="icon">{selectOption.icon}</div>}
          {selectOption ? selectOption.name : placeholder}
        </span>
        {isOpen ? (
          <Up width="24" height="24" color={disabled ? theme.color.gray400 : theme.color.gray600} />
        ) : (
          <Down width="24" height="24" color={disabled ? theme.color.gray400 : theme.color.gray600} />
        )}
      </div>
      {error && !onlyBorder && <p className="error">{error}</p>}
      <ul
        className={classNames({
          [size]: size,
        })}
        ref={listRef}
        style={{ visibility: isOpen ? 'visible' : 'hidden' }}
      >
        {list.map((item) => (
          <li key={`select-${item.value}`} onClick={(e) => handleOption(e, item)}>
            {item.icon && <div className="select-icon">{item.icon}</div>}
            {item.name}
          </li>
        ))}
      </ul>
    </SelectWrapper>
  );
};

export default Select;
