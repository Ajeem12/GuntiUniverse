import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Tag, 
  CreditCard, 
  History, 
  Plus,
  X,
  User,
  Settings
} from 'lucide-react';

const MobileFooter = () => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);

  const mainItems = [
    { icon: <Home size={22} />, label: 'Home', href: '/news' },
    { icon: <CreditCard size={22} />, label: 'Pay', href: '/news/bill' },
    { icon: <Tag size={22} />, label: 'Offers', href: '/news/offer' },
    { icon: <History size={22} />, label: 'History', href: '/news/history' },
  ];

  const expandedItems = [
    { icon: <User size={20} />, label: 'Profile', href: '/news/profile' },
    { icon: <Settings size={20} />, label: 'Settings', href: '/news/settings' },
  ];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Check if a nav item is active
  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Expanded overlay when menu is open */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Main navigation */}
      <motion.div 
        className="fixed bottom-0  w-full bg-white  rounded-t-2xl shadow-lg flex justify-around items-center py-3 border border-gray-100 md:hidden z-50"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20 }}
      >
        {mainItems.map((item, index) => {
          const active = isActive(item.href);
          return (
            <Link
              key={index}
              to={item.href}
              className="relative flex flex-col items-center text-xs px-2"
              onClick={() => setIsExpanded(false)}
            >
              <motion.div
                className={`p-2 rounded-full ${active ? 'bg-amber-50' : ''}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  animate={{ color: active ? '#d97706' : '#9ca3af' }}
                  transition={{ duration: 0.2 }}
                >
                  {item.icon}
                </motion.div>
              </motion.div>
              <motion.span 
                className={`mt-1 font-medium ${active ? 'text-amber-600' : 'text-gray-500'}`}
                animate={{ color: active ? '#d97706' : '#6b7280' }}
                transition={{ duration: 0.2 }}
              >
                {item.label}
              </motion.span>
              
              {/* Active indicator dot */}
              {active && (
                <motion.div 
                  className="absolute -top-1 right-2 w-2 h-2 bg-amber-500 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                />
              )}
            </Link>
          );
        })}
        
        {/* Expandable menu button */}
        {/* <motion.button
          onClick={toggleExpanded}
          className="flex flex-col items-center text-xs px-2"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 45 : 0, backgroundColor: isExpanded ? '#fef3c7' : '#f9fafb' }}
            className="p-2 rounded-full"
            transition={{ type: "spring", stiffness: 300 }}
          >
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={22} className="text-amber-600" />
                </motion.div>
              ) : (
                <motion.div
                  key="plus"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Plus size={22} className="text-gray-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <span className={`mt-1 font-medium ${isExpanded ? 'text-amber-600' : 'text-gray-500'}`}>
            More
          </span>
        </motion.button> */}
      </motion.div>

      {/* Expanded menu items */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 w-48 bg-white rounded-2xl shadow-xl p-3 md:hidden z-50"
          >
            <div className="grid gap-2">
              {expandedItems.map((item, index) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={index}
                    to={item.href}
                    className={`flex items-center p-3 rounded-xl text-sm font-medium ${active ? 'bg-amber-50 text-amber-700' : 'hover:bg-gray-50 text-gray-700'}`}
                    onClick={() => setIsExpanded(false)}
                  >
                    <span className={`mr-3 ${active ? 'text-amber-600' : 'text-gray-500'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                    {active && (
                      <motion.div 
                        className="ml-auto w-2 h-2 bg-amber-500 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500 }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileFooter;