import { usePWAInstall } from "react-use-pwa-install";

const InstallButton = () => {
  const install = usePWAInstall();

  if (!install) return null;

  return (
    <>
      <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-orange-400 to-amber-500 p-4 rounded-xl shadow-md">
        <p className="text-white text-xs sm:text-base font-medium w-2/3">
          Get the <span className="font-bold">GuntiUniverse</span> app on your
          smartphone, tablet, or computer.
        </p>
        <button
          onClick={install}
          className="bg-white text-orange-500 px-4 py-2 rounded-lg font-semibold text-xs shadow hover:bg-gray-100 transition w-1/3"
        >
          Install App
        </button>
      </div>
    </>
  );
};
export default InstallButton;
