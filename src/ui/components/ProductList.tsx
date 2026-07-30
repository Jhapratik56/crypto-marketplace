import { ProductElement } from "./ProductElement";
import { type ProductListItemFragment } from "@/gql/graphql";

export const ProductList = ({ products }: { products: readonly ProductListItemFragment[] }) => {
	return (
		<ul
			role="list"
			data-testid="ProductList"
			className="
				grid
				grid-cols-2
				gap-3
				sm:grid-cols-3
				md:grid-cols-4
				lg:grid-cols-5
				xl:grid-cols-6
			"
		>
			{products.map((product, index) => (
				<ProductElement
					key={product.id}
					product={product}
					priority={index < 6}
					loading={index < 6 ? "eager" : "lazy"}
				/>
			))}
		</ul>
	);
};
