type AvatarProps = {
  name?: string;
  url: string;
};

const Avatar = ({ name = "", url }: AvatarProps) => (
  <div className="rounded">
    <img src={url} alt={name} title={name} />
  </div>
);

export default Avatar;
