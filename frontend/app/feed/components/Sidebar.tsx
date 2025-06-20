import React from "react";

const navItems = [
  { icon: "🏠", label: "Flow Zone" },
  { icon: "🔍", label: "From the Market" },
  { icon: "🔔", label: "Usable" },
  { icon: "✉️", label: "SEO Validation" },
  { icon: "📊", label: "Scalability Zone" },
  { icon: "👥", label: "Complexity Validation" },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-[#f5f5f5] p-3 border-r border-[#e5e7eb] flex flex-col justify-between">
      <div>
        <div className="mb-6 p-2">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="w-7 h-7 text-[#1a1a1a]">
            <g>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
            </g>
          </svg>
        </div>
        <nav>
          <div className="space-y-1">
            {navItems.map((item, index) => (
              <div
                key={index}
                className={`flex items-center px-3 py-3 rounded-md text-base hover:bg-[rgba(0,0,0,0.05)] cursor-pointer`}
              >
                <span className="mr-4">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </nav>
      </div>
      <div className="mb-4 w-[200px] px-3">
        <div className="flex items-center space-x-3 p-3 rounded-full hover:bg-[rgba(0,0,0,0.05)] cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=user" alt="Profile" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Arko Roy</p>
            <p className="text-xs text-gray-500 truncate">@notarkoroy</p>
          </div>
        </div>
      </div>
    </aside>
  );
} 