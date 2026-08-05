import React from "react";
import { PaymentMethods } from "./PaymentMethods";
import { NowPaymentsButton } from "./NowPayments/NowPaymentsButton";
import { Divider } from "@/checkout/components/Divider";
import { Title } from "@/checkout/components/Title";
import { type Children } from "@/checkout/lib/globalTypes";

export const PaymentSection: React.FC<Children> = ({ children }) => {
	return (
		<>
			<Divider />

			<div className="py-6" data-testid="paymentMethods">
				<Title>Payment methods</Title>

				{/* Existing Saleor payment methods */}
				<PaymentMethods />

				{/* NOWPayments crypto payment */}
				<NowPaymentsButton />

				{/* Existing billing address section */}
				{children}
			</div>
		</>
	);
};
