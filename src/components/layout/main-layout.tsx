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
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard,
  ClipboardList,
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
      className="border-none bg-gradient-to-b from-indigo-700 via-purple-700 to-indigo-900 text-white no-print [&_[data-sidebar=sidebar]]:bg-transparent"
    >
      <SidebarHeader className="p-4 border-b border-white/10 transition-all duration-300 group-data-[state=collapsed]:p-2">
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
      <SidebarContent className="px-2 py-4 pl-4 bg-transparent overflow-x-hidden no-scrollbar">
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
                    "text-white/80 hover:bg-white/10 hover:text-white",
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
                <SidebarMenuButton className="px-4 py-6 group flex justify-between items-center transition-all duration-300 rounded-l-full rounded-r-none text-white/80 hover:bg-white/10 data-[state=open]:bg-white/5">
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
                            "text-white/70 hover:bg-white/10 hover:text-white",
                            isActive && "bg-white text-indigo-900 font-black shadow-[-4px_0_12px_rgba(0,0,0,0.1)] hover:bg-white hover:text-indigo-900"
                          )}
                        >
                          <Link href={item.href} className="flex items-center gap-3 w-full">
                            <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-indigo-700" : "text-white/70")} />
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
                <SidebarMenuButton className="px-4 py-6 group flex justify-between items-center transition-all duration-300 rounded-l-full rounded-r-none text-white/80 hover:bg-white/10 data-[state=open]:bg-white/5">
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
                            "text-white/70 hover:bg-white/10 hover:text-white",
                            isActive && "bg-white text-indigo-900 font-black shadow-[-4px_0_12px_rgba(0,0,0,0.1)] hover:bg-white hover:text-indigo-900"
                          )}
                        >
                          <Link href={item.href} className="flex items-center gap-3 w-full">
                            <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-indigo-700" : "text-white/70")} />
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

function MainLayoutContent({ children }: { children: React.ReactNode }) {
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
      className="bg-gradient-to-b from-indigo-700 via-purple-700 to-indigo-900 transition-all duration-300 h-svh flex flex-col overflow-hidden"
    >
      <main className="flex-1 overflow-auto bg-white transition-all duration-300">
        <div className="mx-auto max-w-7xl p-4 md:p-8 space-y-8">
          {children}
        </div>
      </main>
    </SidebarInset>
  );
}

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <MainLayoutContent>{children}</MainLayoutContent>
    </SidebarProvider>
  );
}