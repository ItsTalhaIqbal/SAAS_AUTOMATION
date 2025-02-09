import { MenuIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const Navbar = (props: Props) => {
  const user = "talha"; // Replace with dynamic user logic

  return (
    <header className="fixed right-0 left-0 top-0 py-4 px-4 bg-black/40 backdrop-blur-lg z-[100] flex items-center border-b border-neutral-900 justify-between">
      {/* Logo */}
      <aside className="flex items-center gap-[2px]">
        <p className="text-3xl font-bold">Bu</p>
        <Image
          src="/fuzzieLogo.png"
          width={15}
          height={15}
          alt="Buzzie logo"
          className="shadow-sm"
        />
        <p className="text-3xl font-bold">zie</p>
      </aside>

      {/* Navigation */}
      <nav className="absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] hidden md:block">
        <ul className="flex items-center gap-4 list-none">
          {[
            "Products",
            "Pricing",
            "Clients",
            "Resources",
            "Documentation",
            "Enterprise",
          ].map((item) => (
            <li key={item}>
              <Link
                className="text-md"
                href={`#`}
                aria-label={`Navigate to ${item}`}
              >
                {item}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Section */}
      <aside className="flex items-center gap-4">
        <Link
          href={user ? "/dashboard" : "/get-started"}
          className="relative inline-flex h-10 overflow-hidden rounded-full p-[2px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
          aria-label={user ? "Go to Dashboard" : "Get Started"}
        >
          <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
          <span className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
            {user ? "Dashboard" : "Get Started"}
          </span>
        </Link>
        {/* Future Hamburger Menu */}
        <MenuIcon className="md:hidden" />
      </aside>
    </header>
  );
};

export default Navbar;
