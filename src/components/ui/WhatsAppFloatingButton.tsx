import React from 'react';

const WhatsAppFloatingButton: React.FC = () => {
  return (
    <a
      href="https://wa.me/8184932229" // Replace with your WhatsApp number
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50"
    >
      <img
        src="/images/whatsapp-icon.png" // Place this icon in your public folder
        alt="WhatsApp"
        className="w-14 h-14"
      />
    </a>
  );
};

export default WhatsAppFloatingButton;
