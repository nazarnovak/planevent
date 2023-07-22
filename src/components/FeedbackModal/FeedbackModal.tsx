import { useEffect, useState } from "react";

import X from "../../images/x.svg";
import "./FeedbackModal.css";

interface FeedbackModalProps {
  modalOpen: boolean;
  onClose: () => void;
  setFeedbackSubmitted: () => void;
}

export const FeedbackModal = (props: FeedbackModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (props.modalOpen) {
      return;
    }

    setName("");
    setEmail("");
    setMessage("");
  }, [props.modalOpen]);

  const handleSend = () => {
    if (!message) {
      return;
    }

    fetch("https://planevent.me/api/contact", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, message }),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error("Something went wrong when submitting contact us");
      })
      .finally(() => {
        props.setFeedbackSubmitted();
      });
  };

  if (!props.modalOpen) {
    return null;
  }

  // Hack to hide scrollbar
  document.body.style.overflow = "hidden";

  return (
    <div className="backdrop" onClick={props.onClose}>
      <div
        className="modal"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="modal-header">
          <div className="modal-header-side"></div>
          <div className="modal-header-title">Contact us</div>
          <div className="modal-header-side">
            <img
              src={X}
              className="modal-x"
              alt="Close"
              onClick={props.onClose}
            ></img>
          </div>
        </div>
        <div id="contact-us-modal-body">
          Please consider{" "}
          <a
            href="https://buy.stripe.com/6oE7tu7UM3235dCeUU"
            rel="noreferrer"
            target="_blank"
          >
            donating
          </a>{" "}
          if you find the service useful. Your donations helps us pay the server
          cost ❤️
          <div id="contact-us-inputs">
            <input
              id="contact-name"
              type="text"
              name="name"
              placeholder="Name (optional)"
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setName(target.value);
              }}
            />
            <input
              id="contact-email"
              type="text"
              name="email"
              placeholder="Email (optional)"
              onChange={(e) => {
                const target = e.target as HTMLInputElement;
                setEmail(target.value);
              }}
            />
            <textarea
              id="contact-message"
              name="message"
              rows={5}
              placeholder="Share with us something you loved, want improved, think can be a great new feature, or isn't working"
              onChange={(e) => {
                const target = e.target as HTMLTextAreaElement;
                setMessage(target.value);
              }}
            ></textarea>
          </div>
        </div>
        <div
          id="share-feedback"
          className={"modal-footer" + (message ? "" : " disabled")}
          onClick={() => {
            handleSend();
          }}
        >
          Share feedback
        </div>
      </div>
    </div>
  );
};
