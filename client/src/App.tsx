import { useState } from "react";
import "./App.css";
import UsersTab from "./components/UsersTab";
import PostsTab from "./components/PostsTab";
import logo from "./gfx/logo512.png"; // Adjust the path if needed

type TabType = "users" | "posts";

function App() {
  const [activeTab, setActiveTab] = useState<TabType>("users");

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <header className="py-6 px-8 flex justify-center items-center bg-white shadow-md">
        <img src={logo} alt="Content-Hub Logo" className="h-10 w-10 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">Content-Hub</h1>
      </header>
      <div className="container mx-auto mt-10 p-4 bg-white shadow-md">
        <div className="flex mb-4">
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 mr-2 transition-transform transform ${
              activeTab === "users"
                ? "bg-blue-500 text-white"
                : "text-blue-500 hover:bg-blue-200 hover:scale-105"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2 transition-transform transform ${
              activeTab === "posts"
                ? "bg-blue-500 text-white"
                : "text-blue-500 hover:bg-blue-200 hover:scale-105"
            }`}
          >
            Posts
          </button>
        </div>
        {activeTab === "users" && <UsersTab />}
        {activeTab === "posts" && <PostsTab />}
      </div>
    </div>
  );
}

export default App;
