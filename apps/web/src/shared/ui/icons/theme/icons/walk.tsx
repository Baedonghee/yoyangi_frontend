import SVG, { type ISVG } from '..';

const Downtown = ({ ...rest }: ISVG) => {
  return (
    <SVG
      viewBox="0 0 58 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      {...rest}
    >
      <path
        d="M28.8204 44.4908V21.6398"
        stroke="#A3FF82"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.3362 14.0026C13.3362 14.0026 18.3845 24.4433 28.8204 20.9162C24.4106 10.7568 13.3362 14.0026 13.3362 14.0026Z"
        stroke="#A3FF82"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44.3047 14.0026C44.3047 14.0026 39.2563 24.4433 28.8204 20.9162C33.2302 10.7568 44.3047 14.0026 44.3047 14.0026Z"
        stroke="#A3FF82"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.99539 44.4907H53.0046"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </SVG>
  );
};

export default Downtown;
