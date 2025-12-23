import React from 'react';

const RefundPolicy = () => {
  return (
    <div className="refund-policy max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Refund & Return Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Order Cancellation</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Orders can be cancelled only before the item is shipped</li>
          <li>Orders already shipped cannot be cancelled</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Refund Policy</h2>
        <h3 className="text-xl font-medium mb-2">No-Refund Policy</h3>
        <p className="mb-4">
          We maintain a strict no-refund policy for all products. However, we may make exceptions in the following cases:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Product Not Received</li>
          <li>If the product is lost in transit</li>
          <li>If the wrong product is delivered</li>
          <li>If the product is damaged during shipping</li>
        </ul>
        
        <h3 className="text-xl font-medium mb-2">Refund Process (When Applicable)</h3>
        <p>
          If any refund is approved, the amount will be credited back to the original payment method within 7-14 business days.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
        <p className="mb-4">
          We are committed to ensuring customer satisfaction and stand by the quality of our products. Below is our return policy to guide you through the return and replacement process:
        </p>
        
        <h3 className="text-xl font-medium mb-2">Eligibility for Return</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>Returns are accepted only for defective, damaged, or incorrect products received.</li>
          <li>The return request must be initiated within 24 hours of receiving the product.</li>
        </ul>
        
        <h3 className="text-xl font-medium mb-2">Return Process</h3>
        <ul className="list-disc pl-6 space-y-2 mb-4">
          <li>If your return request is approved, the replacement process will be initiated within 2-3 business days.</li>
          <li>Once the replacement is dispatched, it is expected to be delivered within 4-7 business days.</li>
        </ul>
        
        <h3 className="text-xl font-medium mb-2">Important Notes</h3>
        <ul className="list-disc pl-6 space-y-2">
          <li>Delivery timelines may be affected by delays from the transport company, adverse weather conditions, or other unforeseen circumstances.</li>
          <li>We are not responsible for delays caused by external factors beyond our control.</li>
        </ul>
        <p className="mt-4">
          We aim to make the return and replacement process as seamless as possible.
        </p>
      </section>
    </div>
  );
};

export default RefundPolicy;