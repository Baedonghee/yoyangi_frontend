import React from 'react';

import SVG, { type ISVG } from '..';

const RadioOff = ({ color, ...rest }: ISVG) => {
  return (
    <SVG
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...rest}
    >
      <g id="State=off">
        <circle id="Ellipse 2" cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
      </g>
    </SVG>
  );
};

export default RadioOff;
