import React from 'react';

const ShippingPolicy = () => {
  return (
    <div className="shipping-policy max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Processing Time</h2>
        <p className="mb-2">
          All orders are processed within 1-2 business days. During peak periods such as Festival season, processing may take longer, but we will make every effort to ship your order as quickly as possible.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Delivery Time</h2>
        <p className="mb-2">
          Delivery times may vary depending on your location. Typically, orders are delivered within 3-7 business days. Please note that delays may occur due to:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>High demand during the festive season</li>
          <li>Unforeseen circumstances like weather conditions</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Order Tracking</h2>
        <p>
          Once your order is shipped, you will receive a tracking number via email, allowing you to track your shipment in real time.
        </p>
      </section>
    </div>
  );
};

export default ShippingPolicy;