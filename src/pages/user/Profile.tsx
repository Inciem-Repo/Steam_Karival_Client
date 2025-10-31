import { useState, useEffect, type JSX } from "react";
import { quizQuestions } from "../../utils/constants/quizzData";
import ResultCard from "../../components/common/ResultCard";
import { useAuth } from "../../context/AuthContext";
import { getProfileService } from "../../services/auth";
import { useApi } from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/common/ConfirmModal";

interface UserProfile {
  _id: string;
  email: string;
  is_quiz_attempted: boolean;
  name: string;
  phone: string;
  role: string;
  school: string;
  score: {
    total_correct: number;
    total_questions: number;
  };
}

export const Profile = (): JSX.Element => {
  //   const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { user, logout } = useAuth();
  const { callApi: callGetProfile } = useApi(getProfileService);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const response = await callGetProfile(user?.id);
      if (response?.status && response.user) {
        setUserProfile(response.user);
        const { total_correct, total_questions } = response.user.score;
        setCorrectCount(total_correct);
        setWrongCount(total_questions - total_correct);
        setScore(total_correct);
      }
    };

    fetchProfile();

    const savedAnswers = localStorage.getItem("quizAnswers");
    if (savedAnswers) {
      const userAnswers: (number | null)[] = JSON.parse(savedAnswers);
      //   setAnswers(userAnswers);

      let correct = 0;
      let wrong = 0;
      userAnswers.forEach((answer, index) => {
        if (answer === quizQuestions[index].correctAnswer) {
          correct++;
        } else if (answer !== null) {
          wrong++;
        } else {
          wrong++;
        }
      });

      setCorrectCount(correct);
      setWrongCount(wrong);
      setScore(correct);
    } else {
      //   setLocation("/home");
    }
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <main className="flex h-auto  max-w-full px-4 py-8 relative flex-col items-start gap-6 overflow-y-auto">
        <div className="flex items-center justify-between relative self-stretch w-full">
          <button
            onClick={() => {
              navigate("/");
            }}
            className="flex items-center justify-center w-8 h-8"
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
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex items-center justify-center w-8 h-8"
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

        <div className="flex flex-col items-center gap-6 relative self-stretch w-full">
          <div className="w-full flex items-start">
            <h1 className="relative font-h1-bold text-black tracking-[var(--h1-bold-letter-spacing)] leading-[var(--h1-bold-line-height)] [font-style:var(--h1-bold-font-style)]">
              User Profile
            </h1>
          </div>

          <ResultCard
            score={userProfile?.score?.total_correct || score}
            total={userProfile?.score?.total_questions || 0}
            correctCount={userProfile?.score?.total_correct || correctCount}
            wrongCount={
              userProfile
                ? userProfile?.score?.total_questions -
                  userProfile?.score?.total_correct
                : wrongCount
            }
          />

          <button
            type="submit"
            className="w-full btn flex items-center justify-center gap-2"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 15.577L8.461 12.039L9.169 11.319L11.5 13.65V5H12.5V13.65L14.83 11.32L15.539 12.039L12 15.577ZM6.616 19C6.15533 19 5.771 18.846 5.463 18.538C5.155 18.23 5.00067 17.8453 5 17.384V14.961H6V17.384C6 17.538 6.064 17.6793 6.192 17.808C6.32 17.9367 6.461 18.0007 6.615 18H17.385C17.5383 18 17.6793 17.936 17.808 17.808C17.9367 17.68 18.0007 17.5387 18 17.384V14.961H19V17.384C19 17.8447 18.846 18.229 18.538 18.537C18.23 18.845 17.8453 18.9993 17.384 19H6.616Z"
                fill="black"
              />
            </svg>
            Download Your Certificate
          </button>

          <div className="flex flex-col gap-4 relative self-stretch w-full">
            <form className="space-y-4">
              <div>
                <label className="block mb-2 font-body-semibold">Name</label>
                <input
                  type="text"
                  placeholder="Enter Your Name"
                  className="w-full input"
                  value={userProfile?.name || ""}
                  readOnly
                />
              </div>
              <div>
                <label className="block mb-2 font-body-semibold">
                  Email ID
                </label>
                <input
                  type="email"
                  placeholder="Enter Your Email ID"
                  className="w-full input"
                  value={userProfile?.email || ""}
                  readOnly
                />
              </div>
              <div>
                <label className="block mb-2 font-body-semibold">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    placeholder="Enter Your Phone Number"
                    className="flex-1 input"
                    value={userProfile?.phone || ""}
                    readOnly
                  />
                </div>
              </div>
              <div>
                <label className="block mb-2 font-body-semibold">School</label>
                <input
                  type="text"
                  placeholder="Enter Your School"
                  className="w-full input"
                  value={userProfile?.school || ""}
                  readOnly
                />
              </div>
            </form>
          </div>
        </div>
      </main>
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
