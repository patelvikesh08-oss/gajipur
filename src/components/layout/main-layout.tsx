
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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard,
  ClipboardList,
  Search, 
  Bell, 
  Menu,
  Users,
  ScrollText,
  BookOpen,
  CheckCircle2,
  FileSpreadsheet,
  ChevronRight,
  GraduationCap,
  Trophy,
  PieChart
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const mainNavigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Students", href: "/students", icon: Users },
];

const examinationSubItems = [
  { name: "TRIMASIK", href: "/trimasik", icon: ClipboardList },
  { name: "PATRAK-B", href: "/patrak-b", icon: ScrollText },
  { name: "PATRAK-C", href: "/patrak-c", icon: FileSpreadsheet },
  { name: "SVADHYAY", href: "/svadhyay", icon: BookOpen },
  { name: "PAT/SAT", href: "/pat-sat", icon: CheckCircle2 },
  { name: "Top Performers", href: "/top-performers", icon: Trophy },
  { name: "Results", href: "/results", icon: PieChart },
];

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-sidebar-border bg-white">
        <SidebarHeader className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3 mb-8">
            <span className="font-headline font-bold text-xl text-primary tracking-tight">EduPulse Admin</span>
          </div>
          <div className="flex items-center gap-3 p-2 bg-sidebar-accent/50 rounded-xl">
            <Avatar className="w-10 h-10 border-2 border-green-500 p-0.5">
              <AvatarImage src="https://picsum.photos/seed/user1/40/40" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <span className="text-sm font-bold truncate">Admin User</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Online
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-2 py-4">
          <SidebarMenu>
            {mainNavigation.map((item) => (
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

            <Collapsible 
              asChild 
              defaultOpen={examinationSubItems.some(i => pathname === i.href)}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="px-4 py-6 group flex justify-between items-center hover:bg-sidebar-accent rounded-lg">
                    <span className="font-medium text-muted-foreground group-data-[state=open]:text-primary">Examination</span>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-muted-foreground group-data-[state=open]:text-primary" />
                      <ChevronRight className="w-4 h-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </div>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub className="mx-0 px-0 border-l-0 space-y-1 mt-1">
                    {examinationSubItems.map((item) => (
                      <SidebarMenuSubItem key={item.name} className="px-2">
                        <SidebarMenuSubButton 
                          asChild 
                          isActive={pathname === item.href}
                          className="px-4 py-4 group flex justify-between items-center hover:bg-sidebar-accent/50 rounded-lg h-auto"
                        >
                          <Link href={item.href}>
                            <span className="text-sm font-medium text-muted-foreground group-data-[active=true]:text-primary group-data-[active=true]:font-bold">
                              {item.name}
                            </span>
                            <item.icon className="w-3.5 h-3.5 text-muted-foreground group-data-[active=true]:text-primary" />
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
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
                placeholder="Search Dashboard..."
                className="pl-9 border-none bg-transparent shadow-none focus-visible:ring-0"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-muted/50 transition-colors cursor-pointer">
              <Avatar className="w-8 h-8 border border-green-500 p-0.5">
                <AvatarImage src="https://picsum.photos/seed/user1/40/40" />
              </Avatar>
              <span className="text-sm font-medium text-muted-foreground hidden lg:block">Admin Account</span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-muted rounded-full relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
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
