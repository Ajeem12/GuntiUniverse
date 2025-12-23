
import React from "react";
import Marquee from "react-fast-marquee";
import { useOfferProducts } from "../hooks/useOfferProducts";
import { Link } from "react-router-dom";

// Utility function to slugify offer name
const slugify = (text) => text.toLowerCase().replace(/\s+/g, "-");

const PromoHeader = () => {
  const { data: offers, isLoading, error } = useOfferProducts();

  if (isLoading || !offers?.length || error) return null;

  return (
    <div className="bg-black py-2 shadow-lg sticky top-0 z-50">
      <Marquee
        autoFill={true}
        speed={50}
        gradient={false}
        pauseOnHover={true}
        className="overflow-hidden"
      >
        {offers.map((offer, index) => {
          const product = offer.products?.[0];
          const productName = product?.product_name || "Our Best Product";

          return (
            <Link
              key={index}
              to={`/offers/${slugify(offer.offer_name)}`}
              className="mx-8 text-[#FDBD3C] text-sm font-semibold tracking-wide hover:underline whitespace-nowrap"
            >
              🎁 {offer.offer_name} 
            </Link>
          );
        })}
      </Marquee>
    </div>
  );
};

export default PromoHeader;
