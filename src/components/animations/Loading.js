import './Loading.css';
import useRandomMessage from "./useRandomMessage";
const Loading = () => {
    const randomMessage = useRandomMessage();
  return (
    <div className="loading-container">
      <div className="orbit-loader">
        <div className="orbit">
          <div className="flying-plane">✈️</div>
        </div>
      </div>
      <h3 className="loading-title">{randomMessage}</h3>
    </div>
  );
};

export default Loading;