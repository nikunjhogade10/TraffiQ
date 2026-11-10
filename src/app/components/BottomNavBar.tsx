import React from "react";
import { Home, Map, Bell, BarChart2, User } from "lucide-react";
import { Screen } from "../types";

interface BottomNavBarProps {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  hasAlerts?: boolean;
}

export function BottomNavBar({ currentScreen, navigate, hasAlerts = false }: BottomNavBarProps) {
  const tabs = [
    { id: "dashboard" as Screen, label: "Home", Icon: Home },
    { id: "live-map" as Screen, label: "Live Map", Icon: Map },
    { id: "alerts" as Screen, label: "Alerts", Icon: Bell, badge: hasAlerts },
    { id: "analytics" as Screen, label: "Analytics", Icon: BarChart2 },
    { id: "profile" as Screen, label: "Profile", Icon: User },
  ];

  return (
    <nav
      aria-label="Main mobile navigation"
      className="flex-shrink-0 bg-white border-t border-slate-200/80 px-2 py-1.5"
      style={{
        boxShadow: "0 -2px 10px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map(({ id, label, Icon, badge }) => {
          const isActive = currentScreen === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => navigate(id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 ${
                isActive
                  ? "text-[#4B168C] font-semibold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              style={{ minWidth: "60px" }}
              aria-current={isActive ? "page" : undefined}
            >
              <div
                className={`relative flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
                  isActive ? "bg-purple-100/70" : "bg-transparent"
                }`}
              >
                <Icon
                  size={19}
                  strokeWidth={isActive ? 2.2 : 1.75}
                  className={isActive ? "text-[#4B168C]" : "text-slate-500"}
                  aria-hidden="true"
                />
                {badge && (
                  <span
                    className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"
                    aria-label="New alerts"
                  />
                )}
              </div>
              <span
                className={`text-[10.5px] mt-0.5 tracking-tight ${
                  isActive ? "text-[#4B168C] font-bold" : "text-slate-500 font-medium"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

