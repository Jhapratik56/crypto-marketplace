"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { auth } from "@/lib/firebase";

export function LogoutButton() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);

	const handleLogout = async () => {
		setIsLoading(true);

		try {
			await signOut(auth);

			router.replace("/");
			router.refresh();
		} catch (error) {
			console.error("Logout failed:", error);
			setIsLoading(false);
		}
	};

	return (
		<button
			type="button"
			onClick={handleLogout}
			disabled={isLoading}
			className="
				rounded-lg
				bg-neutral-900
				px-4
				py-2
				text-sm
				font-semibold
				text-white
				transition
				hover:bg-neutral-800
				disabled:cursor-not-allowed
				disabled:opacity-60
			"
		>
			{isLoading ? "Signing out..." : "Sign out"}
		</button>
	);
}
