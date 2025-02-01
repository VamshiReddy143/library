"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillHome, AiFillHeart } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";
import { IoBookSharp } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";

interface MenuItem {
  name: string;
  icon: JSX.Element;
  link: string;
}

const Sidebar = () => {
  const pathname = usePathname(); // Get current path
  const [isCollapsed, setIsCollapsed] = useState(false); // State for collapsed/expanded

  const menuItems: MenuItem[] = [
    { name: "Home", icon: <AiFillHome />, link: "/" },
    { name: "Profile", icon: <FaUserCircle />, link: "/profile" },
    { name: "Create Book", icon: <MdLibraryAdd />, link: "/admin/createBook" },
    { name: "Books", icon: <IoBookSharp />, link: "/admin/Books" },
    { name: "Liked Books", icon: <AiFillHeart />, link: "/likedbooks" },
  ];

  const handleLogout = () => {
    console.log("User logged out"); // Replace with actual logout logic
  };

  return (
    <div
      className={`bg-gray-800 text-white flex flex-col p-4 shadow-lg justify-between ${
        isCollapsed ? "w-20" : "w-64"
      } h-screen fixed top-0 left-0 transition-all duration-300`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="mb-4 p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
        aria-label="Toggle Sidebar"
      >
        {isCollapsed ? (
          <span className="text-xl">→</span>
        ) : (
          <span className="text-xl">←</span>
        )}
      </button>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-4 overflow-y-auto">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.link}>
            <div
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer
                ${
                  pathname === item.link
                    ? "bg-red-500 text-white"
                    : "hover:bg-gray-700"
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!isCollapsed && <span className="text-lg">{item.name}</span>}
            </div>
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-red-500 transition-all duration-300 cursor-pointer text-white"
      >
        <FiLogOut className="text-xl" />
        {!isCollapsed && <span className="text-lg">Logout</span>}
      </button>
    </div>
  );
};

export default Sidebar;