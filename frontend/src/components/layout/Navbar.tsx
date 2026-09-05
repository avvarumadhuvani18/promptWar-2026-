import React from "react";
import {
  Activity,
  UserPlus,
  UploadCloud,
  Cpu,
  LayoutDashboard,
  FileText,
  FlaskConical,
  Clock,
  AlertTriangle,
  Sparkles,
  RotateCcw,
} from "lucide-react";
import { ActiveScreen } from "@/types/clinical";

interface NavbarProps {
  currentScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  onLoadDemo: () => void;
  patientName?: string;
  isDemo?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentScreen,
  onNavigate,
  onLoadDemo,
  patientName = "Eleanor Vance",
  isDemo = true,
}) => {
  const navItems: Array<{ id: ActiveScreen; label: string; icon: React.ReactNode; badge?: string }> = [
    { id: "landing", label: "Overview", icon: <Activity className="w-3.5 h-3.5" /> },
    { id: "intake", label: "Intake", icon: <UserPlus className="w-3.5 h-3.5" /> },
    { id: "upload", label: "Upload", icon: <UploadCloud className="w-3.5 h-3.5" /> },
    { id: "processing", label: "Pipeline", icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
    { id: "reports", label: "Reports", icon: <FileText className="w-3.5 h-3.5" /> },
    { id: "labs", label: "Lab Results", icon: <FlaskConical className="w-3.5 h-3.5" /> },
    { id: "timeline", label: "Timeline", icon: <Clock className="w-3.5 h-3.5" /> },
    { id: "conflicts", label: "Conflicts", icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />, badge: "2" },
    { id: "summary", label: "AI Summary", icon: <Sparkles className="w-3.5 h-3.5 text-teal-400" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Header Row */}
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 p-0.5 shadow-lg shadow-teal-900/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Activity className="w-5 h-5 text-teal-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-tight">MedLens</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/10 text-teal-300 border border-teal-500/20 font-mono">
                  Clinical AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Clinical Information Intelligence &amp; Provenance
              </p>
            </div>
          </div>

          {/* Active Patient Pill & Demo Reset */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs">
              <span className="w-2 h-2 rounded-full bg-teal-400" />
              <span className="text-slate-300 font-semibold">{patientName}</span>
              {isDemo && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
                  DEMO
                </span>
              )}
            </div>

            <button
              onClick={onLoadDemo}
              title="Reload Eleanor Vance fictional metabolic case"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden md:inline">Load Demo Case</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Row */}
        <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none border-t border-slate-800/60 -mx-4 px-4 sm:mx-0 sm:px-0">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-teal-600 text-white shadow-sm shadow-teal-900/40 font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-900/80 text-rose-200 border border-rose-700">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
