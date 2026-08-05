"use client";

import { useState } from "react";

type PaymentResponse = {
	invoiceId?: string | number;
	invoiceUrl?: string;
	error?: string;
};

export default function PaymentTestPage() {
	const [loading, setLoading] = useState(false);

	const [error, setError] = useState("");

	async function handlePayment() {
		try {
			setLoading(true);
			setError("");

			const response = await fetch("/api/nowpayments/create-invoice", {
				method: "POST",

				headers: {
					"Content-Type": "application/json",
				},

				body: JSON.stringify({
					priceAmount: 2,

					priceCurrency: "usd",

					orderId: `TEST-${Date.now()}`,
				}),
			});

			const data = (await response.json()) as PaymentResponse;

			if (!response.ok) {
				throw new Error(data.error || "Could not create the payment.");
			}

			if (!data.invoiceUrl) {
				throw new Error("Payment URL was not returned.");
			}

			window.location.href = data.invoiceUrl;
		} catch (error) {
			console.error("Payment error:", error);

			setError(error instanceof Error ? error.message : "Something went wrong.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<main className="min-h-screen bg-zinc-50 px-6 py-20 text-black">
			<div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
				<p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">NOWPayments Test</p>

				<h1 className="mt-3 text-3xl font-bold">Pay with Crypto</h1>

				<p className="mt-4 leading-7 text-zinc-600">This is a test payment of $1.</p>

				<div className="mt-8 rounded-xl bg-zinc-100 p-5">
					<div className="flex justify-between">
						<span className="text-zinc-600">Test order</span>

						<span className="font-semibold">$1.00 USD</span>
					</div>
				</div>

				<button
					type="button"
					onClick={handlePayment}
					disabled={loading}
					className="mt-6 flex w-full items-center justify-center rounded-xl bg-black px-5 py-4 font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
				>
					{loading ? "Creating payment..." : "Pay with Crypto"}
				</button>

				{error && <p className="mt-4 text-sm text-red-600">{error}</p>}
			</div>
		</main>
	);
}
