import { useState, useEffect } from "react";
import { useParams } from "react-router";
import OrderConfirmation from "./OrderConfirmation";
import styles from "./styles/OrderConfirmation.module.css";

function ConfirmationPage() {
  const [order, setOrder] = useState();
  const [status, setStatus] = useState();
  const { id } = useParams();

  const getOrder = async () => {
    const response = await fetch(`/api/orders/${id}`);
    const data = await response.json();
    const responseStatus = response.status;
    setOrder(data);
    setStatus(responseStatus);
  };

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <div>
      {!order && (
        <div className={styles.container}>
          <h2>Fetching Order information...</h2>
        </div>
      )}
      {order && <OrderConfirmation order={order} status={status} />}
    </div>
  );
}

export default ConfirmationPage;
