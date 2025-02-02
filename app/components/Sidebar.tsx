"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillHome, AiFillHeart } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";
import { IoBookSharp } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";

interface MenuItem {
  name: string;
  icon: JSX.Element;
  link: string;
}

const Sidebar = () => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { signOut } = useAuth();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  const menuItems: MenuItem[] = [
    { name: "Home", icon: <AiFillHome />, link: "/" },
    { name: "Profile", icon: <FaUserCircle />, link: "/profile" },
    ...(isAdmin
      ? [{ name: "Create Book", icon: <MdLibraryAdd />, link: "/admin/createBook" }]
      : []), // Include "Create Book" only for admins
    { name: "Books", icon: <IoBookSharp />, link: "/admin/Books" },
    { name: "Liked Books", icon: <AiFillHeart />, link: "/likedbooks" },
  ];

  const handleLogout = () => {
    if (signOut) {
      signOut();
    } else {
      console.error("SignOut function is not available.");
    }
  };

  return (
    <div
      className={`bg-gray-800 text-white flex flex-col justify-between p-4 shadow-lg h-full fixed top-0 left-0 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } hidden md:flex`}
    >
      {/* Brand Section */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="relative overflow-hidden bg-transparent border-none cursor-pointer p-0 m-0 uppercase tracking-widest font-bold text-[1.5em] -webkit-text-stroke-[1px] text-[rgba(255,255,255,0.6)]"
      >
        {/* Actual Text */}
        <span className="inset-0 flex hover:border-[#37FF8B] hover:text-[#37FF8B] items-center justify-center">
          &nbsp;{!isCollapsed ? "Universe" : "U"}&nbsp;
        </span>
        {/* Hover Text */}
        <span
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center w-0 overflow-hidden border-r-[6px] border-[#37FF8B] text-[#37FF8B] transition-all duration-500 ease-in-out -webkit-text-stroke-[1px]"
        >
          &nbsp;Universe&nbsp;
        </span>
      </button>

      {/* Navigation Menu */}
      <nav className="flex flex-col gap-4 overflow-y-auto mt-4">
        {menuItems.map((item) => (
          <Link key={item.name} href={item.link}>
            <div
              className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 cursor-pointer ${
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