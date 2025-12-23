import React, { lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import CategorySlider from "../components/Category";
import OfferItem from "../components/OfferItem";
import OfferSlider from "../components/OfferSlider";
const NewArrivals = lazy(() => import("../components/newArrivals/NewArrivals"));
const Slider = lazy(() => import("../components/Slider"));
const Offers = lazy(() => import("../components/Offers"));
const Products = lazy(() => import("../components/Products"));
const Loader = lazy(() => import("../components/Loader"));
const Sponsored_banner = lazy(() =>
  import("../components/landing/Sponsored_banner")
);

const Home = () => {
  return (
    <>
      <Suspense
        fallback={
          <div className="text-center py-4">
            <Loader />
            Loading slider...
          </div>
        }
      >
        <Slider type={1} />
      </Suspense>
      <OfferSlider />
      <Suspense
        fallback={
          <div className="text-center py-4">
            <Loader />
            Loading New Arrivals...
          </div>
        }
      >
        <NewArrivals />
      </Suspense>
      <CategorySlider />
      <Products />

      <div className="w-full mb-20">
        <Sponsored_banner type={2} />
        {/* <Option /> */}
      </div>
    </>
  );
};

export default Home;
