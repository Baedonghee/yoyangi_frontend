import { useAlert } from 'providers/alert.provider';
import React, { useRef } from 'react';
import styled from 'styled-components';
import { useOnClickOutside } from 'usehooks-ts';

interface IModalContainer {
  children: string | JSX.Element | JSX.Element[];
  scroll?: boolean;
  width?: string;
  onClose: () => void;
}

const ModalWrapper = styled.div<{ width?: string; scroll?: string }>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9998;
  display: block;
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: auto;
  outline: 0;
  ${({ scroll }) => (scroll ? 'background-color: rgba(0, 0, 0, 0.7);' : '')};
  .overlay {
    background-color: rgba(0, 0, 0, 0.7);
    width: 100%;
    height: 100%;
  }
  .modal-main {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: ${({ theme }) => theme.color.white};
    border-radius: 12px;
    box-shadow: 4px 0px 8px 0px rgba(0, 0, 0, 0.1), 0px 4px 8px 0px rgba(0, 0, 0, 0.1);
  }
  .modal-dialog {
    z-index: 999;
    min-height: calc(100% - 100px);
    height: calc(100% - 100px);
    max-width: ${({ width }) => width || '500px'};
    margin: 30px auto;
    display: flex;
    align-items: center;
    position: relative;
    width: auto;
    .modal-content {
      max-height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      pointer-events: auto;
      background-clip: padding-box;
      outline: 0;
      border-radius: 10px;
    }
  }
`;

const ModalContainer = ({ children, scroll = false, width = 'auto', onClose }: IModalContainer) => {
  const { alert } = useAlert();

  const ref = useRef(null);

  const handleClickOutside = () => {
    if (onClose && !alert?.open) {
      onClose();
    }
  };

  useOnClickOutside(ref, handleClickOutside);

  if (scroll) {
    return (
      <ModalWrapper width={width} scroll={scroll ? 'scroll' : ''}>
        <div className="modal-dialog" ref={ref}>
          <div className="modal-content">{children}</div>
        </div>
      </ModalWrapper>
    );
  }

  return (
    <ModalWrapper>
      <div className="overlay" onClick={onClose}></div>
      <div className="modal-main">{children}</div>
    </ModalWrapper>
  );
};

export default ModalContainer;
