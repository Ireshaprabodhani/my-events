import {
  LayoutDashboard,
  Calendar,
  Settings,
  type LucideIcon,
} from "lucide-react"

export type NavLink = {
  title: string
  href: string
  icon: LucideIcon
  exact?: boolean
}

export const adminNavLinks: NavLink[] = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    title: "Events",
    href: "/admin/events",
    icon: Calendar,
  },
]

export const adminBottomLinks: NavLink[] = [
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]
