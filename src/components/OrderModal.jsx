import React, { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./styles/OrderModal.module.css";

function OrderModal({ order, setOrderModal }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const placeOrder = async () => {
    const formatPhone = (numbers) => {
      const areaCode = numbers[0].concat(numbers[1], numbers[2]);
      const telPrefix = numbers[3].concat(numbers[4], numbers[5]);
      const lineNumber = numbers[6].concat(numbers[7], numbers[8], numbers[9]);
      return `(${areaCode}) ${telPrefix}-${lineNumber}`;
    };

    const phoneLength = phone.replace(/\D+/g, "").length;

    setError([]);
    const errorProperties = {
      name,
      phone,
      address,
      phoneLength
    };
    const errorList = [];
    if (!errorProperties.name) errorList.push("name");
    if (!errorProperties.phone) errorList.push("noPhone");
    if (!errorProperties.address) errorList.push("address");
    if (errorProperties.phoneLength < 10) errorList.push("phoneLength");
    setError(errorList);

    if (errorList.length > 0) {
      return;
    }

    setSubmitted(true);
    const formattedPhone = formatPhone(phone.toString());
    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        phone: formattedPhone,
        address,
        items: order
      })
    });
    const data = await response.json();
    const orderId = await data.id;
    if (response.ok) {
      navigate(`/order-confirmation/${orderId}`);
    }
    setSubmitted("error");
  };

  const addressLabel = error.includes("address")
    ? "Address: don't forget me!"
    : "Address";
  let phoneLabel;
  if (error.includes("noPhone")) {
    phoneLabel = "Phone: don't forget me!";
  } else if (error.includes("phoneLength")) {
    phoneLabel = "Phone: your number must be at least 10 digits";
  } else phoneLabel = "Phone";
  const nameLabel = error.includes("name") ? "Name: don't forget me!" : "Name";
  return (
    <>
      <div
        label="Close"
        className={styles.orderModal}
        onKeyPress={(e) => {
          if (e.key === "Escape") {
            setOrderModal(false);
          }
        }}
        onClick={() => setOrderModal(false)}
        role="menuitem"
        tabIndex={0}
      />
      <div className={styles.orderModalContent}>
        <h2>Place Order</h2>
        <form className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">
              {nameLabel}
              <input
                required
                onChange={(e) => {
                  e.preventDefault();
                  setName(e.target.value);
                }}
                type="text"
                id="name"
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="phone">
              {phoneLabel}
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setPhone(e.target.value);
                }}
                type="phone"
                id="phone"
              />
            </label>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="address">
              {addressLabel}
              <input
                onChange={(e) => {
                  e.preventDefault();
                  setAddress(e.target.value);
                }}
                type="phone"
                id="address"
              />
            </label>
          </div>
        </form>
        <div
          id={
            error.length > 0
              ? styles.error_message_displayed
              : styles.message_hidden
          }
        >
          <p>Please fill out all the fields!</p>
        </div>

        <div
          id={
            submitted === "error"
              ? styles.error_message_displayed
              : styles.message_hidden
          }
        >
          <p>There was an issue submitting your order. Please try again.</p>
        </div>
        <div
          id={
            submitted && submitted !== "error"
              ? styles.inProgress
              : styles.message_hidden
          }
        >
          <h2>Your order is being processed</h2>
        </div>
        <br />
        <div className={styles.orderModalButtons}>
          <button
            className={styles.orderModalClose}
            onClick={() => setOrderModal(false)}
          >
            Close
          </button>
          <button
            type="submit"
            onClick={() => {
              placeOrder();
            }}
            className={styles.orderModalPlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  );
}

export default OrderModal;
