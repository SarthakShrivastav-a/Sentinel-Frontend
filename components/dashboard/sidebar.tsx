"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Activity, Bell, ChevronsLeft, ChevronsRight, LogOut, PlusCircle, Settings, Users, Zap } from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth-provider"
import { cn } from "@/lib/utils"

export function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: Activity,
    },
    {
      title: "Monitors",
      href: "/dashboard/monitors",
      icon: Bell,
    },
    {
      title: "Create Monitor",
      href: "/dashboard/monitors/create",
      icon: PlusCircle,
    },
    {
      title: "Team Settings",
      href: "/dashboard/team-settings",
      icon: Users,
    },
    {
      title: "Heartbeats",
      href: "/dashboard/heartbeats",
      icon: Activity,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  return (
    <div
      className={cn(
        "flex h-screen flex-col border-r bg-background transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-14 items-center border-b px-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-primary" />
          {!collapsed && <span className="text-xl font-bold">Sentinel</span>}
        </Link>
        <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </Button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-muted",
                pathname === item.href ? "bg-muted font-medium" : "text-muted-foreground",
                collapsed && "justify-center py-3",
              )}
            >
              <item.icon className={cn("h-5 w-5", collapsed ? "h-5 w-5" : "h-4 w-4")} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t p-2">
        <Button
          variant="ghost"
          className={cn("w-full justify-start", collapsed && "justify-center px-0")}
          onClick={handleLogout}
        >
          <LogOut className={cn("h-5 w-5", collapsed ? "h-5 w-5" : "mr-2 h-4 w-4")} />
          {!collapsed && <span>Log out</span>}
        </Button>
      </div>
    </div>
  )
}
