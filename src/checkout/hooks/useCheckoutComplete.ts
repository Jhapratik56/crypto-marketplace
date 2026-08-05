import { useMemo } from "react";

import { useCheckoutCompleteMutation } from "@/checkout/graphql";

import { useCheckout } from "@/checkout/hooks/useCheckout";

import { useSubmit } from "@/checkout/hooks/useSubmit";

import { replaceUrl } from "@/checkout/lib/utils/url";

export const useCheckoutComplete = () => {
	const {
		checkout: { id: checkoutId },
	} = useCheckout();

	const [{ fetching }, checkoutComplete] = useCheckoutCompleteMutation();

	const onCheckoutComplete = useSubmit<{}, typeof checkoutComplete>(
		useMemo(
			() => ({
				parse: () => ({
					checkoutId,
				}),

				onSubmit: checkoutComplete,

				onSuccess: ({ data }) => {
					console.log("Saleor checkoutComplete response:", data);

					const order = data.order;

					if (!order) {
						console.error("Saleor did not create an order.");

						console.error("Saleor response errors:", data.errors);

						return;
					}

					console.log("Saleor order created:", order);

					const newUrl = replaceUrl({
						query: {
							order: order.id,
						},

						replaceWholeQuery: true,
					});

					console.log("Redirecting to:", newUrl);

					window.location.href = newUrl;
				},

				onError: ({ errors }) => {
					console.error("Saleor checkoutComplete request error:", errors);
				},
			}),
			[checkoutComplete, checkoutId],
		),
	);

	return {
		completingCheckout: fetching,

		onCheckoutComplete,
	};
};
