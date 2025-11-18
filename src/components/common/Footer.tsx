import steamLogo from "../../assets/svg/logosteam.svg";

const Footer = () => {
  return (
    <footer className="bg-[#d9def0] w-full py-16 flex justify-center items-center">
      <div className="container mx-auto px-6 md:px-16">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between gap-12">
          <div className="w-full md:w-[30%] flex justify-center md:justify-start">
            <img
              src={steamLogo}
              alt="STEAM Karnival Logo"
              className="w-56 md:w-64"
            />
          </div>
          <div className="w-full md:w-[70%] md:border-l-2 border-gray-500 pl-8 text-[#1e1e1e]">
            <p className="text-[15px] leading-relaxed font-medium tracking-wide text-justify md:text-left">
              THE STEAM CUP IS PROUDLY ORGANIZED IN COLLABORATION WITH NAMO AI –
              THE NATIONAL MODULAR ROBOTICS & AI MISSION, A PIONEERING
              INITIATIVE THAT AIMS TO DEMOCRATIZE ACCESS TO ROBOTICS AND
              ARTIFICIAL INTELLIGENCE EDUCATION FOR EVERY STUDENT. TOGETHER, WE
              ENVISION BUILDING A FUTURE WHERE EVERY CHILD LEARNS TO THINK,
              DESIGN, AND INNOVATE USING TECHNOLOGY RESPONSIBLY.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
