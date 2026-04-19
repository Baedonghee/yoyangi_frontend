import React from 'react';

import SVG, { type ISVG } from '..';

const Prev = ({ color, ...rest }: ISVG) => {
  return (
    <SVG viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" {...rest}>
      <g id="icon_prev">
        <path id="Vector 638" d="M15.5 5L8.5 12L15.5 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </SVG>
  );
};

export default Prev;
