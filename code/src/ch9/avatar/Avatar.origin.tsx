// @ts-ignore
import Tooltip from "@xui/tooltip";

type AvatarProps = {
  name?: string;
  url: string;
};

const Avatar = ({ name, url }: AvatarProps) => {
  if (name) {
    return (
      <Tooltip content={name}>
        <div className="rounded">
          <img src={url} alt={name} />
        </div>
      </Tooltip>
    );
  }
  return (
    <div className="rounded">
      <img src={url} alt="" />
    </div>
  );
};


export default Avatar;
