"use client"

import { useAuth } from "@/components/auth-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import {
  Home,
  Upload,
  FileText,
  Users,
  CheckCircle,
  Clock,
  Settings,
  LogOut,
  Shield,
  FileCheck,
  UserCog,
} from "lucide-react"
import Link from "next/link"

const clientMenuItems = [
  { title: "Dashboard", url: "/client", icon: Home },
  { title: "Upload Documents", url: "/client/upload-documents", icon: Upload },
  { title: "My Documents", url: "/client/my-documents", icon: FileText },
  { title: "Onboarding Status", url: "/client/onboarding-status", icon: CheckCircle },
]

const adminMenuItems = [
  { title: "Dashboard", url: "/admin", icon: Home },
  { title: "All Clients", url: "/admin/all-clients", icon: Users },
  { title: "Document Review", url: "/admin/document-review", icon: FileCheck },
  { title: "User Management", url: "/admin/user-management", icon: UserCog },
  { title: "Settings", url: "/admin/settings", icon: Settings },
]

const serviceCenterMenuItems = [
  { title: "Dashboard", url: "/service-center", icon: Home },
  { title: "Pending Clients", url: "/service-center/pending-clients", icon: Clock },
  { title: "Review Queue", url: "/service-center/review-queue", icon: Shield },
  { title: "Completed", url: "/service-center/completed", icon: CheckCircle },
]

export function AppSidebar() {
  const { user, logout } = useAuth()

  if (!user) return null

  const menuItems =
    user.role === "client" ? clientMenuItems : user.role === "admin" ? adminMenuItems : serviceCenterMenuItems

  return (
  <Sidebar
    variant="inset"
    className="!bg-[#024D6C] !text-white dark:!bg-[#024D6C] dark:!text-white"
  >
    <SidebarHeader className="border-b border-border/40 !bg-[#024D6C] !text-white">
      <div className="flex items-center justify-between px-2 py-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <img
              src="/images/Gentyx.png" // 👈 Replace this if your file is named differently or in another path
              alt="Gentyx Logo"
              className="h-5 w-5 object-contain"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold text-white">Gentyx ClientHub</span>
            <span className="truncate text-xs text-white/70 capitalize">
              {user.role === "service-center" ? "Service Center" : user.role}
            </span>
          </div>
        </div>
        <ThemeToggle />
      </div>
    </SidebarHeader>


    <SidebarContent className="!bg-[#024D6C] !text-white">
      <SidebarGroup>
        <SidebarGroupLabel className="text-white/80">Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className="flex items-center gap-3 text-white hover:text-white/90"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>

    <SidebarFooter className="border-t border-border/40 !bg-[#024D6C] !text-white">
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 px-2 py-1.5 text-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#024D6C]">
              {user.name.charAt(0)}
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium text-white">{user.name}</span>
              <span className="truncate text-xs text-white/70">{user.email}</span>
            </div>
          </div>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <Button
            variant="ghost"
            className="w-full justify-start text-white hover:text-white/90"
            onClick={logout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            <span>Sign Out</span>
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>

    <SidebarRail className="!bg-[#024D6C]" />
  </Sidebar>
)

}
