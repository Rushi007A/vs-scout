"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Companies", href: "/companies" },
  { name: "Lists", href: "/lists" },
  { name: "Saved Searches", href: "/saved" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-black text-white h-screen p-6">
      <h1 className="text-2xl font-bold mb-10">VC Scout</h1>

      <nav className="space-y-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block p-2 rounded ${
              pathname === item.href
                ? "bg-white text-black"
                : "hover:bg-gray-800"
            }`}
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}