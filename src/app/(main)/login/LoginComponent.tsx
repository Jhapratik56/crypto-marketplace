"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "@/lib/firebase";
import { LoginForm } from "@/ui/components/LoginForm";

export const LoginComponent = () => {
	const router = useRouter();
	const [checkingAuth, setCheckingAuth] = useState(true);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				router.replace("/");
				return;
			}

			setCheckingAuth(false);
		});

		return () => unsubscribe();
	}, [router]);

	if (checkingAuth) {
		return (
			<div className="flex min-h-[400px] items-center justify-center">
				<div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-900" />
			</div>
		);
	}

	return <LoginForm />;
};
