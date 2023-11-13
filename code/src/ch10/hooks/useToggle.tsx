import {useState} from "react";

const useToggle = (init: boolean) => {
  const [toggle, setToggle] = useState<boolean>(init);

  return {
    toggle,
    setToggle
  }
}

export default useToggle;