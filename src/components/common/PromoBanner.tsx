import { Rocket, Trophy, Brain, Sparkles } from "lucide-react";

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

const variantStyles = {
  primary: "from-blue-500/10 via-purple-500/5 to-transparent border-blue-300",
  accent: "from-green-500/10 via-emerald-500/5 to-transparent border-green-300",
  secondary: "from-red-500/10 via-orange-500/5 to-transparent border-red-300",
};

const iconGradients = {
  primary: "from-blue-500 to-purple-600",
  accent: "from-green-500 to-emerald-600",
  secondary: "from-red-500 to-orange-600",
};

const textColors = {
  primary: "text-blue-900",
  accent: "text-green-900", 
  secondary: "text-red-900"
};

const subtitleColors = {
  primary: "text-blue-700",
  accent: "text-green-700",
  secondary: "text-red-700"
};

export function PromoBanner({ 
  icon, 
  title, 
  subtitle, 
  className = "", 
  variant = "primary" 
}: PromoBannerProps) {
  const Icon = iconMap[icon];
  
  return (
    <div className={`group relative overflow-hidden border-2 bg-gradient-to-br backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl rounded-2xl ${variantStyles[variant]} ${className}`}>
      {/* Animated background orbs */}
      <div className="absolute -top-16 -right-16 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse opacity-50" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-green-500/20 to-blue-500/20 rounded-full blur-2xl animate-bounce opacity-40" />
      
      {/* Sparkle effect on hover */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <Sparkles className="w-5 h-5 text-yellow-500 animate-pulse" />
      </div>

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
