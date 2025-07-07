function Notification({ message, isError }) {
  if (message === null) return null;
  
  const messageType = isError ? "error" : "info";
  return <div className={`banner ${messageType}`}>{message}</div>;
}

export default Notification;
