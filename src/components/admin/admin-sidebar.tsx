"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { adminNavLinks, adminBottomLinks } from "./admin-nav-links"
import { Separator } from "@/components/ui/separator"

export function AdminSidebar() {
  const pathname = usePathname()

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <aside className="hidden md:flex w-60 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/admin" className="font-semibold text-foreground">
          {process.env.NEXT_PUBLIC_APP_NAME ?? "My Events"}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {adminNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(link.href, link.exact)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <link.icon className="h-4 w-4 flex-shrink-0" />
            {link.title}
          </Link>
        ))}
      </nav>

      <div className="p-3">
        <Separator className="mb-3" />
        {adminBottomLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive(link.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <link.icon className="h-4 w-4 flex-shrink-0" />
            {link.title}
          </Link>
        ))}
      </div>
    </aside>
  )
}
