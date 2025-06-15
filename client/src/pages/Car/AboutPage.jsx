import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import { motion, useInView } from "framer-motion";
import { FaCheck, FaPlay, FaUsers, FaMapMarkerAlt, FaChartLine, FaHandshake, FaTrophy } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div>
      <Header>
        <div className="px-3 sm:px-20">
          <h1 className="text-5xl sm:text-8xl font-bold leading-tight text-white">About Us</h1>
        </div>
      </Header>
      <main>
        <AboutUs />
        <AboutSection />
        <MissionVision />
        <WhyChooseUs />
      </main>
    </div>
  );
};

export default AboutPage;

const AboutUs = () => {
  const ref = useRef();
  const [view, setView] = useState(false);
  const isInView = useInView(ref);
  useEffect(() => {
    if (isInView) setView(true);
  }, [isInView]);

  return (
    <section className="relative overflow-hidden">
      <motion.div
        className="absolute md:left-[250px] lg:left-[400px] xl:left-[500px] w-full h-full inset-0 bg-[#01D28E] z-[1]"
        initial={{ x: 400, opacity: 0 }}
        animate={view ? { x: 0, opacity: 1 } : {}}
        transition={view ? { delay: 0.3, duration: 0.6 } : {}}
      />
      <div className="relative z-10 p-5 sm:p-16">
        <div className="container mx-auto flex flex-col sm:justify-center md:flex-row gap-10">
          <motion.div
            className="w-full sm:w-[400px] md:w-[500px] lg:w-1/3 relative aspect-square bg-center bg-cover"
            style={{ backgroundImage: "url(jaipur-car-rental.jpg)" }}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={view ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
          />
          <div className="md:w-1/2" ref={ref}>
            <motion.div
              className="text-white md:ml-10"
              initial={{ x: 0, opacity: 0 }}
              animate={view ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <h3 className="text-sm uppercase tracking-wide font-semibold">About Us</h3>
              <h2 className="text-3xl font-bold mt-2">Jaipur's Premier Car Rental Service</h2>
              <p className="mt-4 text-lg">
                Whether you're exploring **Hawa Mahal**, heading to **Jaipur International Airport**, or planning a **wedding in Amer Fort**, 
                we offer premium car rentals tailored for Jaipur’s vibrant streets.
              </p>
              <button className="mt-6 px-6 py-3 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                Book Your Ride
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
      <motion.div
        className="md:w-1/2"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-gray-900">
          We Are More Than <br />
          <span className="text-yellow-500">A Car Rental Company</span>
        </h2>
        <p className="text-gray-600 mt-4">
          From daily city rides to luxury chauffeur services, we provide top-notch **self-drive & chauffeur-driven** 
          rentals to ensure a hassle-free experience across **Jaipur**.
        </p>
        <button className="mt-6 bg-yellow-500 text-white py-3 px-6 rounded-full shadow-lg hover:bg-yellow-600 transition">
          Learn More
        </button>
      </motion.div>

      <motion.div className="md:w-1/2 relative">
        <img src="/jaipur-rental.jpg" alt="Car Rental in Jaipur" className="rounded-xl shadow-lg" />
      </motion.div>
    </div>
  );
};

const MissionVision = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-bold text-gray-900 text-center">Our Mission & Vision</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <motion.div className="bg-gray-100 p-6 rounded-lg shadow-md"
        
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
        viewport={{ once: true }}
        >
          <h3 className="text-xl font-semibold">Our Mission</h3>
          <p className="text-gray-600 mt-3">
            To provide seamless, affordable, and **luxurious car rental experiences** across Jaipur 
            with a fleet of **modern vehicles** and **trusted chauffeurs**.
          </p>
        </motion.div>
        <motion.div className="bg-gray-100 p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
        
        
        >
          <h3 className="text-xl font-semibold">Our Vision</h3>
          <p className="text-gray-600 mt-3">
            To be **Jaipur’s No.1 Car Rental Brand**, offering **affordable & premium** mobility solutions 
            for tourists, locals, and corporate travelers.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const WhyChooseUs = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 text-center">
      <h2 className="text-3xl font-bold text-gray-900">Why Choose Us?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {[
          { icon: <FaUsers />, text: "10,000+ Happy Customers in Jaipur" },
          { icon: <FaMapMarkerAlt />, text: "Pickup & Drop from 30+ Locations" },
          { icon: <FaChartLine />, text: "Competitive & Transparent Pricing" },
          { icon: <FaHandshake />, text: "Flexible Rental Plans for Jaipurites" },
          { icon: <FaTrophy />, text: "Jaipur’s Most Trusted Car Rental Service" },
        ].map((item, index) => (
          <motion.div key={index} className="bg-gray-100 p-6 rounded-lg shadow-md flex items-center gap-3"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          >
            <span className="text-yellow-500 text-3xl">{item.icon}</span>
            <p className="text-gray-700">{item.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
