import React, { useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";

interface CollaboratePopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CollaboratePopup: React.FC<CollaboratePopupProps> = ({ isOpen, onClose }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);


  function handleEmail(data: any) {
    setEmail(data.target.value);
  }

  function handleMessage(data: any) {
    setMessage(data.target.value);
  }

  function handleUsername(data: any) {
    setUsername(data.target.value);
  }

  async function handleSend() {
    // if (loading) return;

    // setLoading(true);

    // const payload = {
    //   name: "Test user",
    //   email: email,
    //   message: message,
    // };

    // try {
    //   const response = await axios.post("http://69.62.85.124:3054/api/email/contact", payload, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   });

    //   console.log("API Response:", response.data);

    //   setShowSuccess(true);
    // } catch (error) {
    //   console.error("Error sending message:", error);
    //   alert("Something went wrong. Please try again later.");
    // } finally {
    //   setLoading(false);
    // }
  }

  if (!isOpen) return null;

  if (showSuccess) {
    return createPortal(
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-[5px] flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div className="bg-white rounded-sm text-center px-10 py-10 w-[95%] md:w-full max-w-[480px] shadow-lg">
          <p className="text-base leading-6 font-dm-regular text-[#060606]">Message sent.</p>
        </div>
      </div>,
      document.body
    );
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-[5px] flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-sm text-center lg:px-10 lg:py-10 px-6 pt-6 pb-8 w-[95%] md:w-full space-y-10 max-w-[480px] shadow-lg relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="md:text-[50px] text-[30px] text-[#060606] font-dm-regular tracking-[-0.25px] md:leading-[60px]">
          Let’s collaborate.
        </h2>

        <div className="max-h-[calc(100vh-190px)] overflow-y-auto overflow-x-hidden space-y-10">
          <p className="text-base font-dm-Medium text-[#060606]">
            Leave your email and we’ll get in touch.
          </p>

          <form className="space-y-10" onSubmit={(e) => e.preventDefault()}>
            <div className="relative w-full">
              <input
                type="name"
                placeholder="username"
                onChange={(data) => handleUsername(data)}
                value={username}
                className="w-full text-base leading-6 font-dm-Medium text-[#616161] h-12 bg-[#F1F5F8] rounded-sm px-3 py-2 focus:outline-none text-center"
              />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#9AA0A6]" />
            </div>
            <div className="relative w-full">
              <input
                type="email"
                placeholder="your@email.com"
                onChange={(data) => handleEmail(data)}
                value={email}
                className="w-full text-base leading-6 font-dm-Medium text-[#616161] h-12 bg-[#F1F5F8] rounded-sm px-3 py-2 focus:outline-none text-center"
              />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#9AA0A6]" />
            </div>

            <div className="relative w-full mt-4">
              <textarea
                placeholder="Optional"
                onChange={(data) => handleMessage(data)}
                value={message}
                className="w-full text-base leading-6 font-dm-Medium resize-none text-[#616161] h-12 bg-[#F1F5F8] rounded-sm px-3 py-2 focus:outline-none text-center flex items-center justify-center"
              />
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#9AA0A6]" />
            </div>

            <div className="p-px rounded-sm text-base leading-6 bg-linear-to-b from-[#737373] to-[#0E0E0E]">
              <button
                type="button"
                onClick={handleSend}
                disabled={loading}
                className={`w-full cursor-pointer ${
                  loading ? "bg-[#555]" : "bg-[#232323] hover:bg-[#2f2f2f]"
                } text-white rounded-sm py-2 font-medium transition`}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </div>
          </form>

          <p className="text-[#060606] text-base leading-6 text-center">
            or email us directly:{" "}
            <a href="mailto:hello@0110.sport" className="underline">
              hello@0110.sport
            </a>
          </p>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CollaboratePopup;
