import { Suspense } from "react";
import { RegisterForm } from "@/ui/components/RegisterForm";
import { Loader } from "@/ui/atoms/Loader";

export default function RegisterPage() {
	return (
		<Suspense fallback={<Loader />}>
			<section className="mx-auto max-w-7xl p-8">
				<RegisterForm />
			</section>
		</Suspense>
	);
}
