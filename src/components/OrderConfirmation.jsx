import React from "react";
import styles from "./styles/OrderConfirmation.module.css";

function OrderConfirmation({ order, status: orderStatus }) {
  if (orderStatus !== 500) {
    const { id, name, address, status } = order;
    const { items } = order;

    const updatedItems = items.map((item) => ({
      ...item,
      subtotal: item.item.price * item.quantity
    }));

    const listItems = updatedItems.map((item) => (
      <li key={item.item.id}>
        <div className={styles.item}>
          <h3>
            <b>{item.item.name}</b>
          </h3>
          <div className={styles.quantity}>
            <p>Item Price: ${item.item.price}</p>
            <p>Item Quantity: {item.quantity}</p>
            <p>Total Price: ${item.subtotal}</p>
          </div>
        </div>
        <br />
      </li>
    ));

    const subTotal = updatedItems.reduce(
      (item, nextItem) => item + nextItem.subtotal,
      0
    );
    const tax = subTotal * 0.05;
    const total = tax + subTotal;

    const fixedSubTotal = subTotal.toFixed(2);
    const fixedTax = tax.toFixed(2);
    const fixedTotal = total.toFixed(2);

    return (
      <div className={styles.container}>
        <div className={styles.subContainer}>
          <div>
            <h2>Thank you for your order, {name}!</h2>
          </div>
          <div className={styles.order}>
            <p>
              <b>Order ID:</b> {id}
            </p>

            <p>
              <b>Address:</b> {address}
            </p>

            <p>
              <b>Order Status:</b> {status}
            </p>
            <br />
            <ul>{listItems}</ul>
          </div>
          <div> Your Subtotal is: ${fixedSubTotal}</div>
          <div> Tax: ${fixedTax}</div>
          <div className={styles.emphasis}>
            {" "}
            <h3>Your Total: ${fixedTotal}</h3>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h3>Our apologies, no such order exists in our records.</h3>
      <p>Please try again.</p>
    </div>
  );
}

export default OrderConfirmation;
