import Link from "next/link";
import { ProductImageWrapper } from "@/ui/atoms/ProductImageWrapper";

import type { ProductListItemFragment } from "@/gql/graphql";
import { formatMoneyRange } from "@/lib/graphql";

export function ProductElement({
	product,
	loading,
	priority,
}: {
	product: ProductListItemFragment;
} & {
	loading: "eager" | "lazy";
	priority?: boolean;
}) {
	return (
		<li data-testid="ProductElement">
			<Link href={`/products/${product.slug}`} className="group block">
				<div>
					{product?.thumbnail?.url && (
						<ProductImageWrapper
							loading={loading}
							src={product.thumbnail.url}
							alt={product.thumbnail.alt ?? product.name}
							width={512}
							height={512}
							sizes="512px"
							priority={priority}
						/>
					)}

					<div className="mt-3 flex items-start justify-between gap-3">
						{/* Product name and category */}
						<div className="min-w-0 flex-1">
							<h3 className="line-clamp-2 min-h-[40px] text-sm font-semibold leading-5 text-neutral-900 transition group-hover:text-neutral-600">
								{product.name}
							</h3>

							<p className="mt-1 truncate text-sm text-neutral-500" data-testid="ProductElement_Category">
								{product.category?.name}
							</p>
						</div>

						{/* Product price */}
						<p
							className="shrink-0 text-sm font-semibold text-neutral-900"
							data-testid="ProductElement_PriceRange"
						>
							{formatMoneyRange({
								start: product?.pricing?.priceRange?.start?.gross,
								stop: product?.pricing?.priceRange?.stop?.gross,
							})}
						</p>
					</div>
				</div>
			</Link>
		</li>
	);
}
