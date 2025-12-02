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
import SkeletonLoader from "../../components/ui/SkeletonLoader";

const Profile = () => {
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loadingCertificates, setLoadingCertificates] = useState<{
    [key: string]: boolean;
  }>({});
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const { user, logout } = useAuth();
  const { callApi: callGetProfile } = useApi(getProfileService);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const response = await callGetProfile(user?.id);
        if (response?.status && response.user) {
          setUserProfile(response.user);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleDownloadCertificate = async (level: string) => {
    try {
      setLoadingCertificates((prev) => ({ ...prev, [level]: true }));
      await downloadCertificateAsPDF(userProfile?.name || "Student Name");
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0A1A2F] to-[#10263F] px-4 py-10 font-manrope relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-28 w-[400px] h-[400px] bg-[#1E88E5]/20 blur-[160px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[420px] h-[420px] bg-[#42A5F5]/20 blur-[150px] rounded-full" />
      </div>
      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10 md:mb-14">
          <button
            onClick={() => navigate("/home")}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition"
          >
            ←
          </button>

          <h1 className="text-2xl md:text-3xl font-extrabold text-white">
            User Profile
          </h1>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 border border-white/10 text-white hover:bg-white/20 transition"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_130_593)">
                <path
                  d="M2 18V2H10.02V3H3V17H10.02V18H2ZM14.462 13.539L13.76 12.819L16.079 10.5H7.192V9.5H16.079L13.759 7.18L14.461 6.462L18 10L14.462 13.539Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_130_593">
                  <rect
                    width="20"
                    height="20"
                    fill="white"
                    transform="matrix(0 -1 1 0 0 20)"
                  />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl p-6 md:p-8">
            {isLoading ? (
              <>
                <div className="flex items-center gap-5 mb-8">
                  <SkeletonLoader
                    variant="image"
                    circle
                    width={80}
                    height={80}
                  />
                  <div className="space-y-2 flex-1">
                    <SkeletonLoader
                      variant="text"
                      width="60%"
                      height={28}
                      lines={1}
                    />
                    <SkeletonLoader
                      variant="text"
                      width="40%"
                      height={16}
                      lines={1}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item}>
                      <SkeletonLoader
                        variant="text"
                        width="30%"
                        height={16}
                        lines={1}
                      />
                      <SkeletonLoader
                        variant="text"
                        width="70%"
                        height={20}
                        lines={1}
                        className="mt-2"
                      />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-5 mb-8">
                  <div className="w-20 h-20 rounded-full bg-[#1E88E5] flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-bold">
                      {userProfile?.name
                        ?.split(" ")
                        .map((w) => w.charAt(0))
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "US"}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {userProfile?.name || "User"}
                    </h2>
                    <p className="text-gray-300 text-sm">Quiz Participant</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white font-medium mt-1">
                      {userProfile?.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white font-medium mt-1">
                      {userProfile?.phone || "Not provided"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400">School</p>
                    <p className="text-white font-medium mt-1">
                      {userProfile?.school || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Current Level</p>
                    <p className="text-white font-medium mt-1 capitalize">
                      {userProfile?.current_quiz_level?.replace("_", " ") ||
                        "Not started"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Your Progress</h2>
            <p className="text-gray-300 text-sm mb-8">
              Track your performance and download certificates.
            </p>

            <div className="space-y-6">
              {isLoading ? (
                <>
                  {[1, 2, 3, 4].map((item) => (
                    <div
                      key={item}
                      className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="space-y-2">
                          <SkeletonLoader
                            variant="text"
                            width="40%"
                            height={24}
                            lines={1}
                          />
                          <SkeletonLoader
                            variant="text"
                            width="30%"
                            height={16}
                            lines={1}
                          />
                        </div>
                        <SkeletonLoader
                          variant="text"
                          width="20%"
                          height={24}
                          lines={1}
                        />
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between mb-2">
                          <SkeletonLoader
                            variant="text"
                            width="15%"
                            height={16}
                            lines={1}
                          />
                          <SkeletonLoader
                            variant="text"
                            width="10%"
                            height={16}
                            lines={1}
                          />
                        </div>
                        <SkeletonLoader
                          variant="text"
                          width="full"
                          height={8}
                          lines={1}
                        />
                      </div>

                      <div className="py-4">
                        <SkeletonLoader
                          variant="text"
                          width="full"
                          height={60}
                          lines={2}
                        />
                      </div>

                      <SkeletonLoader
                        variant="text"
                        width="full"
                        height={44}
                        lines={1}
                      />
                    </div>
                  ))}
                </>
              ) : (
                Object.values(quizCategory).map((levelKey) => {
                  const level = userProfile?.levels[levelKey];
                  const isAttempted = level?.attempted || false;
                  const correct = level?.correct || 0;
                  const total = level?.total || 0;
                  const percentage = level?.percentage || 0;

                  return (
                    <div
                      key={levelKey}
                      className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:bg-white/20 transition"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-white font-semibold text-lg">
                            {getLevelDisplayName(levelKey)}
                          </h3>
                          {isAttempted && (
                            <p className="text-gray-300 text-sm mt-1">
                              Score: {correct}/{total} ({percentage}%)
                            </p>
                          )}
                        </div>

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium 
                            ${
                              isAttempted
                                ? "bg-green-500/20 text-green-300 border border-green-400/20"
                                : "bg-gray-500/20 text-gray-300 border border-gray-400/20"
                            }`}
                        >
                          {isAttempted ? "Completed" : "Not Attempted"}
                        </span>
                      </div>

                      {isAttempted ? (
                        <>
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-300 mb-2">
                              <span>Progress</span>
                              <span>{percentage}%</span>
                            </div>

                            <div className="w-full bg-white/20 h-2 rounded-full">
                              <div
                                className="bg-green-400 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>

                          <ResultCard
                            score={correct}
                            total={total}
                            correctCount={correct}
                            wrongCount={total - correct}
                          />

                          <button
                            onClick={() => handleDownloadCertificate(levelKey)}
                            disabled={loadingCertificates[levelKey]}
                            className="w-full mt-4 px-4 py-3 bg-[#1E88E5] hover:bg-[#42A5F5] text-white rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingCertificates[levelKey]
                              ? "Generating..."
                              : "Download Certificate"}
                          </button>
                        </>
                      ) : (
                        <div className="text-center py-6 text-gray-300">
                          <p>No quiz attempted yet</p>
                          <button
                            className="mt-4 w-full py-3 bg-white/10 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
                            disabled
                          >
                            Certificate Not Available
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
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
