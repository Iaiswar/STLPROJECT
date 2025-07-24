import { Link, useLocation } from "react-router-dom";
import { FaUserCheck, FaCalendarAlt, FaTable } from "react-icons/fa";

const Level0Nav = () => {
    const location = useLocation();

    const navItems = [
        { name: "Add New User", path: "/Level0", icon: <FaCalendarAlt className="mr-2" /> },
        { name: "EmployeeSearch", path: "/TempEmployeeSearch", icon: <FaUserCheck className="mr-2" /> },

        { name: "Employee Details", path: "/PassedUsersTable", icon: <FaTable className="mr-2" /> },
    ];

    return (
        // <nav className="bg-white shadow-md border-b border-gray-200">
        <nav className="bg-gray-50 pt-5">
            {/* <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10"> */}
            <div className=" mx-auto px-6 sm:px-8 lg:px-10">
                <div className="flex justify-between items-center h-16">

                    {/* Title section */}
                    <div className="flex flex-col justify-center">
                        <span className="text-xl font-extrabold text-gray-800 tracking-tight">
                            Level 0
                        </span>
                        {/* <span className="text-sm text-gray-500">
              Employee Skill Management System
            </span> */}
                    </div>

                    {/* Navigation links */}
                    <div className="flex items-center space-x-4">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition duration-200 ${isActive
                                        ? "bg-blue-100 text-blue-700"
                                        : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                                        }`}
                                >
                                    {item.icon}
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Level0Nav;
