import HeroSection from "../../components/common/HeroSection";
import StepsSection from "../../components/common/StepsSection";
import { Suspense, lazy } from "react";

const AboutSection = lazy(() => import("../../components/common/AboutSection"));
const OpportunitiesSection = lazy(
  () => import("../../components/common/OpportunitiesSection")
);
const Footer = lazy(() => import("../../components/common/Footer"));

function Landing() {
  return (
    <>
      <HeroSection />
      <StepsSection />
      <Suspense
        fallback={<div className="text-center text-white py-8">Loading...</div>}
      >
        <AboutSection />
        <OpportunitiesSection />
        <Footer />
      </Suspense>

      <div className="fixed bottom-0 left-0 w-full bg-[#b11e3a] text-white text-center py-3 font-semibold tracking-wide uppercase md:hidden z-50">
        <button className="w-full">Register Now</button>
      </div>
    </>
  );
}

export default Landing;
