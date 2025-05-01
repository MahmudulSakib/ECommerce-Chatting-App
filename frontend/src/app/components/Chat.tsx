// "use client";
// import { useState, useEffect } from "react";
// import { io } from "socket.io-client";

// // Message type
// type Message = {
//   from: "User" | "Admin";
//   text: string;
// };

// const socket = io("http://localhost:5000");

// export default function Chat() {
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [input, setInput] = useState<string>("");
//   const [name, setName] = useState<string>("");
//   const [email, setEmail] = useState<string>("");

//   useEffect(() => {
//     socket.on("admin-reply", (msg: string) => {
//       setMessages((msgs) => [...msgs, { from: "Admin", text: msg }]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const toggleChatbox = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (name && email) {
//       setIsFormCompleted(true);
//     }
//   };

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     socket.emit("user-message", { name, email, input });
//     setMessages((msgs) => [...msgs, { from: "User", text: input }]);
//     setInput("");
//   };

//   return (
//     <div>
//       {/* Floating chat button */}
//       <button
//         onClick={toggleChatbox}
//         className="fixed bottom-8 right-8 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
//       >
//         💬
//       </button>

//       {/* Chatbox */}
//       {isOpen && (
//         <div className="fixed bottom-30 right-8 w-80 bg-white shadow-lg rounded-lg border border-gray-300">
//           {!isFormCompleted ? (
//             <div className="p-4">
//               <h3 className="font-semibold text-lg mb-4">Enter Your Details</h3>
//               <form onSubmit={handleFormSubmit}>
//                 <div className="mb-4">
//                   <label htmlFor="name" className="block text-gray-700">
//                     Name
//                   </label>
//                   <input
//                     type="text"
//                     id="name"
//                     value={name}
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                       setName(e.target.value)
//                     }
//                     className="w-full p-2 border border-gray-300 rounded-lg"
//                     required
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label htmlFor="email" className="block text-gray-700">
//                     Email
//                   </label>
//                   <input
//                     type="email"
//                     id="email"
//                     value={email}
//                     onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                       setEmail(e.target.value)
//                     }
//                     className="w-full p-2 border border-gray-300 rounded-lg"
//                     required
//                   />
//                 </div>
//                 <button
//                   type="submit"
//                   className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                 >
//                   Start Chat
//                 </button>
//               </form>
//             </div>
//           ) : (
//             <div>
//               <div className="p-4 border-b flex justify-between items-center">
//                 <h3 className="font-semibold text-lg">Chat</h3>
//                 <button
//                   onClick={toggleChatbox}
//                   className="text-gray-500 hover:text-gray-700"
//                 >
//                   ✖
//                 </button>
//               </div>
//               <div className="p-4 h-60 overflow-y-auto">
//                 {messages.map((msg, idx) => (
//                   <div
//                     key={idx}
//                     className={`mb-2 ${
//                       msg.from === "User" ? "text-right" : ""
//                     }`}
//                   >
//                     <div
//                       className={`inline-block p-2 rounded-lg ${
//                         msg.from === "User"
//                           ? "bg-blue-500 text-white"
//                           : "bg-gray-200"
//                       }`}
//                     >
//                       {msg.text}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               <div className="p-4 border-t">
//                 <input
//                   type="text"
//                   value={input}
//                   onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
//                     setInput(e.target.value)
//                   }
//                   className="w-full p-2 border border-gray-300 rounded-lg"
//                   placeholder="Type a message..."
//                 />
//                 <button
//                   onClick={sendMessage}
//                   className="w-full mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//                 >
//                   Send
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }
"use client";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  from: "User" | "Admin";
  text: string;
};

const socket = io("http://localhost:5000");

export default function Chat() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isFormCompleted, setIsFormCompleted] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("admin-reply", (msg: string) => {
      setMessages((msgs) => [...msgs, { from: "Admin", text: msg }]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (name && email) {
      setIsFormCompleted(true);
    }
  };

  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("user-message", { name, email, input });
    setMessages((msgs) => [...msgs, { from: "User", text: input }]);
    setInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div>
      {/* Floating chat button */}
      <motion.button
        onClick={toggleChatbox}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-5 rounded-full shadow-xl focus:outline-none"
      >
        💬
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-28 right-8 w-80 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-300 flex flex-col overflow-hidden"
          >
            {!isFormCompleted ? (
              <div className="p-6 flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-xl mb-4 text-gray-800 text-center">
                  👋 Welcome!
                </h3>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm text-gray-700 mb-1"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm text-gray-700 mb-1"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:opacity-90 transition"
                  >
                    Start Chat
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-3 flex justify-between items-center">
                  <h3 className="font-semibold text-lg">Chat with Admin</h3>
                  <button
                    onClick={toggleChatbox}
                    className="text-white text-xl hover:opacity-80"
                  >
                    ✖
                  </button>
                </div>
                <div className="p-4 flex-1 overflow-y-auto bg-gray-50 space-y-2">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={`flex ${
                        msg.from === "User" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs p-2 rounded-xl text-sm ${
                          msg.from === "User"
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-gray-800 rounded-bl-none"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef}></div>
                </div>
                <div className="p-4 border-t flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Type a message..."
                  />
                  <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:opacity-90 transition"
                  >
                    ➤
                  </button>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
