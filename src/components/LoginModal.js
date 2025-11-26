import React from "react";
import Login from "./Login";

const LoginModal = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <>
      <div
        className="login-modal modal d-block"
        tabIndex="-1"
        role="dialog"
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content mx-auto">
            <Login />
          </div>
        </div>
      </div>
      <div className="modal-backdrop show" onClick={onClose} />
    </>
  );
};

export default LoginModal;
