import home from "../../assets/svg/cup.svg";
import grand from "../../assets/svg/grand.svg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#191c6b]">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mx-auto">
          <h1 className="text-xl md:text-4xl text-white font-thin md:mb-16 mb-6 tracking-wide uppercase">
            World's Largest AI & Robotics Challenge!
          </h1>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12">
            <div className="flex-shrink-0">
              <img
                src={home}
                loading="lazy"
                alt="home cup logo"
                className="md:w-[35rem] w-[15rem] h-auto"
              />
            </div>
            <div className="space-y-6">
              <div className="text-white space-y-2">
                <p className="text-5xl md:text-7xl font-black text-accent">
                  ₹5 CRORE
                </p>
                <p className="text-5xl font-medium tracking-wide uppercase">
                  IN REWARDS
                </p>
                <p className="text-lg text-end  text-primary-foreground/80">
                  IN ALL CATEGORIES
                </p>
              </div>
              <div>
                <img src={grand} loading="lazy" alt="grand logo" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
