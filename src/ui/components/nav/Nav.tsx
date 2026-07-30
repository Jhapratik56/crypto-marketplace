import { Suspense } from "react";
import { Search } from "lucide-react";

import { UserMenu } from "./components/UserMenu/UserMenu";
import { CartNavItem } from "./components/CartNavItem";
import { NavLinks } from "./components/NavLinks";
import { MobileMenu } from "./components/MobileMenu";

export const Nav = () => {
	return (
		<nav className="flex w-full items-center gap-3 lg:gap-6" aria-label="Main navigation">
			{/* Desktop navigation links */}
			<ul className="hidden shrink-0 gap-4 overflow-x-auto whitespace-nowrap md:flex lg:gap-6">
				<NavLinks />
			</ul>

			{/* Desktop product search */}
			<div className="ml-auto hidden flex-1 justify-end lg:flex">
				<form action="/products" method="GET" role="search" className="relative w-full max-w-md">
					<label htmlFor="product-search" className="sr-only">
						Search products
					</label>

					<input
						id="product-search"
						type="search"
						name="q"
						placeholder="Search products..."
						autoComplete="off"
						className="h-10 w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 pr-12 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-black focus:bg-white focus:ring-2 focus:ring-black/10"
					/>

					<button
						type="submit"
						aria-label="Search products"
						className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 transition hover:bg-neutral-200 hover:text-black"
					>
						<Search className="h-5 w-5" />
					</button>
				</form>
			</div>

			{/* Mobile search button */}
			<a
				href="/products"
				aria-label="Search products"
				className="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-neutral-900 transition hover:bg-neutral-100 lg:hidden"
			>
				<Search className="h-5 w-5" />
			</a>

			{/* User account */}
			<div className="flex shrink-0 items-center justify-center whitespace-nowrap">
				<Suspense fallback={<div className="h-6 w-6" />}>
					<UserMenu />
				</Suspense>
			</div>

			{/* Shopping cart */}
			<div className="flex shrink-0 items-center">
				<Suspense fallback={<div className="h-6 w-6" />}>
					<CartNavItem />
				</Suspense>
			</div>

			{/* Mobile navigation menu */}
			<Suspense>
				<MobileMenu>
					<NavLinks />
				</MobileMenu>
			</Suspense>
		</nav>
	);
};
