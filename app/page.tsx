"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import Image from "next/image";


type Message = {
  role: "user" | "assistant";
  content: string;
};

type Chat = {
  id: string;
  title: string;
  messages: Message[];
};


export default function Home() {
  const [input, setInput] = useState("");
  const defaultMessage: Message[] = [
    {
      role: "assistant",
      content:
        "Hello! How can I assist you with World of Warcraft today?",
    },
  ];

const [messages, setMessages] =
  useState<Message[]>(defaultMessage);

const [chatHistory, setChatHistory] =
  useState<Chat[]>([]);

    const [currentChatId, setCurrentChatId] = useState<string>("");

    useEffect(() => {
      const loadChats = () => {
        const saved =
          localStorage.getItem("wow-ai-history");

        if (!saved) return;

        const parsed: Chat[] = JSON.parse(saved);

        setChatHistory(parsed);

        if (parsed.length > 0) {
          setCurrentChatId(parsed[0].id);
          setMessages(parsed[0].messages);
        }
      };

      loadChats();
    }, []);


  useEffect(() => {
    localStorage.setItem(
      "wow-ai-history",
      JSON.stringify(chatHistory)
    );
  }, [chatHistory]);

  function copyCode(code: string) {
    navigator.clipboard.writeText(code);
  }

  async function sendMessage() {
    if (!input) return;

    const updatedMessages: Message[] = [
      ...messages,
      { role: "user", content: input },
    ];
    setMessages(updatedMessages);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: updatedMessages,
      }),
    });

    const data = await res.json();

    const finalMessages: Message[] = [
      ...updatedMessages,
      {
        role: "assistant",
        content: data.message.content,
      },
    ];

    setMessages(finalMessages);

    const firstUserMessage = updatedMessages.find(
      (msg) => msg.role === "user"
    );

    const title =
      firstUserMessage?.content?.slice(0, 30) || "New Chat";

    const updatedChat: Chat = {
      id: currentChatId || Date.now().toString(),
      title,
      messages: finalMessages,
    };

    setCurrentChatId(updatedChat.id);

    setChatHistory((prev) => {
      const filtered = prev.filter(
        (chat) => chat.id !== updatedChat.id
      );

      return [updatedChat, ...filtered];
    });
  }


  function createNewChat() {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: defaultMessage,
    };

    setCurrentChatId(newChat.id);

    setMessages(defaultMessage);

    setChatHistory((prev) => [newChat, ...prev]);
  }

function loadChat(chat: Chat) {
    setCurrentChatId(chat.id);
    setMessages(chat.messages);
  }

  function deleteChat(chatId: string) {
    const filtered = chatHistory.filter(
      (chat) => chat.id !== chatId
    );

    setChatHistory(filtered);

    // If deleting active chat
    if (currentChatId === chatId) {
      if (filtered.length > 0) {
        setCurrentChatId(filtered[0].id);
        setMessages(filtered[0].messages);
      } else {
        setCurrentChatId("");
        setMessages(defaultMessage);
      }
    }
  }

  function deleteAllChats() {
    localStorage.removeItem("wow-ai-history");

    setChatHistory([]);

    setCurrentChatId("");

    setMessages(defaultMessage);
  }

  return (
    <main className="flex h-screen bg-black text-white overflow-hidden">

      {/* LEFT SIDEBAR */}
      <aside className="w-[260px] bg-zinc-950 border-r border-zinc-800 flex flex-col">
        
        {/* Logo */}
        <div className="p-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <Image
              src="/wowai-main.png"
              alt="WoW AI"
              width={40}
              height={40}
              className="rounded-xl"
            />

            <div>
              <div className="font-semibold">
                WoW AI
              </div>

              <div className="text-xs text-zinc-400">
                WOW Assistant
              </div>
            </div>
          </div>
        </div>

        {/* New Chat */}
        <div className="p-4">
          <button
              onClick={createNewChat}
              className="w-full bg-zinc-800 hover:bg-zinc-700 transition rounded-xl p-3 text-left"
            >
            + New Chat
          </button>
        </div>

        {/* History */}
        <div className="flex-1 overflow-y-auto px-2 pb-4">
          
          <div className="flex items-center justify-between px-3 mb-2">
            
            <div className="text-xs text-zinc-500 uppercase">
              History
            </div>

            {chatHistory.length > 0 && (
              <button
                onClick={deleteAllChats}
                className="text-xs text-red-400 hover:text-red-300 transition"
              >
                Clear
              </button>
            )}

          </div>

          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center justify-between px-3 py-3 rounded-xl transition text-sm mb-1 ${
                currentChatId === chat.id
                  ? "bg-zinc-800"
                  : "hover:bg-zinc-900"
              }`}
            >

              {/* Chat Load */}
              <button
                onClick={() => loadChat(chat)}
                className="flex-1 text-left truncate"
              >
                {chat.title}
              </button>

              {/* Delete Button */}
              <button
                onClick={() => deleteChat(chat.id)}
                className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition ml-2"
              >
                ✕
              </button>

            </div>
          ))}

        </div>
      </aside>

      {/* MAIN CHAT AREA */}
      <section className="flex-1 flex flex-col">

        {/* TOP BAR */}
        <div className="h-[70px] border-b border-zinc-800 flex items-center px-8">
          <h1 className="text-xl font-semibold">
            World of Warcraft AI Assistant
          </h1>
        </div>

        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto">
          
          <div className="max-w-[1500px] mx-auto w-full px-6 py-10 space-y-6">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[900px] px-5 py-4 rounded-2xl leading-relaxed ${
                    msg.role === "user"
                      ? "bg-blue-600"
                      : "bg-zinc-800"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      code(props) {
                        const { children, className } = props;

                        const match = /language-(\w+)/.exec(className || "");

                        const codeString = String(children).replace(/\n$/, "");

                        if (match) {
                          return (
                            <div className="relative group">
                              
                              {/* Copy Button */}
                              <button
                                onClick={() => copyCode(codeString)}
                                className="absolute top-3 right-3 bg-zinc-700 hover:bg-zinc-600 text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition"
                              >
                                Copy
                              </button>

                              <SyntaxHighlighter
                                language={match[1]}
                                style={oneDark}
                                PreTag="div"
                                customStyle={{
                                  borderRadius: "14px",
                                  padding: "20px",
                                  marginTop: "10px",
                                  marginBottom: "10px",
                                  fontSize: "14px",
                                }}
                              >
                                {codeString}
                              </SyntaxHighlighter>
                            </div>
                          );
                        }

                        return (
                          <code className="bg-zinc-700 px-2 py-1 rounded">
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* INPUT */}
        <div className="border-t border-zinc-800 p-6">
          
          <div className="max-w-[1500px] mx-auto">
            
            <div className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4">

              {/* Avatar */}
              <Image
                src="/wowai-chat.png"
                alt="Chat Icon"
                width={40}
                height={40}
                className="rounded-full"
              />

              {/* Input */}
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                className="flex-1 bg-transparent outline-none text-white placeholder:text-zinc-500"
                placeholder="Ask anything about World of Warcraft..."
              />

              {/* Send */}
              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 transition px-5 py-2 rounded-xl font-medium"
              >
                Send
              </button>

            </div>
          </div>
        </div>

      </section>
    </main>
  );
}