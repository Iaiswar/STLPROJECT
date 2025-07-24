import UserInfoEntry from "./components/TempUserInfoEntry/TempUserInfoEntry";
import Level0Nav from "./components/Level0Nav/Level0Nav";



const Level0 = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <Level0Nav />

      {/* Main Content */}
      <main className="max-w-full mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <UserInfoEntry />
        </div>
      </main>
    </div>
  );
};

export default Level0;