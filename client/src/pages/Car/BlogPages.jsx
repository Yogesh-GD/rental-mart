import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { Link } from "react-router";

const BlogPages = () => {
  const [blogs, setBlogs] = useState([
    {
      id: 1,
      title: "Best Cars for Exploring Jaipur's Pink City",
      excerpt: "Planning to explore Jaipur? Here are the best rental cars for smooth city and highway travel.",
      image: "https://source.unsplash.com/600x400/?jaipur,car",
      date: "Feb 20, 2025",
    },
    {
      id: 2,
      title: "Top Road Trips from Jaipur: Must-Visit Destinations",
      excerpt: "From the scenic Aravalli Hills to Udaipur, discover the best road trips from Jaipur.",
      image: "https://source.unsplash.com/600x400/?rajasthan,roadtrip",
      date: "Feb 18, 2025",
    },
    {
      id: 3,
      title: "How to Rent a Luxury Car for a Royal Jaipur Wedding",
      excerpt: "Luxury cars are a must for Jaipur’s grand weddings. Here’s how to book the best one.",
      image: "https://source.unsplash.com/600x400/?wedding,car",
      date: "Feb 15, 2025",
    },
    {
      id: 4,
      title: "Self-Drive vs. Chauffeur-Driven Cars: What’s Best for Jaipur?",
      excerpt: "Not sure whether to rent a self-drive or chauffeur-driven car in Jaipur? Let’s compare.",
      image: "https://source.unsplash.com/600x400/?driver,car",
      date: "Feb 10, 2025",
    },
    {
      id: 5,
      title: "Budget vs. Luxury: Choosing the Right Rental Car in Jaipur",
      excerpt: "Should you go for a budget-friendly hatchback or a luxury sedan? Here’s how to decide.",
      image: "https://source.unsplash.com/600x400/?luxury,car",
      date: "Feb 5, 2025",
    },
  ]);

  return (
    <div className="bg-white text-black min-h-screen">
      <Header>
        <div className="px-3 sm:px-20 text-center">
          <h1 className="text-5xl sm:text-7xl font-bold leading-tight text-white">Jaipur Travel Blogs</h1>
        </div>
      </Header>

      <div className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold mb-6 text-center">Latest Jaipur Travel & Rental Tips</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-gray-100 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:-translate-y-2">
              <img src={blog.image} alt={blog.title} className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                <p className="text-gray-600 text-sm">{blog.date}</p>
                <p className="text-gray-700 mt-3">{blog.excerpt}</p>
                <Link to={`/blog/${blog.id}`} className="text-red-500 mt-4 inline-block hover:underline">
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-red-500 text-white text-center py-10 mt-12">
        <h3 className="text-2xl font-bold">Subscribe to Our Newsletter</h3>
        <p className="mt-2 text-gray-200">Get exclusive Jaipur travel & car rental tips in your inbox.</p>
        <div className="mt-4 flex justify-center">
          <input type="email" placeholder="Enter your email" className="p-3 w-80 text-black rounded-l-lg" />
          <button className="bg-black px-5 py-3 rounded-r-lg">Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default BlogPages;
