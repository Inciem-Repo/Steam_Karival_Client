import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { checkOutURL } from "../../utils/constants/env";
import { useApi } from "../../hooks/useApi";
import {
  orderPaymentService,
  verifyPaymentService,
} from "../../services/payment";
import paymentSvg from "../../assets/svg/paymant.svg";
import { getAllQuizDetails } from "../../services/quiz";
import type { QuizMeta } from "../../utils/types/quiz";

declare global {
  interface Window {
    EasebuzzCheckout: new (
      access_key: string,
      env: "test" | "prod"
    ) => EasebuzzInstance;
  }
}

interface EasebuzzInstance {
  initiatePayment(options: EasebuzzPaymentOptions): void;
}

interface EasebuzzPaymentOptions {
  access_key: string;
  onResponse?: (response: any) => void;
  theme?: string;
}

const PaymentPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const level = searchParams.get("level");
  const [amount, setAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const { user } = useAuth();
  const { callApi: callPaymentOrder } = useApi(orderPaymentService);
  const { callApi: callPaymentVerify } = useApi(verifyPaymentService);
  const navigate = useNavigate();
  const { callApi: callGetAllQuizDetails } = useApi(getAllQuizDetails);

  useEffect(() => {
    const getQuizMetaData = async () => {
      if (!level) return;

      const quizDataResponse = await callGetAllQuizDetails();
      if (quizDataResponse?.data) {
        const allQuizzes = quizDataResponse.data;

        const targetQuiz = allQuizzes.find(
          (quiz: QuizMeta) => quiz.category === level
        );

        if (targetQuiz) {
          const priceInPaise = (targetQuiz.price ?? 0) * 100;
          setAmount(priceInPaise);
        }
      }
    };

    getQuizMetaData();
  }, [level]);

  const loadEasebuzzScript = async (): Promise<boolean> => {
    if (window.EasebuzzCheckout) return true;
    const script = document.createElement("script");
    script.src = checkOutURL;
    script.async = true;
    document.body.appendChild(script);

    return new Promise((resolve) => {
      let tries = 0;
      const interval = setInterval(() => {
        if (window.EasebuzzCheckout) {
          clearInterval(interval);
          resolve(true);
        } else if (tries++ > 10) {
          clearInterval(interval);
          resolve(false);
        }
      }, 300);
    });
  };

  const handlePayment = async (): Promise<void> => {
    setIsProcessing(true);
    try {
      const sdkLoaded = await loadEasebuzzScript();
      if (!sdkLoaded) {
        toast.error("Easebuzz SDK not loaded properly");
        return;
      }
      const data = await callPaymentOrder({
        amount: (amount / 100).toFixed(2),
        firstname: user?.name,
        email: user?.email,
        phone: user?.phone,
      });
      if (!data?.status) {
        toast.error("Failed to create payment order");
        return;
      }

      const paymentData = data.order;
      const easebuzzCheckout = new window.EasebuzzCheckout(
        paymentData.access_key,
        "prod"
      );
      easebuzzCheckout.initiatePayment({
        access_key: paymentData.access_key,
        theme: "#2563eb",
        onResponse: async (response: any) => {
          if (response?.status) {
            try {
              const verifyData = await callPaymentVerify({
                ...response,
                level: user?.current_quiz_level,
              });
              if (verifyData.status) {
                toast.success("Payment Successful!");
                navigate("/home");
              } else {
                toast.error("Payment Verification Failed!");
              }
            } catch (e) {
            } finally {
              setIsProcessing(false);
            }
          } else {
            toast.error(response?.error_Message || "Cancel the payment");
          }
        },
      });
      toast.info("Redirecting to payment page...");
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Payment initiation failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md  w-[362px] border-slate-200 overflow-hidden">
        <div className="pt-8 pb-8 px-6 space-y-8">
          <div className="flex justify-center">
            <img src={paymentSvg} alt="payment svg" />
          </div>
          <div className="space-y-2 text-center">
            <p className=" font-h1-bold ">Unlock Your Quiz Adventure</p>
            <div className="relative"></div>
            <p className="text-sm text-slate-500 px-2">
              You’re just one step away from joining the fun! Complete your
              payment and get ready to challenge your mind, earn rewards, and
              climb the leaderboard.
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className="btn w-full flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Processing Payment...
                </>
              ) : (
                `Pay ₹${(amount / 100).toFixed(2)}`
              )}
            </button>
            <div className="flex items-center justify-center space-x-2 text-slate-500">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-xs">Secure encrypted connection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
