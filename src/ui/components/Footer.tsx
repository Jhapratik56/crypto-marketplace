import Link from "next/link";
import { MenuGetBySlugDocument } from "@/gql/graphql";
import { executeGraphQL } from "@/lib/graphql";

export async function Footer() {
	const footerLinks = await executeGraphQL(MenuGetBySlugDocument, {
		variables: { slug: "footer" },
		revalidate: 60 * 60 * 24,
	});

	const currentYear = new Date().getFullYear();

	const linkClassName = "text-sm text-zinc-400 transition-colors duration-200 hover:text-white";

	return (
		<footer className="bg-black text-white">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				{/* Main footer */}
				<div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-5">
					{/* Brand */}
					<div className="md:col-span-2 lg:col-span-1">
						<Link href="/" className="text-2xl font-bold tracking-tight transition hover:text-zinc-300">
							AllTheCart
							<span className="text-zinc-400">.com</span>
						</Link>

						<p className="mt-5 max-w-sm text-sm leading-7 text-zinc-400">
							Buy real products using crypto. Shop quality physical products from trusted sellers with secure
							and simple payments.
						</p>

						<div className="mt-6 flex flex-wrap gap-2">
							<span className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400">
								Secure Payments
							</span>

							<span className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400">
								Real Products
							</span>

							<span className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs text-zinc-400">
								Global Shopping
							</span>
						</div>
					</div>

					{/* Saleor menu columns */}
					{footerLinks.menu?.items?.map((item) => (
						<div key={item.id}>
							<h3 className="text-sm font-semibold uppercase tracking-wider text-white">{item.name}</h3>

							<ul className="mt-6 space-y-4">
								{item.children?.map((child) => {
									if (child.category) {
										return (
											<li key={child.id}>
												<Link className={linkClassName} href={`/categories/${child.category.slug}`}>
													{child.category.name}
												</Link>
											</li>
										);
									}

									if (child.collection) {
										return (
											<li key={child.id}>
												<Link className={linkClassName} href={`/collections/${child.collection.slug}`}>
													{child.collection.name}
												</Link>
											</li>
										);
									}

									if (child.page) {
										return (
											<li key={child.id}>
												<Link className={linkClassName} href={`/pages/${child.page.slug}`}>
													{child.page.title}
												</Link>
											</li>
										);
									}

									if (child.url) {
										const isExternal = child.url.startsWith("http");

										if (isExternal) {
											return (
												<li key={child.id}>
													<a
														className={linkClassName}
														href={child.url}
														target="_blank"
														rel="noopener noreferrer"
													>
														{child.name}
													</a>
												</li>
											);
										}

										return (
											<li key={child.id}>
												<Link className={linkClassName} href={child.url}>
													{child.name}
												</Link>
											</li>
										);
									}

									return null;
								})}
							</ul>
						</div>
					))}

					{/* Customer care */}
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-wider text-white">Customer Care</h3>

						<ul className="mt-6 space-y-4">
							<li>
								<Link className={linkClassName} href="/pages/contact-us">
									Contact Us
								</Link>
							</li>

							<li>
								<Link className={linkClassName} href="/pages/terms-and-conditions">
									Terms &amp; Conditions
								</Link>
							</li>

							<li>
								<Link className={linkClassName} href="/pages/privacy-policy">
									Privacy Policy
								</Link>
							</li>

							<li>
								<Link className={linkClassName} href="/pages/shipping">
									Shipping
								</Link>
							</li>

							<li>
								<Link className={linkClassName} href="/pages/refund-policy">
									Refund Policy
								</Link>
							</li>

							<li>
								<Link className={linkClassName} href="/pages/faq">
									FAQ
								</Link>
							</li>
						</ul>
					</div>

					{/* Social links */}
					<div>
						<h3 className="text-sm font-semibold uppercase tracking-wider text-white">Follow Us</h3>

						<ul className="mt-6 space-y-4">
							<li>
								<a href="https://x.com/" target="_blank" rel="noopener noreferrer" className={linkClassName}>
									X / Twitter
								</a>
							</li>

							<li>
								<a
									href="https://www.instagram.com/"
									target="_blank"
									rel="noopener noreferrer"
									className={linkClassName}
								>
									Instagram
								</a>
							</li>

							<li>
								<a href="https://t.me/" target="_blank" rel="noopener noreferrer" className={linkClassName}>
									Telegram
								</a>
							</li>

							<li>
								<a
									href="https://discord.com/"
									target="_blank"
									rel="noopener noreferrer"
									className={linkClassName}
								>
									Discord
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Language and currency */}
				<div className="flex flex-col gap-5 border-t border-zinc-800 py-8 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-wrap items-center gap-4">
						<div className="flex items-center gap-3">
							<label htmlFor="footer-language" className="text-sm text-zinc-500">
								Language
							</label>

							<select
								id="footer-language"
								defaultValue="en"
								className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-zinc-500"
							>
								<option value="en">English</option>
								<option value="fr">Français</option>
							</select>
						</div>

						<div className="flex items-center gap-3">
							<label htmlFor="footer-currency" className="text-sm text-zinc-500">
								Currency
							</label>

							<select
								id="footer-currency"
								defaultValue="USD"
								className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-white outline-none transition focus:border-zinc-500"
							>
								<option value="USD">USD ($)</option>
								<option value="EUR">EUR (€)</option>
							</select>
						</div>
					</div>

					<p className="text-sm text-zinc-500">Shop globally. Pay with crypto.</p>
				</div>

				{/* Bottom footer */}
				<div className="flex flex-col gap-5 border-t border-zinc-800 py-8 sm:flex-row sm:items-center sm:justify-between">
					<p className="text-sm text-zinc-500">© {currentYear} CryptoMarket. All rights reserved.</p>

					<div className="flex items-end gap-2 text-sm text-zinc-400">
						<span className="flex h-7 w-7 items-end justify-center rounded-full border border-zinc-700 text-xs">
							✓
						</span>
						Secure crypto payments
					</div>
				</div>
			</div>
		</footer>
	);
}
