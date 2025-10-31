import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-b rounded-lg flex items-center justify-center text-white font-bold text-xl">
            <img src={logo} alt="steam karnival" className="w-[100px] h-[100px]" />
          </div>
        </div>

        <div className="mt-8 text-center">
          <div className="bg-white sm:rounded-lg sm:px-10">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900">404</h1>
              <h2 className="mt-2 text-lg font-medium text-gray-900">
                Page not found
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Sorry, we couldn't find the page you're looking for.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate("/")}
                className="btn"
              >
                Return to Dashboard
              </button>
            </div>

            <div className="mt-4">
              <button
                onClick={() => navigate(-1)}
              >
                Go back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
