import React from 'react';

import SVG, { type ISVG } from '..';

const Next = ({ color, ...rest }: ISVG) => {
  return (
    <SVG viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" {...rest}>
      <g id="icon_next">
        <path id="Vector 636" d="M8.5 5L15.5 12L8.5 19" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </SVG>
  );
};

export default Next;
