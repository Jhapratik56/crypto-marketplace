import crypto from "crypto";
import { type NextRequest, NextResponse } from "next/server";

type NOWPaymentsWebhookPayload = {
	payment_id?: number;
	payment_status?: string;
	order_id?: string;
	price_amount?: number;
	price_currency?: string;
	pay_amount?: number;
	pay_currency?: string;
	[key: string]: unknown;
};

function createSignature(payload: NOWPaymentsWebhookPayload, ipnSecret: string): string {
	const sortedPayload = Object.keys(payload)
		.sort()
		.reduce<Record<string, unknown>>((result, key) => {
			const value = payload[key];

			// NOWPayments ignores null
			// and undefined values.
			if (value !== null && value !== undefined) {
				result[key] = value;
			}

			return result;
		}, {});

	const payloadString = JSON.stringify(sortedPayload);

	return crypto.createHmac("sha512", ipnSecret).update(payloadString, "utf8").digest("hex");
}

export async function POST(request: NextRequest) {
	try {
		const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;

		if (!ipnSecret) {
			console.error("NOWPAYMENTS_IPN_SECRET is missing.");

			return NextResponse.json(
				{
					error: "Webhook configuration is missing.",
				},
				{
					status: 500,
				},
			);
		}

		const signature = request.headers.get("x-nowpayments-sig");

		if (!signature) {
			return NextResponse.json(
				{
					error: "Missing NOWPayments signature.",
				},
				{
					status: 401,
				},
			);
		}

		const payload = (await request.json()) as NOWPaymentsWebhookPayload;

		const expectedSignature = createSignature(payload, ipnSecret);

		/*
		 * Convert both signatures to Uint8Array.
		 */
		const receivedSignatureBuffer = new Uint8Array(Buffer.from(signature, "hex"));

		const expectedSignatureBuffer = new Uint8Array(Buffer.from(expectedSignature, "hex"));

		/*
		 * timingSafeEqual requires both
		 * Buffers to have the same length.
		 */
		const signaturesMatch =
			receivedSignatureBuffer.length === expectedSignatureBuffer.length &&
			crypto.timingSafeEqual(receivedSignatureBuffer, expectedSignatureBuffer);

		if (!signaturesMatch) {
			console.error("Invalid NOWPayments IPN signature.");

			return NextResponse.json(
				{
					error: "Invalid webhook signature.",
				},
				{
					status: 401,
				},
			);
		}

		const paymentStatus = payload.payment_status;

		const orderId = payload.order_id;

		console.log("Verified NOWPayments webhook:", {
			orderId,
			paymentStatus,
			paymentId: payload.payment_id,
		});

		/*
		 * Only process the payment when
		 * NOWPayments reports "finished".
		 */
		if (paymentStatus === "finished") {
			console.log("Payment completed:", orderId);

			/*
			 * NEXT STEP:
			 *
			 * 1. Find the Saleor checkout.
			 *
			 * 2. Register the successful
			 *    payment in Saleor.
			 *
			 * 3. Complete the checkout.
			 *
			 * 4. Saleor creates the order.
			 */
		}

		if (paymentStatus === "failed" || paymentStatus === "expired") {
			console.log("Payment was not completed:", {
				orderId,
				paymentStatus,
			});
		}

		// Return HTTP 200 so NOWPayments
		// knows the webhook was received.
		return NextResponse.json(
			{
				received: true,
			},
			{
				status: 200,
			},
		);
	} catch (error) {
		console.error("NOWPayments webhook error:", error);

		return NextResponse.json(
			{
				error: "Could not process the webhook.",
			},
			{
				status: 500,
			},
		);
	}
}
