import "./Error.css";
import error from "./error.png";

const Error = () => {
  return (
    <div className="error">
      <img src={error} alt="" />
      <p>Something went wrong</p>
    </div>
  );
};

export default Error;
