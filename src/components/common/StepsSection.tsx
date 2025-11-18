import levelImg from "../../assets/svg/prize.svg";

const StepsSection = () => {
  return (
    <section className="bg-[#2b3a97] ">
      <div className=" md:px-12 px-6 py-16">
        <h2 className="text-xl md:text-2xl text-white  text-center text-primary-foreground mb-12 ">
          YOU ARE JUST 4 STEPS AWAY FROM THE NASA TRIP & STEAM CUP
        </h2>
        <div className="flex justify-center gap-6 max-w-6xl mx-auto">
          <img src={levelImg} alt="levels"  className="w-[50rem]" />
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
