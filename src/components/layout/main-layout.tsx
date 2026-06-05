
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
  useSidebar,
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
  PieChart,
  IdCard,
  FileText,
  Layers,
  Calculator,
  SpellCheck,
  Settings2,
  Settings,
  FileDigit
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import React from "react";
import { cn } from "@/lib/utils";

const mainNavigation = [
  { name: "Dashboard / ડેશબોર્ડ", href: "/", icon: LayoutDashboard },
  { name: "Students / વિદ્યાર્થીઓ", href: "/students", icon: Users },
  { name: "Bonofide / બોનાફાઇડ", href: "/bonofide", icon: IdCard },
  { name: "FLN / અંકજ્ઞાન", href: "/fln", icon: SpellCheck },
];

const examinationSubItems = [
  { name: "PATRAK-A / પત્રક-અ", href: "/patrak-a", icon: FileDigit },
  { name: "TRIMASIK / ત્રિમાસિક", href: "/trimasik", icon: ClipboardList },
  { name: "PATRAK-B / પત્રક-બ", href: "/patrak-b", icon: ScrollText },
  { name: "PATRAK-C / પત્રક-સી", href: "/patrak-c", icon: FileSpreadsheet },
  { name: "SVADHYAY / સ્વાધ્યાય", href: "/svadhyay", icon: BookOpen },
  { name: "PAT/SAT / મૂલ્યાંકન", href: "/pat-sat", icon: CheckCircle2 },
  { name: "Top Performers / તેજસ્વી", href: "/top-performers", icon: Trophy },
  { name: "Report Card / રિપોર્ટ કાર્ડ", href: "/report-card", icon: FileText },
  { name: "Results / પરિણામો", href: "/results", icon: PieChart },
];

const settingsSubItems = [
  { name: "Subject Mapping / વિષય", href: "/subject-mapping", icon: Layers },
  { name: "Marks Mapping / ગુણ", href: "/marks-mapping", icon: Calculator },
  { name: "Patrak-B Config / પત્રક-બ સેટિંગ", href: "/patrak-b-config", icon: Settings2 },
  { name: "FLN Config / FLN સેટિંગ", href: "/fln-config", icon: SpellCheck },
  { name: "Bonofide Config / બોનાફાઇડ સેટિંગ", href: "/bonofide-config", icon: IdCard },
  { name: "Report Config / રિપોર્ટ સેટિંગ", href: "/report-card-config", icon: FileText },
];

function AppSidebar() {
  const { setOpen, isMobile } = useSidebar();
  const pathname = usePathname();

  return (
    <Sidebar 
      collapsible="icon" 
      onMouseEnter={() => !isMobile && setOpen(true)}
      onMouseLeave={() => !isMobile && setOpen(false)}
      className="border-none bg-gradient-to-b from-indigo-900 via-purple-900 to-indigo-950 text-white no-print [&_[data-sidebar=sidebar]]:bg-transparent"
    >
      <SidebarHeader className="p-4 border-b border-white/10 transition-all duration-300 group-data-[state=collapsed]:p-2">
        <div className="flex items-center gap-3 mb-6 group-data-[state=collapsed]:mb-0 group-data-[state=collapsed]:justify-center overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-lg">
             <GraduationCap className="w-5 h-5 text-indigo-800" />
          </div>
          <span className="font-headline font-bold text-xl text-white tracking-tight truncate group-data-[state=collapsed]:hidden">EduPulse Admin</span>
        </div>
        <div className="flex items-center gap-3 p-2 bg-white/10 rounded-xl group-data-[state=collapsed]:bg-transparent group-data-[state=collapsed]:p-0 group-data-[state=collapsed]:justify-center transition-all duration-300 border border-white/10">
          <Avatar className="w-10 h-10 border-2 border-indigo-400 p-0.5 shrink-0">
            <AvatarImage src="https://picsum.photos/seed/user1/40/40" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden group-data-[state=collapsed]:hidden">
            <span className="text-sm font-bold truncate text-white">Admin User</span>
            <span className="text-[10px] text-white/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Live
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4 pl-4 bg-transparent overflow-x-hidden">
        <SidebarMenu className="space-y-1">
          {mainNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "px-4 py-6 group flex items-center transition-all duration-300 rounded-l-full rounded-r-none",
                    "text-white hover:bg-white/10",
                    isActive && "bg-white text-indigo-900 font-black shadow-[-4px_0_12px_rgba(0,0,0,0.1)] hover:bg-white hover:text-indigo-900"
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3 w-full">
                    <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-indigo-700" : "text-white")} />
                    <span className="font-bold truncate group-data-[state=collapsed]:hidden">
                      {item.name}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}

          <Collapsible 
            asChild 
            defaultOpen={examinationSubItems.some(i => pathname === i.href)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="px-4 py-6 group flex justify-between items-center transition-all duration-300 rounded-l-full rounded-r-none text-white hover:bg-white/10 data-[state=open]:bg-white/5">
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-5 h-5 shrink-0" />
                    <span className="font-bold group-data-[state=collapsed]:hidden">Examination / પરીક્ષા</span>
                  </div>
                  <ChevronRight className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-90 group-data-[state=collapsed]:hidden" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="mx-0 px-0 border-l-0 space-y-1 mt-1 pl-4">
                  {examinationSubItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuSubItem key={item.name}>
                        <SidebarMenuSubButton 
                          asChild 
                          isActive={isActive}
                          className={cn(
                            "px-4 py-4 group flex items-center transition-all duration-300 rounded-l-full rounded-r-none h-auto",
                            "text-white/80 hover:bg-white/10 hover:text-white",
                            isActive && "bg-white text-indigo-900 font-black shadow-[-4px_0_12px_rgba(0,0,0,0.1)] hover:bg-white hover:text-indigo-900"
                          )}
                        >
                          <Link href={item.href} className="flex items-center gap-3 w-full">
                            <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-indigo-700" : "text-white/80")} />
                            <span className="text-sm font-medium truncate group-data-[state=collapsed]:hidden">
                              {item.name}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          <Collapsible 
            asChild 
            defaultOpen={settingsSubItems.some(i => pathname === i.href)}
            className="group/collapsible"
          >
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="px-4 py-6 group flex justify-between items-center transition-all duration-300 rounded-l-full rounded-r-none text-white hover:bg-white/10 data-[state=open]:bg-white/5">
                  <div className="flex items-center gap-3">
                    <Settings className="w-5 h-5 shrink-0" />
                    <span className="font-bold group-data-[state=collapsed]:hidden">Settings / સેટિંગ્સ</span>
                  </div>
                  <ChevronRight className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-90 group-data-[state=collapsed]:hidden" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub className="mx-0 px-0 border-l-0 space-y-1 mt-1 pl-4">
                  {settingsSubItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <SidebarMenuSubItem key={item.name}>
                        <SidebarMenuSubButton 
                          asChild 
                          isActive={isActive}
                          className={cn(
                            "px-4 py-4 group flex items-center transition-all duration-300 rounded-l-full rounded-r-none h-auto",
                            "text-white/80 hover:bg-white/10 hover:text-white",
                            isActive && "bg-white text-indigo-900 font-black shadow-[-4px_0_12px_rgba(0,0,0,0.1)] hover:bg-white hover:text-indigo-900"
                          )}
                        >
                          <Link href={item.href} className="flex items-center gap-3 w-full">
                            <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-indigo-700" : "text-white/80")} />
                            <span className="text-sm font-medium truncate group-data-[state=collapsed]:hidden">
                              {item.name}
                            </span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    );
                  })}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}

function MainLayoutContent({ children, pathname }: { children: React.ReactNode, pathname: string }) {
  const { setOpen, setOpenMobile, isMobile, open } = useSidebar();

  const handleContentClick = () => {
    if (open) {
      if (isMobile) {
        setOpenMobile(false);
      } else {
        setOpen(false);
      }
    }
  };

  return (
    <SidebarInset 
      onClick={handleContentClick} 
      className="bg-indigo-950 transition-all duration-300 h-svh flex flex-col overflow-hidden"
    >
      <header className="flex h-20 shrink-0 items-center justify-between gap-2 bg-gradient-to-r from-indigo-900 to-indigo-950 px-8 no-print text-white">
        <div className="flex items-center gap-6 flex-1">
          <SidebarTrigger className="text-white hover:bg-white/10 h-10 w-10" />
          <div className="relative w-80 max-sm:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50" />
            <Input
              placeholder="Search Dashboard..."
              className="pl-10 border-none bg-white/10 text-white placeholder:text-white/40 shadow-none focus-visible:ring-1 focus-visible:ring-white/20 h-11 rounded-xl"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer border border-white/5">
            <Avatar className="w-8 h-8 border border-white/20 p-0.5">
              <AvatarImage src="https://picsum.photos/seed/user1/40/40" />
            </Avatar>
            <span className="text-sm font-bold text-white hidden lg:block">Admin Account</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2.5 hover:bg-white/10 rounded-xl relative transition-colors border border-white/5 bg-white/5 text-white">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-pink-500 rounded-full border-2 border-indigo-900" />
            </button>
            <button className="p-2.5 hover:bg-white/10 rounded-xl transition-colors border border-white/5 bg-white/5 text-white">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-8 bg-white rounded-tl-[3rem] shadow-[inset_0_4px_24px_rgba(0,0,0,0.1)]">
        <div className="mx-auto max-w-7xl space-y-8">
          {children}
        </div>
      </main>
    </SidebarInset>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <AppSidebar />
      <MainLayoutContent pathname={pathname}>{children}</MainLayoutContent>
    </SidebarProvider>
  );
}
