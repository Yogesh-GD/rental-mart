import React, { useEffect, useRef, useState } from 'react'
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { FaCheck, FaPlay } from "react-icons/fa";
import { FaCar, FaMapMarkedAlt, FaPlaneDeparture, FaTaxi } from "react-icons/fa";
import { CarCard } from '../../components/CarCard';
import { useDispatch, useSelector } from 'react-redux';
import { getFeaturedVehicles, getVehicles } from '../../slices/vehicles/vehicleSlice';
import CounterAnimation from '../../components/CounterAnimation';


const HomePage = () => {


  return (
    <div >
      <header>
        <HeaderSection />
      </header>
      <main>
        <FeaturedCarList />
        <AboutUs />
        <FeaturesSection />
        <GallerySection />
        <Services />
        <DriverCTA />
        <AboutSection />
        <Testimonials />
        <StatsSection />
        <FAQSection />
      </main>
    </div>
  )
}

export default HomePage

const HeaderSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 z-0 w-full h-full">
        <div
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${
            !videoLoaded ? "opacity-0" : "opacity-100"
          }`}
          style={{ backgroundImage: "url('/car3.jpg')" }}
        />

        {/* <iframe
          className="absolute inset-0 w-full h-full pointer-events-none"
          src="https://www.youtube.com/embed/U5fcrFz6Ma0?autoplay=1&mute=1&controls=0&loop=1&playlist=U5fcrFz6Ma0&modestbranding=1&showinfo=0&rel=0"
          title="YouTube background"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
          onLoad={() => setVideoLoaded(true)}
        ></iframe> */}
      </div>

      <div className="absolute inset-0 bg-black/60 z-10" />

      <div className="relative z-20 w-full h-full flex items-center justify-center px-6">
        <div className="text-white max-w-5xl mx-auto text-left">
          <motion.h1
            className="text-5xl font-bold leading-tight"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Rent a Car in Jaipur & Explore the Pink City!
          </motion.h1>
          <motion.p
            className="text-lg mt-3"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            From heritage sites like Amer Fort to shopping in Johri Bazaar,
            rent a car and travel hassle-free!
          </motion.p>

          <motion.div
            className="mt-6 bg-white/10 backdrop-blur-md p-6 rounded-lg flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <input
              type="text"
              placeholder="Enter Pickup Location (e.g., Jaipur Airport)"
              className="p-3 w-64 bg-transparent border-b border-white outline-none text-white placeholder-white"
            />
            <input
              type="date"
              className="p-3 w-44 bg-transparent border-b border-white outline-none text-white"
            />
            <input
              type="time"
              className="p-3 w-44 bg-transparent border-b border-white outline-none text-white"
            />
            <input
              type="text"
              placeholder="Enter Dropoff Location (e.g., Hawa Mahal)"
              className="p-3 w-64 bg-transparent border-b border-white outline-none text-white placeholder-white"
            />
            <button className="ml-auto bg-transparent border border-white px-6 py-3 rounded-md text-white font-semibold hover:bg-white hover:text-black transition">
              + BOOK NOW
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};



const services = [
  {
    id: 1,
    title: "Jaipur Airport Pickup & Drop",
    description: "Seamless pickup and drop-off at Jaipur International Airport for tourists and business travelers.",
    icon: <FaPlaneDeparture className="text-white text-4xl" />,
  },
  {
    id: 2,
    title: "Heritage Site Tours",
    description: "Visit famous sites like Amer Fort, Hawa Mahal, and City Palace with our rental services.",
    icon: <FaMapMarkedAlt className="text-white text-4xl" />,
  },
  {
    id: 3,
    title: "Wedding Car Rentals",
    description: "Make your Jaipur wedding grand with luxury car rentals, including Rolls Royce & Audi.",
    icon: <FaCar className="text-white text-4xl" />,
  },
  {
    id: 4,
    title: "Outstation Travel from Jaipur",
    description: "Plan weekend trips to Udaipur, Jodhpur, or Ranthambore National Park with our rentals.",
    icon: <FaTaxi className="text-white text-4xl" />,
  },
];


const testimonials = [
  {
    id: 1,
    name: "Amit Sharma",
    role: "Tourist from Delhi",
    text: "Exploring Jaipur was a breeze with this car rental! The ride to Amer Fort and Nahargarh Fort was smooth and comfortable.",
    image: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    id: 2,
    name: "Priya Singh",
    role: "Bride from Mumbai",
    text: "Booked a luxury car for my wedding at Rambagh Palace. The service was excellent, and the car was in pristine condition!",
    image: "https://randomuser.me/api/portraits/women/16.jpg",
  },
  {
    id: 3,
    name: "David Williams",
    role: "International Traveler",
    text: "Hired a driver with my rental for my Jaipur tour. The chauffeur was knowledgeable and took me to hidden gems like Panna Meena Ka Kund.",
    image: "https://randomuser.me/api/portraits/men/22.jpg",
  },
];


const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="text-center">
        <h3 className="text-blue-600 font-semibold uppercase tracking-wide">Testimonial</h3>
        <h2 className="text-3xl font-bold text-gray-800">What Our Clients Say</h2>
      </div>

      <div className="container mx-auto mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
        {testimonials.map((testimonial) => (
          <motion.div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl text-center"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}

          >
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-20 h-20 mx-auto rounded-full border-4 border-gray-300"
            />
            <p className="text-gray-600 mt-4">"{testimonial.text}"</p>
            <h4 className="mt-4 font-bold text-gray-800">{testimonial.name}</h4>
            <p className="text-blue-500">{testimonial.role}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};




const Services = () => {
  return (
    <section className="py-16 my-20 mb-40 bg-gray-100">
      <div className="text-center">
        <h3 className="text-blue-600 font-semibold uppercase tracking-wide">Services</h3>
        <h2 className="text-3xl font-bold text-gray-800">Our Car Rental Services</h2>
      </div>

      <div className="container mx-auto mt-10 grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
        {services.map((service) => (
          <motion.div key={service.id} className="rounded-lg  hover:shadow-xl p-6  text-center"
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="bg-blue-600 w-20 h-20 mx-auto flex items-center justify-center rounded-full">
              {service.icon}
            </div>
            <h4 className="mt-4 font-bold text-gray-800">{service.title}</h4>
            <p className="text-gray-600 mt-2">{service.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const AboutUs = () => {
  const ref = useRef()
  const [view, setView] = useState(false)
  const isInView = useInView(ref)
  useEffect(() => {
    if (isInView) setView(true)
  }, [isInView])
  return (
    <section className=" relative overflow-hidden "  >
      <motion.div className="absolute md:left-[250px] lg:left-[400px] xl:left-[500px] w-full h-full inset-0 bg-[#01D28E] z-[1]"
        initial={{ x: 400, opacity: 0 }}
        animate={view ? { x: 0, opacity: 1 } : {}}
        transition={view ? { delay: 0.3, duration: 0.6 } : {}}
        viewport={{ once: true }}
      >

      </motion.div>

      <div className=' relative z-10 p-5 sm:p-16' >
        <div className="container mx-auto flex flex-col sm:justify-center md:flex-row gap-10  ">

          <motion.div className=" w-full sm:w-[400px] md:w-[500px] lg:w-1/3 relative aspect-square  bg-center bg-cover" style={{ backgroundImage: "url(rental-car-dealer.jpg)" }}
            initial={{ scale: 0.2, opacity: 0 }}
            animate={view ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 1, duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
          >

          </motion.div>

          <div className='md:w-1/2' ref={ref}>
            <motion.div className="   text-white  md:ml-10"
              initial={{ x: 0, opacity: 0 }}
              animate={view ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: 0.6, duration: 0.5, }}
              viewport={{ once: true }}
            >
              <h3 className="text-sm uppercase tracking-wide font-semibold">About Us</h3>
              <h2 className="text-3xl font-bold mt-2">Welcome to CarBook</h2>
              <p className="mt-4 text-lg">
                Experience seamless car rentals with our top-tier service and a vast fleet of vehicles.
                Whether you're looking for luxury, economy, or business rentals, we have the perfect
                vehicle for you.
              </p>
              <p className="mt-4 text-lg">
                Our commitment is to provide reliable, affordable, and convenient rentals tailored to your needs.
              </p>
              <button className="mt-6 px-6 py-3 cursor-pointer bg-blue-600 hover:bg-blue-700    text-white font-semibold">
                Search Vehicle
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const StatsSection = () => {
  return (
    <section className="bg-gray-100 py-12">
      <div className="container mx-auto flex flex-col md:flex-row items-center">

        <div className="bg-blue-200 w-full md:w-1/4 flex justify-center items-center py-10">
          <motion.h2 className="text-5xl font-bold text-blue-600">
            <CounterAnimation value={8} />
          </motion.h2>
          <p className="ml-2 text-gray-800 text-lg">Years in Jaipur</p>
        </div>

        <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 text-center py-10 px-8">
          <div>
            <motion.h3 className="text-4xl font-bold text-blue-600">
              <CounterAnimation value={250} />
            </motion.h3>
            <p className="text-gray-800 text-lg">Luxury Cars Available</p>
          </div>
          <div>
            <motion.h3 className="text-4xl font-bold text-blue-600">
              <CounterAnimation value={7500} />
            </motion.h3>
            <p className="text-gray-800 text-lg">Happy Travelers in Jaipur</p>
          </div>
          <div>
            <motion.h3 className="text-4xl font-bold text-blue-600">
              <CounterAnimation value={15} />
            </motion.h3>
            <p className="text-gray-800 text-lg">Premium Locations Covered</p>
          </div>
        </div>
      </div>
    </section>
  );
};


const DriverCTA = () => {
  const ref = useRef()
  const [view, setView] = useState(false)
  const isInView = useInView(ref)
  useEffect(() => {
    if (isInView) setView(true)
  }, [isInView])
  return (
    <motion.section className="relative flex flex-row items-center md:justify-end overflow-hidden bg-center bg-cover text-white px-6 md:px-20 " style={{ backgroundImage: "url(rental-car-dealer.jpg)" }}
      initial={{ height: 0, opacity: 0 }}
      whileInView={{ height: "auto", opacity: 1 }}
      transition={{ delay: 0.3, duration: 0.7 }}
      viewport={{ once: true }}
    >
      <div className="absolute inset-0 bg-black/50" ref={ref}></div>


      <motion.div className="absolute -left-20  0 top-0 bottom-0 w-2/4 bg-[#01D28E] transform -skew-x-12 hidden md:block"
        initial={{ left: "-600px", opacity: 0 }}
        animate={view ? { left: "-80px", opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.5 }}
        viewport={{ once: true }}
      >
      </motion.div>

      <motion.div className=' md:w-1/2 py-16'
        initial={{ x: 400, opacity: 0 }}
        animate={view ? { x: 0, opacity: 1 } : {}}
        transition={{ delay: 0.6, duration: 0.5 }}
        viewport={{ once: true }}
      >
        <div className="relative   flex-1 flex flex-col items-center md:items-end text-center md:text-left z-10">
          <h2 className="text-3xl md:text-4xl font-bold">
            Do You Want To Earn With Us? So Don’t Be Late.
          </h2>
          <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-semibold rounded">
            Become A Driver
          </button>
        </div>
      </motion.div>


    </motion.section>
  );
};


const FeaturedCarList = () => {
  const dispatch = useDispatch()
  const { featured, loading, error } = useSelector((state) => state.vehicle)
  useEffect(() => {
    dispatch(getFeaturedVehicles("isFeatured=true&limit=5"))
  }, [])
  

  if (loading) return <p>Loading page...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8 my-20">
      <h1 className="text-4xl font-bold text-center mb-10">Featured Cars</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
         { featured && featured?.map((vehicle, index) => (
          <CarCard key={index} vehicle={vehicle} />
        ))}
      </div>
    </div>
  );
};


const faqs = [
  {
    question: "Do You Rent to International Visitors?",
    answer: "Yes, we rent to international visitors with a valid passport and driver’s license. Some countries may require an International Driving Permit (IDP)."
  },
  {
    question: "Do You Provide Insurance?",
    answer: "Yes, we offer several insurance options, including liability and full coverage. Check our rental terms for details."
  },
  {
    question: "Can I Choose a Specific Car Model?",
    answer: "While we guarantee the car category, specific models are subject to availability at the time of rental."
  },
  {
    question: "Do Your Drivers Have Professional Certifications?",
    answer: "Yes, all our chauffeurs are professionally trained, licensed, and certified to ensure a safe and premium experience."
  },
  {
    question: "What Is the Minimum Age to Rent a Car?",
    answer: "The minimum rental age is 21. Drivers under 25 may be subject to a young driver surcharge."
  }
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
     <motion.div
       initial={{ opacity: 0, }}
       whileInView={{ opacity: 1,}}
       transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
       viewport={{ once: true }}
     >
     <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
      <p className="text-sm text-gray-500 uppercase tracking-wide mt-2">
        List of Answers
      </p>
     </motion.div>
      <div className="mt-6 border-t border-gray-300">
        {faqs.map((faq, index) => (
          <motion.div key={index} className="border-b border-gray-300"
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
          viewport={{ once: true }}
          >
            <button
              className="w-full flex justify-between items-center py-4 text-left text-lg font-medium"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              {openIndex === index ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
            </button>

            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p className="text-gray-600 pb-4 px-2">{faq.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};






const images = [
  "/car1.jpg",
  "/car2.jpg",
  "/car3.jpg",
  "/car4.jpg",
  "/bike1.jpg",
  "/bike3.jpg",
  "/bike1.jpg",
  "/bike4.jpg",
  "/bike22.jpg"
];

const GallerySection = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {images.map((src, index) => (
          <motion.div
            key={index}
            className="overflow-hidden rounded-xl"
            whileInView={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <img src={src} alt={`Gallery ${index + 1}`} className="w-full h-auto object-cover rounded-xl" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const features = [
  { title: "Deals For Every Budget", description: "Affordable pricing with options for every traveler." },
  { title: "Cleanliness & Comfort", description: "Sanitized cars with top-notch comfort." },
  { title: "Best Prices Guaranteed", description: "We match any lower price you find." },
  { title: "24/7 Order Available", description: "Book anytime, anywhere, hassle-free." },
  { title: "Professional Drivers", description: "Experienced drivers ensure a safe ride." },
  { title: "Fast Car Delivery", description: "Get your car delivered quickly to your location." }
];

const FeatureCard = ({ title, description }) => {


  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5, ease: "easeOut" }}
      viewport={{ once: true }}
      className="bg-white shadow-lg p-6 rounded-2xl border border-gray-200"
    >
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="text-gray-600 mt-2">{description}</p>
      <button className="mt-4 text-sm font-semibold text-gray-800 flex items-center hover:text-orange-500 transition">
        + VIEW MORE
      </button>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 my-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <FeatureCard key={index} title={feature.title} description={feature.description} />
        ))}
      </div>
    </div>
  );
};

const AboutSection = () => {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-12">
      <motion.div
        className="md:w-1/2"
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <p className="text-yellow-500 uppercase tracking-wide">Jaipur Car Rentals</p>
        <h2 className="text-4xl font-bold text-gray-900 mt-2">
          Explore Jaipur with <br />
          <span className="text-yellow-500">Premium Car Rentals</span>
        </h2>
        <p className="text-gray-600 mt-4">
          Discover the rich heritage and vibrant streets of Jaipur with our reliable car rental service. 
          Whether you're visiting **Amer Fort**, shopping in **Johri Bazaar**, or heading to **Jaipur International Airport**, 
          we ensure a smooth and comfortable ride.
        </p>
        <div className="mt-6 space-y-3">
          <div className="flex items-center space-x-3">
            <FaCheck className="text-yellow-500" />
            <p className="text-gray-700">Luxury Cars for Weddings & Events</p>
          </div>
          <div className="flex items-center space-x-3">
            <FaCheck className="text-yellow-500" />
            <p className="text-gray-700">Self-Drive & Chauffeur-Driven Options</p>
          </div>
          <div className="flex items-center space-x-3">
            <FaCheck className="text-yellow-500" />
            <p className="text-gray-700">24/7 Airport & Hotel Transfers</p>
          </div>
        </div>
        <button className="mt-6 bg-yellow-500 text-white py-3 px-6 rounded-full flex items-center space-x-2 shadow-lg hover:bg-yellow-600 transition">
          <span>Book a Ride</span>
          <span className="ml-2">↗</span>
        </button>
      </motion.div>

      <motion.div
        className="md:w-1/2 relative"
        initial={{ opacity: 0, x: 50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <img
        src="/rental-car-dealer.jpg"
        alt="Car Rental"
        className="rounded-xl shadow-lg"
        />
        <button className="absolute bottom-4 left-4 bg-black text-white w-12 h-12 flex items-center justify-center rounded-full shadow-lg">
          <FaPlay />
        </button>
      </motion.div>
    </div>
  );
};
