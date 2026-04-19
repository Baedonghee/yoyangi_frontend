import React from 'react';

import SVG, { type ISVG } from '..';

const CheckFilled = ({ color, fill = 'none', ...rest }: ISVG) => {
  return (
    <SVG
      viewBox="0 0 24 24"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...rest}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 24C18.627 24 24 18.6274 24 12C24 5.37256 18.627 0 12 0C5.37305 0 0 5.37256 0 12C0 18.6274 5.37305 24 12 24ZM18.2725 8.28845C18.5693 8.00006 18.5771 7.52527 18.2881 7.22791C18 6.93054 17.5254 6.92322 17.2275 7.21155L9.5 14.7053L6.27246 11.5752C6.11133 11.4188 5.89746 11.3494 5.68945 11.3661C5.51465 11.3801 5.34375 11.4555 5.21191 11.5916C4.92285 11.8889 4.93066 12.3637 5.22754 12.652L8.97754 16.2885C9.26855 16.5706 9.73145 16.5706 10.0225 16.2885L18.2725 8.28845Z"
        fill={color}
      />
    </SVG>
  );
};

export default CheckFilled;
