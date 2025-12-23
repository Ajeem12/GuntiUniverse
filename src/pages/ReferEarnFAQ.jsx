import React, { useState } from "react";
import MobileBottomMenu from "../components/landing/MobileBottomMenu";
import TataNeuNavbar from "../components/TataNeuNavbar";

const faqs = [
  {
    question: "What is the GuntiUniverse Refer & Earn program?",
    answer:
      "It is a reward program where you earn GuntiCoins by referring friends to GuntiUniverse. You earn rewards only when your referred friend places a successful order.",
  },
  {
    question: "How many GuntiCoins can I earn per referral?",
    answer:
      "You can earn up to 100 GuntiCoins for each referred user, based on their order activity.",
  },
  {
    question: "When do I receive GuntiCoins?",
    answer:
      "GuntiCoins are credited after the referred user’s order is successfully delivered. Cancelled or returned orders are not eligible.",
  },
  {
    question: "Who can participate in Refer & Earn?",
    answer:
      "All registered GuntiUniverse users can participate. There is no joining fee or minimum order requirement.",
  },
  {
    question: "How do I refer someone?",
    answer:
      "1. Share your unique referral code or link from the app\n2. Your friend signs up using the link/code\n3. Your friend places an order\n\nRewards are tracked automatically.",
  },
  {
    question: "What will my friend get?",
    answer:
      "Your friend may receive a welcome benefit of 100 RS & discount, as per current offers shown in the app.",
  },
  {
    question: "Where can I see my referrals and earnings?",
    answer:
      "You can track everything in the app under: Profile → Wallet & Payments",
  },
  {
    question: "Can GuntiCoins be withdrawn as cash?",
    answer:
      "No. GuntiCoins cannot be withdrawn as cash and are only usable within the GuntiUniverse platform.",
  },
  {
    question: "Is there any limit on referrals?",
    answer:
      "There is no fixed limit on how many friends you can refer. However, rewards are subject to fair usage policies.",
  },
  {
    question: "What is not allowed in Refer & Earn?",
    answer:
      "Self-referrals, fake or duplicate accounts, misleading or spam promotions. Such activities may lead to cancellation of rewards or account suspension.",
  },
  {
    question: "What happens if my referred user cancels the order?",
    answer:
      "If the order is cancelled, returned, or fails delivery, GuntiCoins will not be credited.",
  },
  {
    question: "Will my GuntiCoins expire?",
    answer:
      "Expiry rules, if any, will be clearly shown in the app under the GuntiCoin wallet section.",
  },
  {
    question: "Can GuntiUniverse change the program rules?",
    answer:
      "Yes. GuntiUniverse reserves the right to modify, pause, or discontinue the Refer & Earn program at any time. Any changes will be communicated through the app.",
  },
  {
    question: "Need more help?",
    answer:
      "You can contact GuntiUniverse Support through the app for any referral-related queries.",
  },
  {
    question: "Referral Motto",
    answer: "Refer honestly. Earn GuntiCoins. Grow with GuntiUniverse.",
  },
];

const ReferEarnFAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
      <TataNeuNavbar />
      <div className="max-w-4xl mx-auto p-4 mb-20">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Refer & Earn - FAQ
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <button
                onClick={() => toggleIndex(idx)}
                className="w-full text-left flex justify-between items-center font-semibold text-lg"
              >
                {faq.question}
                <span className="ml-2 text-gray-500">
                  {activeIndex === idx ? "−" : "+"}
                </span>
              </button>
              {activeIndex === idx && (
                <p className="mt-3 text-gray-700 whitespace-pre-line">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <MobileBottomMenu />
    </>
  );
};

export default ReferEarnFAQ;
