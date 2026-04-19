import React from 'react';

import SVG, { type ISVG } from '..';

const CheckboxCircleOn = ({ color, ...rest }: ISVG) => {
  return (
    <SVG
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...rest}
    >
      <g id="Type=r100, State=on">
        <rect width="24" height="24" rx="12" fill={color} />
        <path
          id="vector"
          d="M18 8L9.75 16L6 12.3636"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </SVG>
  );
};

export default CheckboxCircleOn;
