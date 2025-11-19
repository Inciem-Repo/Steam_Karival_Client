import { Suspense, lazy } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../../components/common/HeroSection";
import StepsSection from "../../components/common/StepsSection";
import LazySection from "../../components/ui/LazySection";

const SkeletonLoader = lazy(() => import("../../components/ui/SkeletonLoader"));
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
      <Suspense
        fallback={
          <div className="text-center text-white py-8">
            <SkeletonLoader variant="text" lines={4} />
          </div>
        }
      >
        <LazySection loader={<SkeletonLoader variant="text" lines={4} />}>
          <AboutSection />
        </LazySection>

        <LazySection loader={<SkeletonLoader variant="text" lines={4} />}>
          <OpportunitiesSection />
        </LazySection>

        <LazySection loader={<SkeletonLoader variant="text" lines={4} />}>
          <Footer />
        </LazySection>
      </Suspense>

      <div className="fixed bottom-0 left-0 w-full bg-[#b11e3a] text-white text-center py-3 font-semibold tracking-wide uppercase md:hidden z-50">
        <button className="w-full" onClick={() => navigate("/register")}>
          Register Now
        </button>
      </div>
    </>
  );
}

export default Landing;
