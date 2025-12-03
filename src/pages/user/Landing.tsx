import { lazy } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../../components/common/HeroSection";
import StepsSection from "../../components/common/StepsSection";

const AboutSection = lazy(() => import("../../components/common/AboutSection"));
const OpportunitiesSection = lazy(
  () => import("../../components/common/OpportunitiesSection")
);
const Footer = lazy(() => import("../../components/common/Footer"));

function Landing() {
  const navigate = useNavigate();
  return (
    <>
      <HeroSection />
      <StepsSection />
      <AboutSection />
      <OpportunitiesSection />
      <Footer />

      <div className="fixed bottom-2 left-4 right-4 md:hidden z-50">
        <div className="w-full bg-[#b11e3a] text-white text-center py-3 font-semibold tracking-wide uppercase rounded-full">
          <button className="w-full px-4" onClick={() => navigate("/register")}>
            Register Now
          </button>
        </div>
      </div>
    </>
  );
}

export default Landing;
