import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  RefreshCw, 
  PauseCircle, 
  AlertCircle, 
  Headphones,
  Zap,
  ArrowRight,
  Calendar 
} from "lucide-react";
import useGetProfile from "../../hooks/useGetProfile";

const categories = [
  {
    icon: <CreditCard size={28} className="text-blue-600" />,
    label: "Pay My Bill",
    description: "Quick bill payment",
    color: "bg-gradient-to-br from-blue-50 to-blue-100",
    borderColor: "border-blue-200",
    hoverColor: "hover:bg-gradient-to-br hover:from-blue-100 hover:to-blue-200",
    link: "/news/bill",
  },
  {
    icon: <RefreshCw size={28} className="text-emerald-600" />,
    label: "Change Paper",
    description: "Modify subscription",
    color: "bg-gradient-to-br from-emerald-50 to-emerald-100",
    borderColor: "border-emerald-200",
    hoverColor: "hover:bg-gradient-to-br hover:from-emerald-100 hover:to-emerald-200",
    link: "/news/change-paper",
  },
  {
    icon: <PauseCircle size={28} className="text-amber-600" />,
    label: "Stop / Pause Paper",
    description: "Temporarily stop",
    color: "bg-gradient-to-br from-amber-50 to-amber-100",
    borderColor: "border-amber-200",
    hoverColor: "hover:bg-gradient-to-br hover:from-amber-100 hover:to-amber-200",
    link: "/news/pause-paper",
  },
  {
    icon: <AlertCircle size={28} className="text-rose-600" />,
    label: "Report Issue",
    description: "Report problems",
    color: "bg-gradient-to-br from-rose-50 to-rose-100",
    borderColor: "border-rose-200",
    hoverColor: "hover:bg-gradient-to-br hover:from-rose-100 hover:to-rose-200",
    link: "/news/report",
  },
  {
    icon: <Headphones size={28} className="text-violet-600" />,
    label: "Support",
    description: "Get help",
    color: "bg-gradient-to-br from-violet-50 to-violet-100",
    borderColor: "border-violet-200",
    hoverColor: "hover:bg-gradient-to-br hover:from-violet-100 hover:to-violet-200",
    link: "/news/customer",
  },

{
    icon: <Calendar size={28} className="text-indigo-600" />,  // Added Calendar icon
    label: "Calendar",  // Label for the Calendar
    description: "View your schedules and events",  // Description for the Calendar
    color: "bg-gradient-to-br from-indigo-50 to-indigo-100",  // Gradient color for the Calendar
    borderColor: "border-indigo-200",  // Border color for the Calendar
    hoverColor: "hover:bg-gradient-to-br hover:from-indigo-100 hover:to-indigo-200",  // Hover effect for the Calendar
    link: "/news/calender",  // Link to the Calendar page
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.95
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      type: "spring", 
      stiffness: 100,
      damping: 15
    },
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  },
  tap: {
    scale: 0.98,
  }
};

const iconVariants = {
  hover: {
    rotate: [0, -10, 10, 0],
    transition: { duration: 0.5 }
  }
};
const Category = () => {
  const { profile, loading, error } = useGetProfile();

  // Show only "Pay My Bill" if not a newspaper user
  const visibleCategories =
    profile?.news_paper_user >= 1
      ? categories // Show all
      : categories.filter((item) => item.label === "Pay My Bill"); // Show only 1

  return (
    <div className="p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center justify-center mb-2  rounded-full px-4 py-1">
            <Zap size={16} className="text-blue-600 mr-2" />
            <span className="text-sm font-medium text-blue-700">Quick Access</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Our Services</h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Tap to access these services quickly and efficiently
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {visibleCategories.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover="hover"
              whileTap="tap"
              className="group"
            >
              <Link
                to={item.link}
                className={`block ${item.color} border ${item.borderColor} rounded-2xl p-5 h-full transition-all duration-300 group-hover:shadow-lg overflow-hidden relative`}
              >
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>

                <motion.div
                  className="flex justify-center mb-4"
                  variants={iconVariants}
                >
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 shadow-sm group-hover:shadow-md transition-shadow duration-300 border border-gray-100">
                    {item.icon}
                  </div>
                </motion.div>

                <div className="text-center">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1 group-hover:text-gray-900 transition-colors">
                    {item.label}
                  </h3>

                  <div className="flex justify-center">
                    <motion.div
                      initial={{ opacity: 0, x: -5 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-gray-400"
                    >
                      <ArrowRight size={14} />
                    </motion.div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};


export default Category;