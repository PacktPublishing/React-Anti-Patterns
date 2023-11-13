import {ButtonProps} from "../types";

const Button = ({ onClick: provided, name, ...rest }: ButtonProps) => {
  const onClick = (e: any) => {
    return provided?.(e);
  };
  return <button onClick={onClick} {...rest} />;
};

export default Button;