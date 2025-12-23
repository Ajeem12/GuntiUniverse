import React, { useState } from 'react';
import MobileBottomMenu from "../components/landing/MobileBottomMenu";
import TataNeuNavbar from "../components/TataNeuNavbar";

const faqs = [
    {
        question: "How do I place an order?",
        answer: "Simply browse through our categories, add items to your cart, and proceed to checkout to place your order."
    },
    {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit/debit cards, UPI payments, and cash on delivery."
    },
    {
        question: "Do you offer discounts or loyalty programs?",
        answer: "Yes, we regularly offer discounts, deals, and have a loyalty program to reward repeat customers."
    },
    {
        question: "Is there a joining offer for new users?",
        answer: "Yes, new users can avail exclusive joining offers when they register and place their first order."
    },
    {
        question: "How does the wallet system work?",
        answer: "Our wallet system allows you to add money and use it for orders, making payment fast and easy."
    }
];


const FAQPage = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleIndex = (index) => {
        if (activeIndex === index) {
            setActiveIndex(null);
        } else {
            setActiveIndex(index);
        }
    };

    return (
        <>
            <TataNeuNavbar />
            <div className="max-w-4xl mx-auto p-2 mb:p-6 mb-20">
                <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="border rounded-md p-4">
                            <button
                                className="w-full text-left font-semibold text-lg"
                                onClick={() => toggleIndex(idx)}
                            >
                                {faq.question}
                            </button>
                            {activeIndex === idx && (
                                <p className="mt-2 text-gray-700">{faq.answer}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <MobileBottomMenu />
        </>

    );
};

export default FAQPage;

