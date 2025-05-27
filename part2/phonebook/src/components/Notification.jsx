const Notification = ({ message, isError }) => {
  const classes = isError ? "notification error" : "notification";
  return message !== null && <div className={classes}>{message}</div>;
};

export default Notification;
