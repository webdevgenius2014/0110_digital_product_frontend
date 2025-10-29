import React, { useState } from "react";
import { createPortal } from "react-dom";

interface CollaboratePopupProps {
   isOpen: boolean;
   onClose: () => void;
}

const CollaboratePopup: React.FC<CollaboratePopupProps> = ({ isOpen, onClose }) => {
   const [showSuccess, setShowSuccess] = useState(false);

   if (!isOpen) return null;

   if (showSuccess) {
      return createPortal(
         <div
            className="fixed inset-0 bg-black/50 backdrop-blur-[5px] flex items-center justify-center z-50"
            onClick={onClose}
         >
            <div className="bg-white rounded-sm text-center px-10 py-10 w-[95%] md:w-full max-w-[480px] shadow-lg">
               <p className="text-base leading-6 font-dm-regular text-[#060606]">
                  Message sent.
               </p>
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
            className="bg-white rounded-sm text-center px-10 py-10 w-[95%] md:w-full space-y-10 max-w-[480px] shadow-lg relative"
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
                  <input
                     type="email"
                     defaultValue="your@email.com"
                     className="w-full border-b-2 text-base leading-6 font-dm-Medium text-[#616161] border-[#9AA0A6] h-12 bg-[#F1F5F8] rounded-sm px-3 py-2 focus:outline-none text-center"
                  />

                  <textarea
                     defaultValue="Optional message"
                     className="w-full border-b-2 text-base leading-6 font-dm-Medium resize-none text-[#616161] border-[#9AA0A6] h-12 bg-[#F1F5F8] rounded-sm px-3 py-2 focus:outline-none text-center"
                     style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
                  />

                  <div className="p-px rounded-sm text-base leading-6 bg-gradient-to-b from-[#737373] to-[#0E0E0E]">
                     <button
                        type="button"
                        onClick={() => setShowSuccess(true)}
                        className="w-full cursor-pointer bg-[#232323] text-white rounded-sm py-2 font-medium hover:bg-[#2f2f2f] transition"
                     >
                        Send
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

            {/* Optional close X */}
            {/* <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button> */}
         </div>
      </div>,
      document.body
   );
};

export default CollaboratePopup;