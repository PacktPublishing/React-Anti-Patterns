import './Loading.css';
import loading from './loading.png';

const Loading = () => {
  return (<div className="loading" >
    <img src={loading} alt="" className="rotate-animation" />
  </div>)
}

export default Loading;