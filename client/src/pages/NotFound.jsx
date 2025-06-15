import { Link } from "react-router";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg text-gray-400 mb-6">The page you are looking for does not exist.</p>
      <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
