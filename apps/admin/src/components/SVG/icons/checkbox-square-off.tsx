import React from 'react';

import SVG, { type ISVG } from '..';

const CheckboxSquareOff = ({ color, ...rest }: ISVG) => {
  return (
    <SVG
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...rest}
    >
      <g id="Type=r4, State=off">
        <rect
          id="Rectangle 311"
          x="0.5"
          y="0.5"
          width="23"
          height="23"
          rx="3.5"
          fill="white"
          stroke={color}
        />
      </g>
    </SVG>
  );
};

export default CheckboxSquareOff;
