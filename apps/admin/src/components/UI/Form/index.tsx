import React, { ReactComponentElement } from 'react';

interface IForm extends React.FormHTMLAttributes<HTMLFormElement> {
  /** 폼 타이틀 */
  title: string;
  /** 폼 내용 */
  children: React.ReactNode;
}

const Form = ({ title, children, ...props }: IForm) => {
  return (
    <form {...props}>
      <fieldset>
        <legend className="visually-hidden">{title}</legend>
      </fieldset>
      {children}
    </form>
  );
};

export default Form;
