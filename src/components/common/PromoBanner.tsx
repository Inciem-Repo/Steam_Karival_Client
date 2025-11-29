import { Rocket, Trophy, Brain } from "lucide-react";

interface PromoBannerProps {
  icon: any;
  title: string;
  subtitle?: string;
}

const iconMap = {
  rocket: Rocket,
  trophy: Trophy,
  brain: Brain,
};

export function PromoBanner({ icon, title, subtitle }: PromoBannerProps) {
  const Icon = iconMap[icon as keyof typeof iconMap] ?? Rocket;

  return (
    <div>
      {/* Icon */}
      <div
        className="
          w-10 h-10 
          flex items-center justify-center 
          rounded-full 
          bg-[#1E88E5]/30 
          text-white
        "
      >
        <Icon size={20} strokeWidth={2.3} />
      </div>

      {/* Content */}
      <div className="mt-4 space-y-1">
        <h3 className="font-semibold text-white text-base leading-tight">
          {title}
        </h3>

        {subtitle && (
          <p className="text-sm text-gray-300 mt-1 leading-snug">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
