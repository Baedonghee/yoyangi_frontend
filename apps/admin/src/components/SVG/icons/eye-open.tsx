import React from 'react';

import SVG, { type ISVG } from '..';

const EyeOpen = ({ color, ...rest }: ISVG) => {
  return (
    <SVG viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" {...rest}>
      <g id="icon/eye_open">
        <path
          id="Icon"
          d="M11.9999 18.8556C19.323 18.9754 21.5999 12.119 21.5999 12.119C21.5999 12.119 19.4153 5.14288 11.9999 5.14288C4.58452 5.14288 2.3999 12.119 2.3999 12.119C2.3999 12.119 4.67683 18.7359 11.9999 18.8556Z"
          stroke={color}
          strokeWidth="2"
        />
        <path
          id="Icon_2"
          d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
          stroke={color}
          strokeWidth="2"
        />
      </g>
    </SVG>
  );
};

export default EyeOpen;
