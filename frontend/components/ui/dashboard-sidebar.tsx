"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  CalendarDays,
  Wrench,
  Users,
  Settings,
  Car,
} from "lucide-react";

const navigation = [
  {
    name: "Overview",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    name: "Bookings",
    icon: CalendarDays,
    href: "/bookings",
  },
  {
    name: "Mechanics",
    icon: Wrench,
    href: "/mechanics",
  },
  {
    name: "Customers",
    icon: Users,
    href: "/customers",
  },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white lg:flex lg:flex-col">
      {/* Logo */}
      <Link
        href="/"
        className="flex h-16 items-center gap-3 border-b border-slate-200 px-6"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900">
          <Car className="h-5 w-5 text-white" />
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-900">
            Instant Mechanic
          </p>

          <p className="text-xs text-slate-500">
            Operations
          </p>
        </div>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="border-t border-slate-200 p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-900"
        >
          <Settings className="h-4 w-4" />

          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}