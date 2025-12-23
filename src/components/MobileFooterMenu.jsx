
import {
  HiHome,
  HiViewGrid,
  HiInformationCircle,
  HiPhone,
} from 'react-icons/hi';
import { AiOutlineGift, } from 'react-icons/ai';
import { useNavigate, useLocation } from 'react-router-dom';

const MobileFooterMenu = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const menuItems = [
    { label: 'Home', icon: HiHome, path: '/home' },
    { label: 'Categories', icon: HiViewGrid, path: '/category' },
    { label: 'GuntiCoins', icon: AiOutlineGift, path: '/rewards' },
    { label: 'Contact', icon: HiPhone, path: '/contact' },
  ];

  return (
    <nav className="fixed bottom-0  left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="flex justify-around items-center py-3">
        {menuItems.map(({ label, icon: Icon, path }) => {
          const isActive = pathname === path;
          return (
            <button
              key={label}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-1 text-sm transition-all duration-200 ${isActive ? 'text-[#FDBD3C]' : 'text-gray-500 hover:text-[#FDBD3C]'
                }`}
            >
              <Icon className="text-xl" />
              <span className="text-[11px]">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileFooterMenu;
