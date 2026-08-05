"use client";

import { useState } from "react";
import { useCheckout } from "@/checkout/hooks/useCheckout";

type CreateInvoiceResponse = {
	invoiceUrl?: string;
	error?: string;
};

export const NowPaymentsButton = () => {
	const { checkout } = useCheckout();

	const [loading, setLoading] = useState(false);

	const [error, setError] = useState<string | null>(null);

	const handlePayment = async () => {
		if (!checkout) {
			setError("Checkout information is not available.");

			return;
		}

		const amount = checkout.totalPrice?.gross?.amount;

		const currency = checkout.totalPrice?.gross?.currency;

		if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0 || !currency) {
			setError("Unable to read the checkout total.");

			return;
		}

		try {
			setLoading(true);
			setError(null);

			console.log("Creating NOWPayments invoice...");

			console.log("Saleor checkout ID:", checkout.id);

			const response = await fetch("/api/nowpayments/create-invoice", {
				method: "POST",

				headers: {
					"Content-Type": "application/json",
				},

				body: JSON.stringify({
					priceAmount: amount,

					priceCurrency: currency.toLowerCase(),

					// This is the Saleor checkout ID.
					// The webhook will use it later
					// to find the correct checkout.
					checkoutId: checkout.id,
				}),
			});

			const data = (await response.json()) as CreateInvoiceResponse;

			console.log("NOWPayments response:", data);

			if (!response.ok) {
				throw new Error(data.error || "Unable to create the crypto payment.");
			}

			if (!data.invoiceUrl) {
				throw new Error("NOWPayments did not return a payment URL.");
			}

			window.location.href = data.invoiceUrl;
		} catch (error) {
			console.error("NOWPayments error:", error);

			setError(error instanceof Error ? error.message : "Unable to start the crypto payment.");

			setLoading(false);
		}
	};

	return (
		<div className="mt-6 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
			<div>
				<h3 className="font-semibold text-zinc-950">Pay with Crypto</h3>

				<p className="mt-1 text-sm text-zinc-600">
					You will be redirected to NOWPayments to complete your crypto payment.
				</p>
			</div>

			<button
				type="button"
				onClick={handlePayment}
				disabled={loading || !checkout}
				className="mt-4 w-full rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
			>
				{loading ? "Creating payment..." : "Pay with Crypto"}
			</button>

			{error && (
				<p className="mt-3 text-sm text-red-600" role="alert">
					{error}
				</p>
			)}
		</div>
	);
};
