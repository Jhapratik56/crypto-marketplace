"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const companyName = "AllTheCart";

export const Logo = () => {
	const pathname = usePathname();

	const content = companyName;

	if (pathname === "/") {
		return (
			<h1 className="flex items-center font-bold" aria-label="homepage">
				{content}
			</h1>
		);
	}
	return (
		<div className="flex items-center font-bold">
			<Link aria-label="homepage" href="/" className="flex items-center">
				{content}
			</Link>
		</div>
	);
};
