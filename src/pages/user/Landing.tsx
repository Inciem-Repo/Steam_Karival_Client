import HeroSection from "../../components/common/HeroSection";
import StepsSection from "../../components/common/StepsSection";
import AboutSection from "../../components/common/AboutSection";
import OpportunitiesSection from "../../components/common/OpportunitiesSection";
import Footer from "../../components/common/Footer";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();
  return (
    <>
      <HeroSection />
      <StepsSection />
      <AboutSection />
      <OpportunitiesSection />
      <Footer />
      <div className="fixed bottom-0 left-0 w-full bg-[#b11e3a] text-white text-center py-3 font-semibold tracking-wide uppercase md:hidden z-50">
        <button className="w-full" onClick={() => navigate("/register")}>
          Register Now
        </button>
      </div>
    </>
  );
}

export default Landing;
