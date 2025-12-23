import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const REASONS = [
    "I have a duplicate account",
    "Privacy or data concerns",
    "Too many emails or notifications",
    "Found a better alternative",
    "Taking a temporary break",
    "Other (please specify)",
];

const DeleteAccount = () => {
    // single-select reason (radio group)
    const [selectedReason, setSelectedReason] = useState("");
    const [otherText, setOtherText] = useState("");
    const [ack, setAck] = useState(false);
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // modal a11y helpers
    const modalBackdropRef = useRef(null);
    const modalCloseBtnRef = useRef(null);

    const validate = () => {
        if (!selectedReason) return "Please select one reason.";
        if (selectedReason === "Other (please specify)" && !otherText.trim()) {
            return "Please add a brief note for the 'Other' reason.";
        }
        if (!ack) return "Please acknowledge the consequences to proceed.";
        return "";
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        const v = validate();
        if (v) {
            setError(v);
            return;
        }
        setError("");
        setSubmitting(true);

        // TODO: Replace with real API call
        // await fetch("/api/delete-request", { method: "POST", body: JSON.stringify({ reason: selectedReason, note: otherText }) })
        //   .then(...)
        setTimeout(() => {
            setSubmitting(false);
            setShowModal(true);
        }, 900);
    };

    // Close on Escape
    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") setShowModal(false);
        };
        document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, []);

    // Focus the close button when modal opens
    useEffect(() => {
        if (showModal && modalCloseBtnRef.current) {
            modalCloseBtnRef.current.focus();
        }
    }, [showModal]);

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <div className="mx-auto max-w-2xl px-4 py-8">
                <h1 className="text-2xl font-semibold text-gray-900">Delete account</h1>
                <p className="mt-1 text-sm text-gray-600">
                    Deleting your account removes your profile and associated data per policy; consider alternatives below before submitting a request.
                </p>

                {/* Alternatives / notice */}
                <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4 text-amber-800">
                    <ul className="list-disc pl-5 text-sm">
                        <li>Export your data first if you may need it later.</li>
                        <li>Deactivation is available if you just need a break.</li>
                        <li>Deletion is permanent and typically irreversible.</li>
                    </ul>
                </div>

                <form onSubmit={onSubmit} className="mt-6 space-y-6">
                    {/* Use fieldset + legend for accessible grouping */}
                    <fieldset className="mt-3">
                        <legend className="text-sm font-medium text-gray-900">
                            Tell us why you want to delete your account
                        </legend>

                        <div
                            className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2"
                            role="radiogroup"
                            aria-label="Delete reasons"
                        >
                            {REASONS.map((reason) => (
                                <label
                                    key={reason}
                                    className="flex cursor-pointer items-center gap-3 rounded-md border border-gray-200 bg-white p-3 text-sm text-gray-800 hover:border-gray-300"
                                >
                                    <input
                                        type="radio"
                                        name="delete-reason"
                                        value={reason}
                                        className="h-4 w-4 border-gray-300 text-red-600 focus:ring-red-600"
                                        checked={selectedReason === reason}
                                        onChange={() => setSelectedReason(reason)}
                                    />
                                    <span>{reason}</span>
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    {selectedReason === "Other (please specify)" && (
                        <div className="mt-3">
                            <label className="block text-sm text-gray-700">
                                Briefly describe your reason
                            </label>
                            <textarea
                                rows={3}
                                className="mt-1 w-full rounded-md border border-gray-300 bg-white p-2 text-sm shadow-sm focus:border-gray-400 focus:outline-none"
                                placeholder="Share a short note"
                                value={otherText}
                                onChange={(e) => setOtherText(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                        Deleting your account will remove profile data and may delete activity history depending on policy, and this action cannot be undone in most cases.
                    </div>

                    <label className="flex items-start gap-3 text-sm text-gray-800">
                        <input
                            type="checkbox"
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                            checked={ack}
                            onChange={(e) => setAck(e.target.checked)}
                        />
                        <span>
                            I understand the consequences and still want to request account deletion.
                        </span>
                    </label>

                    {error && (
                        <p className="text-sm text-red-600" role="alert">
                            {error}
                        </p>
                    )}

                    <div className="flex items-center gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
                        >
                            {submitting ? "Submitting..." : "Submit delete request"}
                        </button>


                    </div>
                </form>
            </div>

            {/* Confirmation Modal */}
            {showModal && (
                <div
                    ref={modalBackdropRef}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-req-title"
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={(e) => {
                        if (e.target === modalBackdropRef.current) setShowModal(false);
                    }}
                >
                    <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl">
                        <div className="flex items-start justify-between gap-2">
                            <h2 id="delete-req-title" className="text-lg font-semibold text-gray-900">
                                Delete request submitted
                            </h2>
                            <button
                                ref={modalCloseBtnRef}
                                onClick={() => setShowModal(false)}
                                className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                                aria-label="Close"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="mt-2 text-sm text-gray-700">
                            Your account deletion request has been received and will be processed per our policy, and you’ll get an email update soon.
                        </p>

                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            >
                                Close
                            </button>
                            <Link
                                to="/"

                                className="rounded-md bg-gray-900 px-4 py-2 text-sm text-white hover:bg-black"
                            >
                                Go to home
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeleteAccount;
