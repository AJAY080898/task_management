import { useSelector } from "react-redux";
import { Alert } from "react-bootstrap";

function Notification() {
  const notification = useSelector((state) => state.notification);

  if (!notification.message) return null;

  return <Alert variant={notification.type}>{notification.message}</Alert>;
}

export default Notification;
