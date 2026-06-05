
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
      className="border-none bg-gradient-to-b from-emerald-700 via-emerald-600 to-emerald-800 text-white no-print"
    >
      <SidebarHeader className="p-4 border-b border-white/10 transition-all duration-300 group-data-[state=collapsed]:p-2">
        <div className="flex items-center gap-3 mb-6 group-data-[state=collapsed]:mb-0 group-data-[state=collapsed]:justify-center overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 shadow-lg">
             <GraduationCap className="w-5 h-5 text-emerald-700" />
          </div>
          <span className="font-headline font-bold text-xl text-white tracking-tight truncate group-data-[state=collapsed]:hidden">EduPulse Admin</span>
        </div>
        <div className="flex items-center gap-3 p-2 bg-white/10 rounded-xl group-data-[state=collapsed]:bg-transparent group-data-[state=collapsed]:p-0 group-data-[state=collapsed]:justify-center transition-all duration-300">
          <Avatar className="w-10 h-10 border-2 border-emerald-400 p-0.5 shrink-0">
            <AvatarImage src="https://picsum.photos/seed/user1/40/40" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden group-data-[state=collapsed]:hidden">
            <span className="text-sm font-bold truncate text-white">Admin User</span>
            <span className="text-[10px] text-white/60 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online / ઓનલાઇન
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4 pl-4 bg-transparent">
        <SidebarMenu className="space-y-1">
          {mainNavigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={cn(
                    "px-4 py-6 group flex justify-between items-center transition-all duration-300 rounded-l-full rounded-r-none",
                    "text-white/80 hover:bg-white/10 hover:text-white",
                    isActive && "bg-white text-emerald-700 font-black shadow-[-4px_0_12px_rgba(0,0,0,0.1)] hover:bg-white hover:text-emerald-700"
                  )}
                >
                  <Link href={item.href}>
                    <span className="font-bold group-data-[state=collapsed]:hidden">
                      {item.name}
                    </span>
                    <item.icon className={cn("w-5 h-5", isActive ? "text-emerald-700" : "text-white/80 group-hover:text-white")} />
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
                <SidebarMenuButton className="px-4 py-6 group flex justify-between items-center transition-all duration-300 rounded-l-full rounded-r-none text-white/80 hover:bg-white/10 hover:text-white data-[state=open]:bg-white/5">
                  <span className="font-bold group-data-[state=collapsed]:hidden">Examination / પરીક્ષા</span>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    <ChevronRight className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-90 group-data-[state=collapsed]:hidden" />
                  </div>
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
                            "px-4 py-4 group flex justify-between items-center transition-all duration-300 rounded-l-full rounded-r-none h-auto",
                            "text-white/70 hover:bg-white/10 hover:text-white",
                            isActive && "bg-white text-emerald-700 font-black shadow-[-4px_0_12px_rgba(0,0,0,0.1)] hover:bg-white hover:text-emerald-700"
                          )}
                        >
                          <Link href={item.href}>
                            <span className="text-sm font-medium group-data-[state=collapsed]:hidden">
                              {item.name}
                            </span>
                            <item.icon className={cn("w-4 h-4", isActive ? "text-emerald-700" : "text-white/70 group-hover:text-white")} />
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
                <SidebarMenuButton className="px-4 py-6 group flex justify-between items-center transition-all duration-300 rounded-l-full rounded-r-none text-white/80 hover:bg-white/10 hover:text-white data-[state=open]:bg-white/5">
                  <span className="font-bold group-data-[state=collapsed]:hidden">Settings / સેટિંગ્સ</span>
                  <div className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    <ChevronRight className="w-4 h-4 transition-transform duration-200 group-data-[state=open]:rotate-90 group-data-[state=collapsed]:hidden" />
                  </div>
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
                            "px-4 py-4 group flex justify-between items-center transition-all duration-300 rounded-l-full rounded-r-none h-auto",
                            "text-white/70 hover:bg-white/10 hover:text-white",
                            isActive && "bg-white text-emerald-700 font-black shadow-[-4px_0_12px_rgba(0,0,0,0.1)] hover:bg-white hover:text-emerald-700"
                          )}
                        >
                          <Link href={item.href}>
                            <span className="text-sm font-medium group-data-[state=collapsed]:hidden">
                              {item.name}
                            </span>
                            <item.icon className={cn("w-4 h-4", isActive ? "text-emerald-700" : "text-white/70 group-hover:text-white")} />
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
    <SidebarInset onClick={handleContentClick} className="bg-white transition-all duration-300">
      <header className="flex h-16 shrink-0 items-center justify-between gap-2 bg-white px-6 shadow-sm border-b no-print">
        <div className="flex items-center gap-4 flex-1">
          <SidebarTrigger className="text-emerald-600 hover:bg-emerald-50" />
          <div className="relative w-64 max-sm:hidden">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search Dashboard... / શોધો..."
              className="pl-9 border-none bg-slate-50/50 shadow-none focus-visible:ring-0"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-full hover:bg-muted/50 transition-colors cursor-pointer">
            <Avatar className="w-8 h-8 border border-emerald-500 p-0.5">
              <AvatarImage src="https://picsum.photos/seed/user1/40/40" />
            </Avatar>
            <span className="text-sm font-medium text-muted-foreground hidden lg:block">Admin Account / એડમિન</span>
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
      <main className="flex-1 overflow-auto p-4 md:p-8">
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
