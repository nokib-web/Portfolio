import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
    const navItems = [
        { name: "Introduction", path: "/" },
        { name: "About Me", path: "/about" },
        { name: "Projects", path: "/projects" },
        { name: "Skills & Tools", path: "/skills" },
        { name: "Experience", path: "/experience" },
        { name: "Education", path: "/education" },
        { name: "Contact", path: "/contact" },
        { name: "Stats", path: "/stats" },
    ];

    return (
        <aside className="w-64 border-r border-gray-200 dark:border-gray-800 p-6 hidden md:block">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Sections</h2>
            <nav className="space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                                ? "bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white"
                                : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                            }`
                        }
                    >
                        {item.name}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
