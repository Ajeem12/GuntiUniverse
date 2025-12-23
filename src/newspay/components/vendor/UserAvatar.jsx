const UserAvatar = () => {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 overflow-hidden rounded-full bg-gray-900 border-2 border-white shadow-sm">
          <img 
            src="/logo/logo_bg_remover.png" 
            alt="User" 
            className="object-contain w-full h-full "
          />
        </div>
       
      </div>
    );
  };
  
  export default UserAvatar;