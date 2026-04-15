import { useState } from "react";
import axios from "axios";

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [allProducts, setAllProducts] = useState([]); // Keep all products from all questions
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { type: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3000/api/chat", {
        message: input,
      });

      const botMsg = { type: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
      
      // Accumulate products from all questions instead of replacing
      if (res.data.products && res.data.products.length > 0) {
        setAllProducts((prev) => [...prev, ...res.data.products]);
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg = {
        type: "bot",
        text:
          error.response?.data?.message ||
          error.message ||
          "Sorry, something went wrong. Please try again.",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  // Closed State - Small Icon Button
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition transform hover:scale-110"
          title="Open Chat"
        >
          <svg
            className="w-8 h-8"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
          </svg>
        </button>
      </div>
    );
  }

  // Open State - Full Chat Box
  return (
    <div className="fixed bottom-6 right-6 w-96 h-screen max-h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-lg">AI Shopping Assistant</h3>
          <p className="text-xs text-blue-100">Ask me about products</p>
        </div>
        <button
          onClick={() => {
            setIsOpen(false);
            setMessages([]);
            setAllProducts([]);
          }}
          className="text-2xl hover:text-blue-100 transition font-bold"
          title="Close Chat"
        >
          ✕
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <div className="text-4xl mb-3">👋</div>
            <p className="font-semibold">Hi! I'm your shopping assistant</p>
            <p className="text-sm mt-2 text-gray-400">Try asking:</p>
            <ul className="text-xs mt-3 space-y-1 text-gray-400">
              <li>"Show me shirts under 500"</li>
              <li>"I need kids wear"</li>
              <li>"Electronics under 1000"</li>
            </ul>
          </div>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                msg.type === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-800 rounded-bl-none border border-gray-200"
              }`}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 px-4 py-2 rounded-2xl rounded-bl-none border border-gray-200">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Products Section - Shows ALL products from ALL questions */}
      {allProducts.length > 0 && (
        <div className="border-t border-gray-200 bg-white p-3 max-h-40 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs font-bold text-gray-600">📦 All Suggestions ({allProducts.length})</p>
            <button
              onClick={() => setAllProducts([])}
              className="text-xs text-gray-500 hover:text-red-500 transition"
              title="Clear products"
            >
              Clear
            </button>
          </div>
          <div className="space-y-2">
            {allProducts.map((p, idx) => (
              <div
                key={idx}
                className="flex gap-2 border border-gray-200 rounded-lg p-2 hover:bg-blue-50 transition cursor-pointer"
              >
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.name}
                    className="h-12 w-12 object-cover rounded"
                  />
                )}
                <div className="flex-1 text-xs">
                  <p className="font-semibold truncate text-gray-700">
                    {p.name}
                  </p>
                  <p className="text-blue-600 font-bold">₹{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 bg-white p-3">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !loading && sendMessage()}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className={`px-6 py-2 rounded-full font-semibold text-sm transition ${
              loading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
