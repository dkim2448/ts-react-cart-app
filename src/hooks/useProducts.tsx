import { useContext } from "react";
import ProductsContext, {
	type UseProductsContextType,
} from "../context/ProductsProvider";

const useProducts = (): UseProductsContextType => {
	return useContext(ProductsContext);
};

export default useProducts;
