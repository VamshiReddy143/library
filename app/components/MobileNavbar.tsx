"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiFillHome, AiFillHeart } from "react-icons/ai";
import { FaUserCircle } from "react-icons/fa";
import { MdLibraryAdd } from "react-icons/md";
import { IoBookSharp } from "react-icons/io5";
import { useUser } from "@clerk/nextjs"; // Import Clerk's useUser hook

const MobileNavbar = () => {
  const pathname = usePathname();
  const { user } = useUser(); // Access user metadata

  // Check if the user is an admin
  const isAdmin = user?.publicMetadata?.role === "admin";

  // Define menu items dynamically based on admin status
  const menuItems = [
    { name: "Home", icon: <AiFillHome />, link: "/" },
    { name: "Profile", icon: <FaUserCircle />, link: "/profile" },
    ...(isAdmin
      ? [{ name: "Create Book", icon: <MdLibraryAdd />, link: "/admin/createBook" }]
      : []), // Include "Create Book" only for admins
    { name: "Books", icon: <IoBookSharp />, link: "/admin/Books" },
    { name: "Liked Books", icon: <AiFillHeart />, link: "/likedbooks" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-gray-800 text-white flex justify-around items-center p-4 shadow-lg z-50">
      {menuItems.map((item) => (
        <Link key={item.name} href={item.link}>
          <div
            className={`flex flex-col items-center gap-1 ${
              pathname === item.link ? "text-red-500" : "hover:text-gray-400"
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs">{item.name}</span>
          </div>
        </Link>
      ))}
    </nav>
  );
};

export default MobileNavbar;