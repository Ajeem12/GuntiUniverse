
import { useOfferProducts } from "../hooks/useOfferProducts";
import { Link } from "react-router-dom";

const Offers = () => {
  const { data } = useOfferProducts();

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No current offers available</p>
      </div>
    );
  }

  const slugify = (text) => text.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 mb-20">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Special Offers</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((offer) => {
          const offerImage = offer.link
            ? `${import.meta.env.VITE_MEDIA_URL}/offers/${offer.link}`
            : "/img/Noimages.png";

          return (
            <Link
              key={offer.offer_name}
              to={`/offers/${slugify(offer.offer_name)}`}
              className="group relative overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Offer Image */}
              <div className="h-48 w-full overflow-hidden">
                <img
                  src={offerImage}
                  alt={offer.offer_name}
                  className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Offer Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h2 className="text-xl font-bold mb-1 drop-shadow-md">
                  {offer.offer_name}
                </h2>
                <p className="text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                  Explore offer →
                </p>
              </div>

              {/* Ribbon for special offers (optional) */}
              {offer.is_special && (
                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-md">
                  SPECIAL
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Offers;