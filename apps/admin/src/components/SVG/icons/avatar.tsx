import React from 'react';

import SVG, { type ISVG } from '..';

const Avatar = ({ ...rest }: ISVG) => {
  return (
    <SVG viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" {...rest}>
      <g id="icon_avatar">
        <rect width="36" height="36" rx="18" fill="#F1F1F1" />
        <path
          id="Vector"
          d="M25.2008 26.1002V24.3002C25.2008 23.3454 24.8215 22.4297 24.1464 21.7546C23.4712 21.0795 22.5556 20.7002 21.6008 20.7002H14.4008C13.446 20.7002 12.5303 21.0795 11.8552 21.7546C11.1801 22.4297 10.8008 23.3454 10.8008 24.3002V26.1002"
          stroke="#C2C2C2"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="Vector_2"
          d="M18.0004 17.0999C19.9886 17.0999 21.6004 15.4881 21.6004 13.4999C21.6004 11.5117 19.9886 9.8999 18.0004 9.8999C16.0122 9.8999 14.4004 11.5117 14.4004 13.4999C14.4004 15.4881 16.0122 17.0999 18.0004 17.0999Z"
          stroke="#C2C2C2"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
    </SVG>
  );
};

export default Avatar;
