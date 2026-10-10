import React, { useState } from "react";
import { ChevronDownIcon, LeafIcon } from "lucide-react";

interface DropdownItem {
  label: string;
  href: string;
}
interface NavItem {
  label: string;
  href?: string;
  dropdown?: DropdownItem[];
}
export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navItems: NavItem[] = [
    {
      label: "Governance Data",
      href: "/governance/site",
    },
    {
      label: "Environment Data",
      href: "/environment/site",
      // label: "Environment Data",
      // dropdown: [
      //   {
      //     label: "Energy & Climate",
      //     href: "/environment/energy-climate",
      //   },
      //   {
      //     label: "Water Management",
      //     href: "/environment/water",
      //   },
      //   {
      //     label: "Waste & Recycling",
      //     href: "/environment/waste",
      //   },
      //   {
      //     label: "Biodiversity Impact",
      //     href: "/environment/biodiversity",
      //   },
      //   {
      //     label: "Energy Consumption",
      //     href: "/environment/energy",
      //   },
      // ],
    },
    {
      label: "Research Data",
      href: "/research/site",
    },
    {
      label: "Infrastructure Data",
      href: "/infrastructure/site",
    },
    {
      label: "Achievement Data",
      href: "/achievements/site",
    },
    {
      label: "Reports",
      href: "/reports/site",
    },
  ];
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: "var(--color-primary)",
              }}
            >
              <LeafIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div
                className="text-lg font-bold"
                style={{
                  color: "var(--color-primary)",
                }}
              >
                Simats Sustainability Portal
              </div>
              <div className="text-xs text-gray-500">Data & Insights</div>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() =>
                  item.dropdown && setActiveDropdown(item.label)
                }
                onMouseLeave={() => setActiveDropdown(null)}
              >
                {item.dropdown ? (
                  <>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 flex items-center space-x-1 rounded-md hover:bg-gray-50 transition-colors">
                      <span>{item.label}</span>
                      <ChevronDownIcon className="w-4 h-4" />
                    </button>
                    {activeDropdown === item.label && (
                      <div className="absolute left-0 mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                        {item.dropdown.map((dropdownItem) => (
                          <a
                            key={dropdownItem.label}
                            href={dropdownItem.href}
                            className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            {dropdownItem.label}
                          </a>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <a
                    href={item.href}
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    {item.label}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* CTA Button
          <button
            className="px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors"
            style={{
              backgroundColor: "var(--color-primary)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor =
                "var(--color-primary-dark)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-primary)")
            }
          >
            Access Portal
          </button> */}
        </div>
      </div>
    </nav>
  );
}
