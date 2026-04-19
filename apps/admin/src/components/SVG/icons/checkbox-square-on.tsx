import React from 'react';

import SVG, { type ISVG } from '..';

const CheckboxSquareOn = ({ color, ...rest }: ISVG) => {
  return (
    <SVG
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...rest}
    >
      <g id="Type=r4, State=on">
        <path
          id="Subtract"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M4 0C1.79086 0 0 1.79086 0 4V20C0 22.2091 1.79086 24 4 24H20C22.2091 24 24 22.2091 24 20V4C24 1.79086 22.2091 0 20 0H4ZM18.2721 8.28843C18.5695 8.00007 18.5768 7.52526 18.2884 7.22789C18.0001 6.93053 17.5253 6.92322 17.2279 7.21158L9.5 14.7053L6.27211 11.5752C5.97475 11.2869 5.49993 11.2942 5.21158 11.5915C4.92322 11.8889 4.93053 12.3637 5.22789 12.6521L8.97789 16.2884C9.26881 16.5705 9.73119 16.5705 10.0221 16.2884L18.2721 8.28843Z"
          fill={color}
        />
      </g>
    </SVG>
  );
};

export default CheckboxSquareOn;
