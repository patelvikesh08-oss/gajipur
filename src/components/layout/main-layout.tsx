
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  BrainCircuit, 
  FileInput, 
  Search, 
  Bell, 
  Mail, 
  Menu,
  Home,
  Grid,
  FileText,
  Database,
  Type
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Components", href: "/students", icon: Users },
  { name: "UI Elements", href: "/insights", icon: Grid },
  { name: "Form Stuff", href: "/bulk-entry", icon: FileText },
  { name: "Data Table", href: "/students", icon: Database },
  { name: "Icons", href: "/bulk-entry", icon: Type },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-sidebar-border bg-white">
        <SidebarHeader className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-headline font-bold text-xl text-primary tracking-tight">Dashboard Admin</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-sidebar-accent/50 rounded-xl">
            <Avatar className="w-10 h-10 border-2 border-green-500 p-0.5">
              <AvatarImage src="https://picsum.photos/seed/user1/40/40" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate">Success Awuku-Amador</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className="px-4 py-6 group flex justify-between items-center hover:bg-sidebar-accent rounded-lg"
                >
                  <Link href={item.href}>
                    <span className="font-medium text-muted-foreground group-data-[active=true]:text-primary group-data-[active=true]:font-bold">
                      {item.name}
                    </span>
                    <item.icon className="w-4 h-4 text-muted-foreground group-data-[active=true]:text-primary" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <SidebarInset className="bg-[#f3f4f7]">
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 bg-white px-6 shadow-sm border-b">
          <div className="flex items-center gap-4 flex-1">
            <SidebarTrigger />
            <div className="relative w-64 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search Project"
                className="pl-9 border-none bg-transparent shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-muted/50 transition-colors cursor-pointer">
              <Avatar className="w-8 h-8 border border-green-500 p-0.5">
                <AvatarImage src="https://picsum.photos/seed/user1/40/40" />
              </Avatar>
              <span className="text-sm font-medium text-muted-foreground hidden lg:block">Success Awuku-Amador</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-muted rounded-full relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-white" />
              </button>
              <button className="p-2 hover:bg-muted rounded-full relative">
                <Mail className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-white" />
              </button>
              <button className="p-2 hover:bg-muted rounded-full">
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
