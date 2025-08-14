"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import NavHeader from "./nav-header";
// import NavBanner from "./nav-banner";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import navMain from "../data/nav-main";

// This is sample data.
const data = {
  user: {
    name: "admin",
    email: "admin@example.com",
    avatar: "/avatar.webp",
  },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavHeader />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={navMain.map((item) => ({
            ...item,
            isActive:
              pathname === item.url ||
              (item.items && item.items.some((sub) => pathname === sub.url)),
            items: item.items.map((subItem) => ({
              ...subItem,
              isActive: pathname === subItem.url,
            })),
            render: (
              <Link
                href={item.url}
                className={`nav-link${
                  pathname === item.url ? " active" : ""
                }`}
              >
                {item.icon && <item.icon className="nav-icon" />}
                {item.title}
              </Link>
            ),
          }))}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
