import { useEffect, useMemo, useRef, useState } from "react";
import { type CountryCode, usePaymentGatewaysInitializeMutation } from "@/checkout/graphql";
import { useCheckout } from "@/checkout/hooks/useCheckout";
import { useSubmit } from "@/checkout/hooks/useSubmit";
import { type MightNotExist } from "@/checkout/lib/globalTypes";
import { type ParsedPaymentGateways } from "@/checkout/sections/PaymentSection/types";
import { getFilteredPaymentGateways } from "@/checkout/sections/PaymentSection/utils";

export const usePaymentGatewaysInitialize = () => {
	const {
		checkout: { billingAddress },
	} = useCheckout();

	const {
		checkout: { id: checkoutId, availablePaymentGateways },
	} = useCheckout();

	const billingCountry = billingAddress?.country.code as MightNotExist<CountryCode>;

	const [gatewayConfigs, setGatewayConfigs] = useState<ParsedPaymentGateways>([]);

	const previousBillingCountry = useRef(billingCountry);

	const [{ fetching }, paymentGatewaysInitialize] = usePaymentGatewaysInitializeMutation();

	const onSubmit = useSubmit<{}, typeof paymentGatewaysInitialize>(
		useMemo(
			() => ({
				hideAlerts: true,
				scope: "paymentGatewaysInitialize",

				// If Saleor has no configured gateways, do not run the
				// initialization mutation. The custom NOWPayments button
				// can still be displayed in the checkout.
				shouldAbort: () => !availablePaymentGateways.length,

				onSubmit: paymentGatewaysInitialize,

				parse: () => ({
					checkoutId,

					paymentGateways: getFilteredPaymentGateways(availablePaymentGateways).map(({ config, id }) => ({
						id,
						data: config,
					})),
				}),

				onSuccess: ({ data }) => {
					const parsedConfigs = (data.gatewayConfigs || []) as ParsedPaymentGateways;

					// Do not throw an error when there are no Saleor
					// payment gateways. An empty array is valid because
					// NOWPayments is being rendered as a custom option.
					setGatewayConfigs(parsedConfigs);
				},

				onError: ({ errors }) => {
					console.error("Payment gateway initialization failed:", errors);

					// Keep checkout usable even if gateway initialization
					// fails. Existing Saleor gateway components simply
					// will not be displayed.
					setGatewayConfigs([]);
				},
			}),
			[availablePaymentGateways, checkoutId, paymentGatewaysInitialize],
		),
	);

	useEffect(() => {
		void onSubmit();
	}, [onSubmit]);

	useEffect(() => {
		if (billingCountry !== previousBillingCountry.current) {
			previousBillingCountry.current = billingCountry;

			void onSubmit();
		}
	}, [billingCountry, onSubmit]);

	return {
		fetching,
		availablePaymentGateways: gatewayConfigs,
	};
};
