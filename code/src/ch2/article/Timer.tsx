import {useEffect} from "react";

const Timer = () => {
  useEffect(() => {
    const timerId = setTimeout(() => {
      console.log("time is up")
    }, 1000);

    return () => {
      clearTimeout(timerId)
    }
  }, [])

  return <div>
    Hello timer
  </div>
}

export default Timer;