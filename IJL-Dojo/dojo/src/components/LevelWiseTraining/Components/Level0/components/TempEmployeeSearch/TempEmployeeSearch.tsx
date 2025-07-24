import { useState } from "react";
import Level0Nav from "../Level0Nav/Level0Nav";
import HumanBodyCheckSheet from "../HumanBodyCheckSheet/HumanBodyCheckSheet";

interface UserInfo {
    id: number;
    firstName: string;
    lastName: string;
    tempId: string;
    email: string;
    phoneNumber: string;
    sex: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
}

const TempEmployeeSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [results, setResults] = useState<UserInfo[]>([]);
    const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        setSelectedUser(null); // clear selected user on new input

        if (term.length >= 2) {
            try {
                setIsLoading(true);
                setError("");

                const response = await fetch("http://127.0.0.1:8000/temp-user-info/");
                const newresponse = await fetch("http://127.0.0.1:8000/allpassed-users/");
                const passeddata: any = await newresponse.json();
                console.log(passeddata)
                if (!response.ok) throw new Error("Failed to fetch user info");

                const data: UserInfo[] = await response.json();

                const filtered = data.filter(
                    (user) =>
                        `${user.firstName} ${user.lastName}`.toLowerCase().includes(term.toLowerCase())
                        // user.email.toLowerCase().includes(term.toLowerCase()) ||
                        // user.phoneNumber.includes(term)
                );

                setResults(filtered);
                if (filtered.length === 0) setError("No matching users found");
            } catch (err) {
                console.error(err);
                setError("Error fetching user info");
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        } else {
            setResults([]);
            setError(term.length ? "Type at least 2 characters" : "");
        }
    };

    return (
       <>
        <Level0Nav />
        <div className="p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen">
            {/* Search Bar - Matching EmployeeHistorySearch style */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search user by name, email or phone..."
                        className="w-full p-3 pl-10 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    <svg
                        className="absolute left-3 top-3.5 text-gray-400 w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>

                    {/* Search Results Dropdown */}
                    {isLoading && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                            <div className="flex justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                            </div>
                        </div>
                    )}

                    {error && !isLoading && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-3 text-red-500">
                            {error}
                        </div>
                    )}

                    {results.length > 0 && !isLoading && (
                        <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                            {results.map((user) => (
                                <li
                                    key={user.tempId}
                                    className="p-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-200 last:border-0"
                                    onClick={() => {
                                        setSelectedUser(user);
                                        setSearchTerm(`${user.firstName} ${user.lastName}`);
                                        setResults([]);
                                    }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">
                                            {user.firstName} {user.lastName}
                                        </span>
                                        <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                            {user.tempId}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs mt-1">
                                        <span className="text-gray-600">{user.email}</span>
                                        <span className="text-gray-600">{user.phoneNumber}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Show form only if a user is selected */}
            {selectedUser && (
                <div className="max-w-6xl mx-auto mt-10">
                    <HumanBodyCheckSheet
                        tempId={selectedUser.tempId}
                        userDetails={selectedUser}
                    />
                </div>
            )}
        </div>
        </>
    );
};

export default TempEmployeeSearch;