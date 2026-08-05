import { type NextRequest, NextResponse } from "next/server";

const NOWPAYMENTS_INVOICE_URL = "https://api.nowpayments.io/v1/invoice";

type CreateInvoiceRequest = {
	priceAmount?: unknown;
	priceCurrency?: unknown;
	checkoutId?: unknown;
};

type NOWPaymentsInvoiceResponse = {
	id?: string | number;
	invoice_url?: string;
	message?: string;
	[key: string]: unknown;
};

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json()) as CreateInvoiceRequest;

		const priceAmount = Number(body.priceAmount);

		const priceCurrency = String(body.priceCurrency || "usd").toLowerCase();

		const checkoutId = String(body.checkoutId || "").trim();

		if (!Number.isFinite(priceAmount) || priceAmount <= 0) {
			return NextResponse.json(
				{
					error: "Please provide a valid payment amount.",
				},
				{
					status: 400,
				},
			);
		}

		if (!checkoutId) {
			return NextResponse.json(
				{
					error: "A Saleor checkout ID is required.",
				},
				{
					status: 400,
				},
			);
		}

		const apiKey = process.env.NOWPAYMENTS_API_KEY;

		const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

		if (!apiKey) {
			console.error("NOWPAYMENTS_API_KEY is missing.");

			return NextResponse.json(
				{
					error: "NOWPAYMENTS_API_KEY is missing.",
				},
				{
					status: 500,
				},
			);
		}

		if (!siteUrl) {
			console.error("NEXT_PUBLIC_SITE_URL is missing.");

			return NextResponse.json(
				{
					error: "NEXT_PUBLIC_SITE_URL is missing.",
				},
				{
					status: 500,
				},
			);
		}

		const response = await fetch(NOWPAYMENTS_INVOICE_URL, {
			method: "POST",

			headers: {
				"x-api-key": apiKey,

				"Content-Type": "application/json",
			},

			body: JSON.stringify({
				price_amount: priceAmount,

				price_currency: priceCurrency,

				/*
				 * Save the Saleor checkout ID
				 * in NOWPayments.
				 *
				 * The webhook will receive this
				 * value as order_id.
				 */
				order_id: checkoutId,

				order_description: `Saleor checkout ${checkoutId}`,

				success_url: `${siteUrl}/payment/success`,

				cancel_url: `${siteUrl}/payment/cancel`,

				ipn_callback_url: `${siteUrl}/api/nowpayments/webhook`,
			}),

			cache: "no-store",
		});

		const data = (await response.json()) as NOWPaymentsInvoiceResponse;

		if (!response.ok) {
			console.error("NOWPayments API error:", data);

			return NextResponse.json(
				{
					error: "NOWPayments could not create the invoice.",

					details: data,
				},
				{
					status: response.status,
				},
			);
		}

		if (!data.invoice_url) {
			console.error("NOWPayments did not return an invoice URL:", data);

			return NextResponse.json(
				{
					error: "NOWPayments did not return an invoice URL.",
				},
				{
					status: 500,
				},
			);
		}

		return NextResponse.json(
			{
				invoiceId: data.id,

				invoiceUrl: data.invoice_url,
			},
			{
				status: 200,
			},
		);
	} catch (error) {
		console.error("Create NOWPayments invoice error:", error);

		return NextResponse.json(
			{
				error: "Could not create the NOWPayments invoice.",
			},
			{
				status: 500,
			},
		);
	}
}
