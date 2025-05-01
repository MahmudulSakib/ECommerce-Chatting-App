// "use client";
// import React, { useEffect, useState } from "react";
// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000");

// // Define message type
// type Message = {
//   from: "User" | "Admin";
//   text: string;
// };

// // Define user conversation type
// type UserConversation = {
//   name: string;
//   email: string;
//   messages: Message[];
// };

// // Main component
// export default function Admin() {
//   const [conversations, setConversations] = useState<
//     Record<string, UserConversation>
//   >({});
//   const [selectedUser, setSelectedUser] = useState<string | null>(null);
//   const [reply, setReply] = useState("");

//   useEffect(() => {
//     socket.emit("admin-join");

//     // Listen for incoming user messages
//     socket.on(
//       "new-user-message",
//       (data: { id: string; name: string; email: string; input: string }) => {
//         setConversations((prev) => {
//           const prevMsgs = prev[data.id]?.messages || [];
//           return {
//             ...prev,
//             [data.id]: {
//               name: data.name,
//               email: data.email,
//               messages: [...prevMsgs, { from: "User", text: data.input }],
//             },
//           };
//         });
//       }
//     );

//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   const sendReply = () => {
//     if (!selectedUser || !reply.trim()) return;

//     socket.emit("admin-reply", { toUserId: selectedUser, msg: reply });

//     setConversations((prev) => {
//       const prevMsgs = prev[selectedUser]?.messages || [];
//       return {
//         ...prev,
//         [selectedUser]: {
//           ...prev[selectedUser]!,
//           messages: [...prevMsgs, { from: "Admin", text: reply }],
//         },
//       };
//     });
//     setReply("");
//   };

//   const selectedConversation = selectedUser
//     ? conversations[selectedUser]
//     : null;

//   return (
//     <div className="flex h-screen bg-gray-100">
//       {/* User list */}
//       <div className="w-1/4 bg-white border-r p-4 overflow-y-auto">
//         <h2 className="text-xl font-bold mb-4">Users</h2>
//         {Object.keys(conversations).length === 0 && (
//           <p className="text-gray-500">No active users</p>
//         )}
//         {Object.entries(conversations).map(([id, user]) => (
//           <button
//             key={id}
//             onClick={() => setSelectedUser(id)}
//             className={`block w-full text-left p-2 rounded mb-2 ${
//               selectedUser === id ? "bg-blue-100" : "hover:bg-gray-200"
//             }`}
//           >
//             <div className="font-semibold">{user.name || "Unknown User"}</div>
//             <div className="text-xs text-gray-600">{user.email || id}</div>
//           </button>
//         ))}
//       </div>

//       {/* Chat panel */}
//       <div className="flex-1 flex flex-col">
//         {selectedConversation ? (
//           <>
//             <div className="p-4 border-b bg-white">
//               <h3 className="text-lg font-bold">
//                 Chat with {selectedConversation.name || "User"}
//               </h3>
//               <p className="text-sm text-gray-500">
//                 {selectedConversation.email}
//               </p>
//             </div>

//             <div className="flex-1 p-4 overflow-y-auto space-y-2">
//               {(selectedConversation.messages ?? []).map((msg, idx) => (
//                 <div
//                   key={idx}
//                   className={`${
//                     msg.from === "Admin" ? "text-right" : "text-left"
//                   }`}
//                 >
//                   <div
//                     className={`inline-block p-2 rounded-lg ${
//                       msg.from === "Admin"
//                         ? "bg-blue-500 text-white"
//                         : "bg-gray-200"
//                     }`}
//                   >
//                     <strong>{msg.from}: </strong>
//                     {msg.text}
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="p-4 border-t bg-white flex gap-2">
//               <input
//                 value={reply}
//                 onChange={(e) => setReply(e.target.value)}
//                 placeholder="Type reply..."
//                 className="flex-1 p-2 border rounded"
//               />
//               <button
//                 onClick={sendReply}
//                 className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//               >
//                 Send
//               </button>
//             </div>
//           </>
//         ) : (
//           <div className="flex items-center justify-center h-full text-gray-500">
//             Select a user to view conversation
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";
import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";

const socket = io("http://localhost:5000");

type Message = {
  from: "User" | "Admin";
  text: string;
};

type UserConversation = {
  name: string;
  email: string;
  messages: Message[];
};

export default function Admin() {
  const [conversations, setConversations] = useState<
    Record<string, UserConversation>
  >({});
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [reply, setReply] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.emit("admin-join");

    socket.on(
      "new-user-message",
      (data: { id: string; name: string; email: string; input: string }) => {
        setConversations((prev) => {
          const prevMsgs = prev[data.id]?.messages || [];
          return {
            ...prev,
            [data.id]: {
              name: data.name,
              email: data.email,
              messages: [...prevMsgs, { from: "User", text: data.input }],
            },
          };
        });
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, selectedUser]);

  const sendReply = () => {
    if (!selectedUser || !reply.trim()) return;

    socket.emit("admin-reply", { toUserId: selectedUser, msg: reply });

    setConversations((prev) => {
      const prevMsgs = prev[selectedUser]?.messages || [];
      return {
        ...prev,
        [selectedUser]: {
          ...prev[selectedUser]!,
          messages: [...prevMsgs, { from: "Admin", text: reply }],
        },
      };
    });
    setReply("");
  };

  const selectedConversation = selectedUser
    ? conversations[selectedUser]
    : null;

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100">
      {/* User list */}
      <div className="w-1/4 bg-white border-r shadow-lg p-4 overflow-y-auto rounded-r-2xl">
        <h2 className="text-2xl font-bold mb-6 text-blue-600">👥 Users</h2>
        {Object.keys(conversations).length === 0 && (
          <p className="text-gray-500 text-center">No active users</p>
        )}
        {Object.entries(conversations).map(([id, user]) => (
          <motion.button
            whileHover={{ scale: 1.03 }}
            key={id}
            onClick={() => setSelectedUser(id)}
            className={`block w-full text-left p-3 rounded-lg mb-3 shadow transition ${
              selectedUser === id
                ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            <div className="font-semibold truncate">
              {user.name || "Unknown User"}
            </div>
            <div className="text-xs text-gray-900 truncate">
              {user.email || id}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Chat panel */}
      <div className="flex-1 flex flex-col bg-white rounded-l-2xl shadow-inner">
        {selectedConversation ? (
          <>
            <div className="p-5 border-b bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-tl-2xl">
              <h3 className="text-xl font-bold">
                Chat with {selectedConversation.name || "User"}
              </h3>
              <p className="text-sm opacity-80">{selectedConversation.email}</p>
            </div>

            <div className="flex-1 p-6 overflow-y-auto space-y-3 bg-gray-50">
              {(selectedConversation.messages ?? []).map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`flex ${
                    msg.from === "Admin" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow ${
                      msg.from === "Admin"
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

            <div className="p-4 border-t bg-white flex gap-2">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Type reply..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={sendReply}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition"
              >
                Send
              </motion.button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <p className="text-lg">👈 Select a user to view conversation</p>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
