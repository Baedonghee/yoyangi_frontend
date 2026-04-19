import SVG, { type ISVG } from '..';

const ArrowLeft = ({ color = 'black', ...rest }: ISVG) => {
  return (
    <SVG viewBox="0 0 12 24" fill="none" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" {...rest}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.843 11.289L7.5 5.632L8.914 7.046L3.964 11.996L8.914 16.946L7.5 18.36L1.843 12.703C1.65553 12.5155 1.55022 12.2612 1.55022 11.996C1.55022 11.7308 1.65553 11.4765 1.843 11.289Z"
        fill={color}
      />
    </SVG>
  );
};

export default ArrowLeft;
