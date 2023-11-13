// @ts-ignore
import Tooltip from "@xui/tooltip";
import Avatar from "./Avatar";

const MyAvatar = () => (
  <Tooltip
    content="Juntao Qiu"
    position="top"
    css={{ color: "whitesmoke", backgroundColor: "blue" }}
  >
    <Avatar
      name="Juntao Qiu"
      url="https://avatars.githubusercontent.com/u/122324"
    />
  </Tooltip>
);

export default MyAvatar;
