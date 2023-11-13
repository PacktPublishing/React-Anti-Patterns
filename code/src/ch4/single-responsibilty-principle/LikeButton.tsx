import React, {useState} from "react";

export const LikeButton: React.FC = () => {
  const [isLiked, setIsLiked] = useState(false);

  const handleClick = () => {
    setIsLiked(!isLiked);
  };

  return <button onClick={handleClick}>{isLiked ? "Unlike" : "Like"}</button>;
};