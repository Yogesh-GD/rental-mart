import { FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";
import { Link, NavLink } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
        <div>
          <h2 className="text-2xl font-bold">
            Rental<span className="text-green-500">Mart</span>
          </h2>
          <p className="text-sm mt-4">
            Far far away, behind the word mountains, far from the countries
            Vokalia and Consonantia, there live the blind texts.
          </p>
          <div className="flex justify-center md:justify-start gap-4 mt-4">
            <Link href="#" className="text-xl bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition">
              <FaTwitter />
            </Link>
            <Link href="#" className="text-xl bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition">
              <FaFacebookF />
            </Link>
            <Link href="#" className="text-xl bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition">
              <FaInstagram />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Information</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to={"/about"} className="hover:text-green-500">About</Link></li>
            <li><Link to={"/services"} className="hover:text-green-500">Services</Link></li>
            <li><Link href="#" className="hover:text-green-500">Terms & Conditions</Link></li>
            <li><Link to={"prives"} className="hover:text-green-500">Best Price Guarantee</Link></li>
            <li><Link href="#" className="hover:text-green-500">Privacy & Cookies Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Customer Support</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link href="#" className="hover:text-green-500">FAQ</Link></li>
            <li><Link href="#" className="hover:text-green-500">Payment Options</Link></li>
            <li><Link href="#" className="hover:text-green-500">Booking Tips</Link></li>
            <li><Link href="#" className="hover:text-green-500">How it Works</Link></li>
            <li><Link to={"/contact"} className="hover:text-green-500">Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold">Have a Question?</h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>📍 203 Fake St. Mountain View, San Francisco, California, USA</li>
            <li>📞 +2 392 3929 210</li>
            <li>📧 rentalMart@gmail.com</li>
          </ul>
        </div>
      </div>

      <div className="text-center text-sm mt-10">
        <p>
          &copy; 2025 All rights reserved | Rental Mart 
        </p>
      </div>
    </footer>
  );
};

export default Footer;
