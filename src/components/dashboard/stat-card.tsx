
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  variant?: 'purple' | 'blue' | 'orange';
}

export function StatCard({ title, value, description, icon: Icon, variant = 'blue' }: StatCardProps) {
  const gradients = {
    purple: 'from-[#B666D2] to-[#8E54E9]',
    blue: 'from-[#4FACFE] to-[#00F2FE]',
    orange: 'from-[#FF9A8B] to-[#FF6A88]',
  };

  return (
    <Card className={`overflow-hidden border-none shadow-xl bg-gradient-to-br ${gradients[variant]} text-white min-h-[160px] relative group transition-transform hover:scale-[1.02]`}>
      <CardContent className="p-6 h-full flex flex-col justify-between">
        <div>
          <div className="bg-white/20 w-8 h-8 rounded-lg flex items-center justify-center mb-4">
            <Icon className="w-4 h-4 text-white" />
          </div>
          <div className="text-sm font-medium opacity-90 uppercase tracking-wider mb-1">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        {description && (
          <p className="text-xs font-medium mt-4 bg-white/10 w-fit px-2 py-1 rounded">
            {description}
          </p>
        )}
        
        {/* Decorative bubbles similar to screenshot */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors" />
        <div className="absolute right-4 top-4 w-12 h-12 bg-white/5 rounded-full blur-xl" />
      </CardContent>
    </Card>
  );
}
