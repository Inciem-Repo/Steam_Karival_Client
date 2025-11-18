import { useNavigate } from "react-router-dom";
import cup from "../../assets/svg/cup_l.svg";

const AboutSection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="w-full flex justify-center items-center gap-3 mb-12">
          <p className="text-[#0a0f6b] text-xl md:text-3xl font-thin  tracking-wide uppercase m-0">
            WIN A TRIP TO NASA & GET ATTRACTIVE PRIZES
          </p>
          <button
            onClick={() => navigate("/register")}
            className="rounded-full px-6 py-4 md:px-8 md:py-4 bg-[#b11e3a] text-white text-xs md:text-sm font-semibold tracking-wide uppercase hover:bg-[#8e162e] transition-colors duration-200"
          >
            REGISTER NOW
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 items-center max-w-6xl mx-auto mt-16">
          <div className="bg-[#dbdff0] flex justify-center flex-col p-10 h-full">
            <img src={cup} alt="prize cup" loading="lazy" />
            <button
              className="rounded-full py-4 bg-[#b11e3a] text-white"
              onClick={() => navigate("/register")}
            >
              REGISTER NOW
            </button>
          </div>
          <div className="space-y-6 bg-[#dbdff0] h-full p-10">
            <h3 className="text-xl md:text-2xl text-center font-medium text-[#231f20] leading-snug mb-6">
              A Global Innovation Challenge <br /> For Young Minds
            </h3>

            <p className="text-foreground/80 leading-relaxed">
              STEAM CUP is the world’s largest AI and Robotics challenge for
              school students, offering ₹5 crore worth of rewards and the
              extraordinary grand prize a fully sponsored trip to NASA. Designed
              to ignite creativity, innovation, and future-ready skills, the
              competition takes students through four exciting levels: School,
              State, National, and Global. Organized in collaboration with NaMo
              AI the National Modular Robotics & AI Mission this initiative aims
              to democratise access to advanced technology education for every
              child. Students compete, learn, build, and innovate through
              real-world AI and robotics challenges, gaining global exposure and
              prestigious certificates. With rewards for the top schools,
              attractive prizes, recognition on an international stage, and an
              unparalleled opportunity to experience NASA, STEAM CUP empowers
              the next generation of thinkers, designers, and innovators.
              Register now and take your first step towards a future shaped by
              creativity, intelligence, and limitless possibilities.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
