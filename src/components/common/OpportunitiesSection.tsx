import { useNavigate } from "react-router-dom";

const OpportunitiesSection = () => {
  const navigate = useNavigate();
  return (
    <section className="bg-[#191c6b] py-12 flex justify-center items-center">
      <div className="text-center text-white">
        <h2 className="font-semibold text-sm md:text-xl tracking-wide uppercase">
          INTERNSHIP & MENTORSHIP OPPORTUNITIES WITH
        </h2>
        <p className="font-semibold text-sm md:text-xl tracking-wide uppercase mt-1">
          GLOBAL UNIVERSITIES & FORTUNE 500 COMPANIES.
        </p>
        <div className="pt-6">
          <button
            onClick={() => navigate("/register")}
            className="rounded-full px-8 py-4 bg-[#b11e3a] text-white text-xs md:text-sm font-semibold tracking-wide uppercase hover:bg-[#8e162e] transition-colors duration-200"
          >
            REGISTER NOW
          </button>
        </div>
      </div>
    </section>
  );
};

export default OpportunitiesSection;
