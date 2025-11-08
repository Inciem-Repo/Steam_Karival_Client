import { Rocket, Trophy, Brain } from "lucide-react";

interface PromoBannerProps {
  icon: "rocket" | "trophy" | "brain";
  title: string;
  subtitle?: string;
  className?: string;
  variant?: "primary" | "accent" | "secondary";
}

const iconMap = {
  rocket: Rocket,
  trophy: Trophy,
  brain: Brain,
};

const iconGradients = {
  primary: "bg-primary",
  accent: "bg-primary",
  secondary: "bg-primary",
};

const textColors = {
  primary: "text-black",
  accent: "text-black", 
  secondary: "text-black"
};

const subtitleColors = {
  primary: "text-blue-700",
  accent: "text-blue-700",
  secondary: "text-blue-700"
};

export function PromoBanner({ 
  icon, 
  title, 
  subtitle, 
  variant = "primary" 
}: PromoBannerProps) {
  const Icon = iconMap[icon];
  
  return (
    <div className={`group relative overflow-hidden border-2  backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl rounded-2xl border-primary `}>
      {/* Animated background orbs */}
      <div className="absolute -top-16 -right-16 w-40 h-40  rounded-full blur-3xl animate-pulse opacity-50" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32  rounded-full blur-2xl animate-bounce opacity-40" />
      <div className="relative p-6 bg-white/70 backdrop-blur-sm rounded-2xl">
        {/* Icon */}
        <div className={`mb-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${iconGradients[variant]} flex items-center justify-center shadow-lg transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
          <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <h3 className={`text-xl font-bold leading-tight tracking-tight ${textColors[variant]}`}>
            {title}
          </h3>
          {subtitle && (
            <p className={`text-sm font-medium ${subtitleColors[variant]}`}>
              {subtitle}
            </p>
          )}
        </div>

        {/* Decorative line */}
        <div className={`mt-4 h-1 w-16 bg-gradient-to-r ${iconGradients[variant]} rounded-full opacity-50 group-hover:w-24 transition-all duration-300`} />
      </div>
    </div>
  );
}
