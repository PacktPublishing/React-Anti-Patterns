// @ts-ignore
import { Button } from "xui/button";

type FancyButtonProps = {
  onClick: (e: any) => void;
}

const FancyButton = ({
  onClick: originalOnClick,
  ...rest
}: FancyButtonProps) => {
  const onClick = (e: any) => {
    //emit an event to the analytic server
    console.log('sending analytics event to a remote server');
    return originalOnClick(e);
  };

  return <Button onClick={onClick} {...rest} />;
};

export default FancyButton;
