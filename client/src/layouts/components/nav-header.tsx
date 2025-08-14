"use client";

import * as React from "react";
import Logo from "@public/logo.png";
import Image from "next/image";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "../../hooks/use-sidebar";

const NavHeader: React.FC = () => {
  const { state } = useSidebar();

  if (state === "collapsed") {
    return (
      <div className="flex items-center justify-center py-2">
        <Avatar>
          <AvatarImage src="/logo.png" alt="Total Secure" className="dark:invert dark:grayscale"/>
          <AvatarFallback>TS</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg">
          <div className="border shadow rounded-full p-1">
            <Image
              src={Logo}
              alt="Total Secure"
              className="size-6 dark:invert dark:grayscale"
              width={24}
              height={24}
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">SQUAD PF</span>
            <span className="truncate text-xs">Platform</span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default NavHeader;
