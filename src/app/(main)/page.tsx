import Link from "next/link";
import { ProductListPaginatedDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";
import { ProductList } from "@/ui/components/ProductList";

export const metadata = {
	title: "Crypto Marketplace | Buy Real Products Using Crypto",
	description: "Shop real physical products from trusted sellers and pay using cryptocurrency.",
};

export default async function Page() {
	const { products } = await executeGraphQL(ProductListPaginatedDocument, {
		variables: {
			first: 24,
			after: null,
		},
		revalidate: 60,
	});

	if (!products) {
		throw new Error("No products found");
	}

	const allProducts = products.edges.map(({ node }) => node);

	return (
		<div className="bg-white text-black">
			{/* Crypto Hero Banner */}
			<section className="relative overflow-hidden bg-zinc-950 text-white">
				<div className="absolute inset-0 bg-gradient-to-r from-black via-zinc-950/95 to-zinc-900" />

				<div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8">
					{/* Left content */}
					<div className="max-w-2xl">
						<p className="mb-6 inline-flex rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium tracking-wider text-zinc-300">
							THE FUTURE OF SHOPPING
						</p>

						<h1 className="text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
							Buy Real Products
							<br />
							Using Crypto
						</h1>

						<p className="mt-7 max-w-xl text-lg leading-8 text-zinc-300">
							Shop quality physical products from trusted sellers and pay securely using your favorite
							cryptocurrency.
						</p>

						<div className="mt-9 flex flex-wrap gap-4">
							<Link
								href="#all-products"
								className="rounded-xl bg-white px-7 py-4 font-semibold text-black transition hover:bg-zinc-200"
							>
								Shop Now
							</Link>

							<Link
								href="#how-it-works"
								className="rounded-xl border border-white/30 px-7 py-4 font-semibold text-white transition hover:bg-white/10"
							>
								How It Works
							</Link>
						</div>

						<div className="mt-10 flex flex-wrap items-center gap-3 text-sm text-zinc-400">
							<span>Supported payments</span>

							<span className="border-white/15 rounded-full border bg-white/10 px-4 py-2">₿ Bitcoin</span>

							<span className="border-white/15 rounded-full border bg-white/10 px-4 py-2">Ξ Ethereum</span>

							<span className="border-white/15 rounded-full border bg-white/10 px-4 py-2">USDT</span>

							<span className="border-white/15 rounded-full border bg-white/10 px-4 py-2">USDC</span>
						</div>
					</div>

					{/* Right visual */}
					<div className="relative hidden min-h-[500px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-900 lg:block">
						<div className="absolute inset-0 bg-gradient-to-br from-zinc-700 via-zinc-900 to-black" />

						<div className="absolute inset-0 flex items-center justify-center">
							<div className="relative flex h-72 w-72 items-center justify-center rounded-[3rem] border border-white/20 bg-white/5 shadow-2xl backdrop-blur">
								<span className="text-8xl">₿</span>

								<div className="border-white/15 absolute -right-8 -top-8 rounded-2xl border bg-black/80 px-5 py-4 backdrop-blur">
									<p className="text-xs text-zinc-400">SECURE PAYMENT</p>

									<p className="mt-1 font-semibold">Crypto Accepted</p>
								</div>

								<div className="border-white/15 absolute -bottom-7 -left-8 rounded-2xl border bg-black/80 px-5 py-4 backdrop-blur">
									<p className="text-xs text-zinc-400">PHYSICAL PRODUCTS</p>

									<p className="mt-1 font-semibold">Delivered to You</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Marketplace Benefits */}
			<section className="relative z-10 mx-auto -mt-8 max-w-7xl px-6 lg:px-8">
				<div className="grid gap-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl md:grid-cols-2 lg:grid-cols-4">
					<div>
						<h3 className="font-semibold">Secure Crypto Payments</h3>

						<p className="mt-2 text-sm leading-6 text-zinc-600">
							Pay safely using supported cryptocurrencies.
						</p>
					</div>

					<div>
						<h3 className="font-semibold">Real Products</h3>

						<p className="mt-2 text-sm leading-6 text-zinc-600">
							Physical products delivered to your address.
						</p>
					</div>

					<div>
						<h3 className="font-semibold">Worldwide Shipping</h3>

						<p className="mt-2 text-sm leading-6 text-zinc-600">
							Shop products from sellers around the world.
						</p>
					</div>

					<div>
						<h3 className="font-semibold">Customer Support</h3>

						<p className="mt-2 text-sm leading-6 text-zinc-600">Help is available throughout your order.</p>
					</div>
				</div>
			</section>

			{/* All Saleor Products */}
			<section id="all-products" className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
				<div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Shop with crypto</p>

						<h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">All Products</h2>

						<p className="mt-3 max-w-2xl text-zinc-600">
							Browse real physical products available in our crypto marketplace.
						</p>
					</div>

					<Link
						href="/products"
						className="inline-flex w-fit rounded-xl border border-zinc-300 px-5 py-3 text-sm font-semibold transition hover:border-black hover:bg-black hover:text-white"
					>
						View All Products →
					</Link>
				</div>

				<ProductList products={allProducts} />

				<div className="mt-12 flex justify-center">
					<Link
						href="/products"
						className="rounded-xl bg-black px-8 py-4 font-semibold text-white transition hover:bg-zinc-800"
					>
						Browse All Products
					</Link>
				</div>
			</section>

			{/* Why Buy From Us */}
			<section className="border-y border-zinc-200 bg-zinc-50">
				<div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
					<div className="max-w-2xl">
						<p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
							Shop with confidence
						</p>

						<h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
							Why buy from us?
						</h2>

						<p className="mt-4 text-base leading-7 text-zinc-600">
							Quality products, reliable service, and a simple shopping experience from checkout to delivery.
						</p>
					</div>

					<div className="mt-12 grid gap-8 md:grid-cols-3">
						{/* Selected Quality */}
						<div className="rounded-2xl border border-zinc-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-xl font-bold text-white">
								✓
							</div>

							<h3 className="mt-6 text-xl font-semibold text-zinc-950">Selected quality</h3>

							<p className="mt-3 leading-7 text-zinc-600">
								Each product is selected with quality, craftsmanship, and long-term value in mind.
							</p>
						</div>

						{/* Reliable Shipping */}
						<div className="rounded-2xl border border-zinc-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-xl font-bold text-white">
								→
							</div>

							<h3 className="mt-6 text-xl font-semibold text-zinc-950">Reliable shipping</h3>

							<p className="mt-3 leading-7 text-zinc-600">
								Delivery options and estimated shipping times are shown before you complete checkout.
							</p>
						</div>

						{/* Clear Returns */}
						<div className="rounded-2xl border border-zinc-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:shadow-lg">
							<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black text-xl font-bold text-white">
								↺
							</div>

							<h3 className="mt-6 text-xl font-semibold text-zinc-950">Clear returns</h3>

							<p className="mt-3 leading-7 text-zinc-600">
								Our return policy clearly explains eligibility, return steps, and available support.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* How It Works */}
			<section id="how-it-works" className="bg-white">
				<div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
					<p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Simple and secure</p>

					<h2 className="mt-3 text-3xl font-bold sm:text-4xl">How It Works</h2>

					<div className="mt-12 grid gap-8 md:grid-cols-3">
						<div>
							<span className="text-4xl font-bold text-zinc-300">01</span>

							<h3 className="mt-4 text-xl font-semibold">Choose a Product</h3>

							<p className="mt-2 leading-7 text-zinc-600">
								Browse products and add your favorite items to your cart.
							</p>
						</div>

						<div>
							<span className="text-4xl font-bold text-zinc-300">02</span>

							<h3 className="mt-4 text-xl font-semibold">Pay with Crypto</h3>

							<p className="mt-2 leading-7 text-zinc-600">
								Complete checkout using a supported crypto payment method.
							</p>
						</div>

						<div>
							<span className="text-4xl font-bold text-zinc-300">03</span>

							<h3 className="mt-4 text-xl font-semibold">Get It Delivered</h3>

							<p className="mt-2 leading-7 text-zinc-600">
								The seller processes your order and ships your physical product.
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
