import { Link, useNavigate } from "react-router-dom";
import landing from "../../assets/images/landing.png";
import { PromoBanner } from "../../components/common/PromoBanner";
function Landing() {
const navigate = useNavigate()
  return (
    <div className="w-full min-h-screen flex items-center justify-center">
      <main className="flex h-auto w-[362px] max-w-full px-4 py-12 relative flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-8 relative self-stretch w-full">
          <img
            className="relative w-full max-w-[280px] h-auto object-contain"
            alt="Welcome illustration"
            src={landing}
          />
          <div className="flex flex-col gap-4 font-h1-bold w-full">
            <h1>
              Welcome to
              <br />
              Stream Karnival
            </h1>
            <p className="relative self-stretch font-body-regular text-xs tracking-[0] leading-[16px]">
              The Grandest Celebration of Art, Culture & Learning
            </p>
          </div>
          <div className="grid grid-cols-1  gap-6 mb-8 animate-fade-in">
            <div className="flex gap-2">
              <PromoBanner
                icon="rocket"
                title="WIN A TRIP TO NASA"
                subtitle="Top performers get to visit NASA!"
                variant="primary"
              />
              <PromoBanner
                icon="trophy"
                title="₹5 CRORE WORTH PRIZES"
                subtitle="For top 100 schools"
                variant="accent"
              />
            </div>
            <div
              className="flex gap-2
            "
            >
              <PromoBanner
                icon="brain"
                title="NATIONAL ROBOTICS & AI MISSION"
                subtitle="Join the future of technology"
                variant="secondary"
              />
              <PromoBanner
                icon="brain"
                title="NaMo AI Mission"
                subtitle="Official national initiative for AI & Robotics."
                variant="secondary"
              />
            </div>
            <button
              type="submit"
              className="w-full btn flex justify-center items-center gap-2"
              onClick={()=>navigate("/register")}
            >
              Register
            </button>

            <div className="text-center font-body-regular">
              <span className="text-sm text-gray-600">
                Already Have an Account?{" "}
                <Link to={"/login"} className="font-semibold hover:underline">
                  Login
                </Link>
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;
