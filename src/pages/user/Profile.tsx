import { useState, useEffect } from "react";
import ResultCard from "../../components/common/ResultCard";
import { useAuth } from "../../context/AuthContext";
import { getProfileService } from "../../services/auth";
import { useApi } from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";
import { downloadCertificateAsPDF } from "../../utils/downloadCertificate";
import type { User } from "../../utils/types/user";
import { quizCategory } from "../../utils/constants/values";

const Profile = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loadingCertificates, setLoadingCertificates] = useState<{
    [key: string]: boolean;
  }>({});
  const { user, logout } = useAuth();
  const { callApi: callGetProfile } = useApi(getProfileService);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await callGetProfile(user?.id);
      if (response?.status && response.user) {
        setUserProfile(response.user);
      }
    };
    fetchProfile();
  }, []);

  const handleDownloadCertificate = async (level: string) => {
    try {
      setLoadingCertificates((prev) => ({ ...prev, [level]: true }));
      await downloadCertificateAsPDF(userProfile?.name || "Student Name");
    } catch (error) {
      console.error(`Error downloading ${level} certificate:`, error);
    } finally {
      setLoadingCertificates((prev) => ({ ...prev, [level]: false }));
    }
  };

  const getLevelDisplayName = (level: string) => {
    const levelNames: { [key: string]: string } = {
      school_level: "School Level",
      state_level: "State Level",
      national_level: "National Level",
      global_level: "Global Level",
    };
    return levelNames[level] || level;
  };

  return (
    <div className="w-full min-h-screen py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center justify-center w-10 h-10 rounded-lg "
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.25"
                y="0.25"
                width="35.5"
                height="35.5"
                rx="17.75"
                stroke="black"
                strokeWidth="0.5"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.8916 18.4417C10.7746 18.3245 10.7089 18.1656 10.7089 18C10.7089 17.8344 10.7746 17.6755 10.8916 17.5583L15.8916 12.5583C15.9489 12.4969 16.0179 12.4477 16.0945 12.4135C16.1712 12.3794 16.254 12.361 16.3379 12.3595C16.4218 12.358 16.5052 12.3735 16.583 12.4049C16.6608 12.4363 16.7315 12.4831 16.7908 12.5425C16.8502 12.6018 16.897 12.6725 16.9284 12.7503C16.9598 12.8282 16.9753 12.9115 16.9738 12.9954C16.9723 13.0794 16.954 13.1621 16.9198 13.2388C16.8856 13.3155 16.8364 13.3845 16.775 13.4417L12.8416 17.375H24.6666C24.8324 17.375 24.9914 17.4409 25.1086 17.5581C25.2258 17.6753 25.2916 17.8342 25.2916 18C25.2916 18.1658 25.2258 18.3247 25.1086 18.4419C24.9914 18.5592 24.8324 18.625 24.6666 18.625H12.8416L16.775 22.5583C16.8364 22.6156 16.8856 22.6846 16.9198 22.7612C16.954 22.8379 16.9723 22.9206 16.9738 23.0046C16.9753 23.0885 16.9598 23.1718 16.9284 23.2497C16.897 23.3275 16.8502 23.3982 16.7908 23.4575C16.7315 23.5169 16.6608 23.5637 16.583 23.5951C16.5052 23.6265 16.4218 23.642 16.3379 23.6405C16.254 23.639 16.1712 23.6206 16.0945 23.5865C16.0179 23.5523 15.9489 23.5031 15.8916 23.4417L10.8916 18.4417Z"
                fill="black"
              />
            </svg>
          </button>

          <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center justify-center w-10 h-10 rounded-lg"
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.25"
                y="0.25"
                width="35.5"
                height="35.5"
                rx="17.75"
                stroke="black"
                stroke-width="0.5"
              />
              <g clip-path="url(#clip0_130_592)">
                <path
                  d="M10.0005 26V10H18.0205V11H11.0005V25H18.0205V26H10.0005ZM22.4625 21.539L21.7605 20.819L24.0795 18.5H15.1925V17.5H24.0795L21.7595 15.18L22.4615 14.462L26.0005 18L22.4625 21.539Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_130_592">
                  <rect
                    width="20"
                    height="20"
                    fill="white"
                    transform="matrix(0 -1 1 0 8 28)"
                  />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-2xl font-bold">
                {userProfile?.name
                  ? userProfile.name
                      .split(" ")
                      .map((word: string) => word.charAt(0))
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : "US"}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {userProfile?.name || "User"}
              </h2>
              <p className="text-gray-600 text-sm mt-1">Quiz Participant</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-500">Email</span>
              </div>
              <p className="text-gray-900 font-medium pl-11">
                {userProfile?.email
                  ? userProfile.email.length <= 17
                    ? userProfile.email
                    : userProfile.email.substring(0, 15) + "..."
                  : "Not provided"}
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-500">Phone</span>
              </div>
              <p className="text-gray-900 font-medium pl-11">
                {userProfile?.phone || "Not provided"}
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-500">
                  School
                </span>
              </div>
              <p className="text-gray-900 font-medium pl-11">
                {userProfile?.school || "Not provided"}
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-orange-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-500">
                  Current Level
                </span>
              </div>
              <p className="text-gray-900 font-medium pl-11 capitalize">
                {userProfile?.current_quiz_level
                  ? userProfile.current_quiz_level.replace("_", " ")
                  : "Not started"}
              </p>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Progress
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Track your performance across different quiz levels and download
            certificates for completed levels.
          </p>
        </div>

        <div className="space-y-4">
          {Object.values(quizCategory)?.map((levelKey) => {
            const levelData = userProfile?.levels[levelKey];
            const isAttempted = levelData?.attempted || false;
            const correctCount = levelData?.correct || 0;
            const totalQuestions = levelData?.total || 0;
            const wrongCount = totalQuestions - correctCount;
            const percentage = levelData?.percentage || 0;

            return (
              <div
                key={levelKey}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {getLevelDisplayName(levelKey)}
                    </h3>
                    {isAttempted && (
                      <p className="text-sm text-gray-600 mt-1">
                        Score: {correctCount}/{totalQuestions} ({percentage}%)
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      isAttempted
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-gray-100 text-gray-600 border border-gray-200"
                    }`}
                  >
                    {isAttempted ? "Completed" : "Not Attempted"}
                  </span>
                </div>

                {isAttempted ? (
                  <>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Progress</span>
                        <span>{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <ResultCard
                        score={correctCount}
                        total={totalQuestions}
                        correctCount={correctCount}
                        wrongCount={wrongCount}
                      />
                    </div>

                    {/* Download Button */}
                    <button
                      type="button"
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => handleDownloadCertificate(levelKey)}
                      disabled={loadingCertificates[levelKey]}
                    >
                      {loadingCertificates[levelKey] ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                            ></path>
                          </svg>
                          <span>Generating Certificate...</span>
                        </>
                      ) : (
                        <>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 15.577L8.461 12.039L9.169 11.319L11.5 13.65V5H12.5V13.65L14.83 11.32L15.539 12.039L12 15.577ZM6.616 19C6.15533 19 5.771 18.846 5.463 18.538C5.155 18.23 5.00067 17.8453 5 17.384V14.961H6V17.384C6 17.538 6.064 17.6793 6.192 17.808C6.32 17.9367 6.461 18.0007 6.615 18H17.385C17.5383 18 17.6793 17.936 17.808 17.808C17.9367 17.68 18.0007 17.5387 18 17.384V14.961H19V17.384C19 17.8447 18.846 18.229 18.538 18.537C18.23 18.845 17.8453 18.9993 17.384 19H6.616Z"
                              fill="currentColor"
                            />
                          </svg>
                          Download Certificate
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  /* Not Attempted State */
                  <div className="text-center py-6">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-gray-400"
                      >
                        <path
                          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M12 8V12M12 16H12.01"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                    <p className="text-gray-500 mb-4">No quiz attempted yet</p>
                    <button
                      type="button"
                      className="w-full px-4 py-3 bg-gray-100 text-gray-500 rounded-lg font-medium cursor-not-allowed"
                      disabled
                    >
                      Certificate Not Available
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {showLogoutConfirm && (
        <ConfirmModal
          title="Confirm Logout"
          message="Are you sure you want to log out?"
          btnName="Logout"
          onConfirm={() => logout()}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  );
};

export default Profile;
