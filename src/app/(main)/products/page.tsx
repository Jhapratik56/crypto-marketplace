import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductListPaginatedDocument } from "@/gql/graphql";
import { ProductsPerPage, executeGraphQL } from "@/lib/graphql";
import { Pagination } from "@/ui/components/Pagination";
import { ProductList } from "@/ui/components/ProductList";

export const metadata = {
	title: "Products | Crypto Marketplace",
	description: "Browse real physical products and pay using cryptocurrency.",
};

type Props = {
	searchParams: {
		cursor?: string;
		q?: string;
	};
};

export default async function Page({ searchParams }: Props) {
	const cursor = searchParams.cursor;
	const search = searchParams.q?.trim();

	// When searching, request more products so the frontend can search
	// through a larger list. When browsing normally, use normal pagination.
	const numberOfProducts = search ? 100 : ProductsPerPage;

	const { products } = await executeGraphQL(ProductListPaginatedDocument, {
		variables: {
			first: numberOfProducts,
			after: search ? undefined : cursor,

			// Do not depend on Saleor's search filter for now.
			filter: undefined,
		},
		revalidate: 0,
	});

	if (!products) {
		notFound();
	}

	const allProducts = products.edges.map(({ node }) => node);

	const normalizedSearch = search?.toLowerCase().trim();

	const productList = normalizedSearch
		? allProducts.filter((product) => {
				const productName = product.name.toLowerCase();

				const categoryName = product.category?.name?.toLowerCase() ?? "";

				return productName.includes(normalizedSearch) || categoryName.includes(normalizedSearch);
		  })
		: allProducts;

	const productCount = productList.length;

	return (
		<div className="bg-white text-black">
			<section className="mx-auto max-w-7xl px-6 py-12 pb-16 lg:px-8">
				<div className="mb-10">
					<p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Crypto Marketplace</p>

					<h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
						{search ? `Search results for "${search}"` : "All Products"}
					</h1>

					<p className="mt-3 text-zinc-600">
						{search
							? `${productCount} product${productCount === 1 ? "" : "s"} found.`
							: "Browse physical products available to purchase using crypto."}
					</p>
				</div>

				{productList.length > 0 ? (
					<>
						<ProductList products={productList} />

						{/* Normal pagination only */}
						{!search && (
							<div className="mt-12">
								<Pagination pageInfo={products.pageInfo} />
							</div>
						)}
					</>
				) : (
					<div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-6 py-16 text-center">
						<h2 className="text-xl font-semibold text-zinc-950">No products found</h2>

						<p className="mt-3 text-zinc-600">
							{search
								? `We could not find products matching "${search}". Try another product name.`
								: "There are currently no products available."}
						</p>

						<Link
							href="/products"
							className="mt-6 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
						>
							View all products
						</Link>
					</div>
				)}
			</section>
		</div>
	);
}
