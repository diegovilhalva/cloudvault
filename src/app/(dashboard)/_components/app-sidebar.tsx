"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  RiFilePdf2Fill,
  RiImageFill,
  RiPieChart2Fill,
  RiStarFill,
  RiUserShared2Fill,
  RiVideoFill,
} from "@remixicon/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { paragraphVariants } from "@/components/custom/p";
import { usePathname } from "next/navigation";
import SearchBar from "./search-bar";


// Menu items.
const items = [
  {
    title: "Documents",
    url: "/dashboard/documents",
    icon: RiFilePdf2Fill,
  },
  {
    title: "Images",
    url: "/dashboard/images",
    icon: RiImageFill,
  },
  {
    title: "Videos",
    url: "/dashboard/videos",
    icon: RiVideoFill,
  },
  {
    title: "Others",
    url: "/dashboard/others",
    icon: RiPieChart2Fill,
  },
  {
    title: "Shared with me",
    url: "/dashboard/shared",
    icon: RiUserShared2Fill,
  },
  {
    title: "Subscription",
    url: "/dashboard/subscription",
    icon: RiStarFill,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarContent>
        {/* Sidebar Header here */}
        <SidebarHeader>
          <SidebarMenu className="space-y-4 mt-3">
            <SidebarMenuItem>
              <SearchBar/>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarGroup>
          <SidebarGroupLabel>Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-u-2">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      paragraphVariants({
                        size: "small",
                        weight: "medium",
                      }),
                      "py-6 px-5 rounded-lg",
                      pathname === item.url &&
                        "bg-primary drop-shadow-xl text-white hover:bg-primary hover:text-white"
                    )}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}