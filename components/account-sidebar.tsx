"use client"

import { MapPin, ShoppingBag, User, Settings, LogOut } from "lucide-react"
import { Card } from "@/components/ui/card"

interface AccountSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function AccountSidebar({ activeTab, setActiveTab }: AccountSidebarProps) {
  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "orders", label: "Orders", icon: ShoppingBag },
  ]

  return (
    <div className="md:col-span-1">
      <Card className="p-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition ${
                activeTab === item.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          )
        })}

        <div className="pt-4 border-t border-border">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left hover:bg-muted text-foreground transition">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </Card>
    </div>
  )
}
