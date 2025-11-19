import { motion } from "framer-motion";
import home from "../../assets/svg/cup.svg";
import grand from "../../assets/svg/grand.svg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#191c6b]">
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-4xl text-white font-thin md:mb-16 mb-6 tracking-wide uppercase"
          >
            World's Largest AI & Robotics Challenge!
          </motion.h1>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="flex-shrink-0"
            >
              <motion.img
                src={home}
                loading="lazy"
                alt="home cup logo"
                className="md:w-[35rem] w-[15rem] h-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              />
            </motion.div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-white space-y-2"
              >
                <p className="text-5xl md:text-7xl font-black text-accent">
                  ₹5 CRORE
                </p>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="md:text-6xl text-5xl font-medium tracking-wide uppercase"
                >
                  IN REWARDS
                </motion.p>
                <motion.p
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.0 }}
                  className="text-lg text-end text-primary-foreground/80"
                >
                  IN ALL CATEGORIES
                </motion.p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                <motion.img
                  src={grand}
                  loading="lazy"
                  alt="grand logo"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                />
              </motion.div>
              <div className="relative">
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
