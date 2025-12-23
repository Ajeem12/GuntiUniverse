import React, { useEffect, useState } from "react";
import hashmobile from "../util/hashmobile";
import toast from "react-hot-toast";

const ShareButton = ({ mobile }) => {
  if (!mobile) {
    return <p className="text-red-600">Mobile number missing!</p>;
  }

  const useDetectPlatform = () => {
    const [platform, setPlatform] = useState("browser");

    useEffect(() => {
      const ua = navigator.userAgent || navigator.vendor || window.opera;

      if (
        /wv/.test(ua) ||
        (/Android.*Version\/[\d.]+/.test(ua) && !/Chrome/.test(ua))
      ) {
        setPlatform("apk");
      } else {
        setPlatform("browser");
      }
    }, []);

    return platform;
  };

  const platform = useDetectPlatform();

  // Encode mobile using hashids
  const encodedMobile = hashmobile.encode(parseInt(mobile));
  const shareUrl = `${window.location.origin}/?ref=${encodedMobile}`;

  // Normal share or clipboard fallback
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "GuntiUniverse",
          text: "Check out GuntiUniverse!",
          url: shareUrl,
        });
        console.log("Shared successfully!");
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied: " + shareUrl);
    }
  };

  // Copy Link Function
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Copied: " + shareUrl);
  };

  // WhatsApp share
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    "Check out GuntiUniverse! " + shareUrl
  )}`;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-gradient-to-br from-[#EAA11E] to-[#F5C271] p-4 rounded-xl shadow-md mt-3 max-w-md mx-auto">
      <p className="text-white text-xs sm:text-base font-medium w-full sm:w-2/3">
        Share the <span className="font-bold">GuntiUniverse</span> app with your
        friends!
      </p>

      <div className="flex gap-3 w-full sm:w-1/3">
        {/* Native Share Button */}
        {platform === "browser" && (
          <button
            onClick={handleNativeShare}
            className="flex-grow bg-white text-amber-600 px-4 py-2 rounded-lg font-semibold text-xs shadow hover:bg-gray-100 transition"
          >
            Share
          </button>
        )}

        {/* NEW Copy Link Button */}
        {platform !== "browser" && (
          <button
            onClick={handleCopyLink}
            className="flex-grow bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold text-xs shadow hover:bg-gray-300 transition"
          >
            Copy
          </button>
        )}

        {/* WhatsApp Share Button – only in APK */}
        {platform !== "browser" && (
          <a
            href={`https://guntiuniverse.com/open_browser?url=${whatsappShareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-grow bg-green-500 text-white px-4 py-2 rounded-lg font-semibold text-xs shadow hover:bg-green-600 transition text-center"
          >
            WhatsApp
          </a>
        )}
      </div>
    </div>
  );
};

export default ShareButton;
