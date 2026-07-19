import { createContext, useMemo, useReducer, type ReactElement } from "react";

export type CartItemType = {
	sku: string;
	name: string;
	price: number;
	qty: number;
};

type CartStateType = { cart: CartItemType[] };

const initCartState: CartStateType = { cart: [] };

const REDUCER_ACTION_TYPE = {
	ADD: "ADD",
	REMOVE: "REMOVE",
	QUANTITY: "QUANTITY",
	SUBMIT: "SUBMIT",
};

export type ReducerActionType = typeof REDUCER_ACTION_TYPE;

export type ReducerAction = {
	type: string;
	payload?: CartItemType;
};

const reducer = (
	state: CartStateType,
	action: ReducerAction,
): CartStateType => {
	switch (action.type) {
		case REDUCER_ACTION_TYPE.ADD: {
			if (!action.payload) {
				throw new Error("action.payload missing in ADD action");
			}

			const { sku, name, price } = action.payload;

			const filteredCart: CartItemType[] = state.cart.filter(
				(item) => item.sku !== sku,
			);

			const itemExists: CartItemType | undefined = state.cart.find(
				(item) => item.sku === sku,
			);

			// if it exists we add 1 to the item, else it would just be 1 because it wouldn't have been in cart:
			const qty: number = itemExists ? itemExists.qty + 1 : 1;

			// really our state only has `cart`, but this is in case you had other things (it's still a good idea to continue to spread that state in there)
			// filteredCart has all the other items we're not updating
			// put in the item we are updating:
			return { ...state, cart: [...filteredCart, { sku, name, price, qty }] };
		}
		case REDUCER_ACTION_TYPE.REMOVE: {
			if (!action.payload) {
				throw new Error("action.payload missing in REMOVE action");
			}

			// we're excluding this `sku` in filteredCart:
			const { sku } = action.payload;

			const filteredCart: CartItemType[] = state.cart.filter(
				(item) => item.sku !== sku,
			);

			return { ...state, cart: [...filteredCart] };
		}

		case REDUCER_ACTION_TYPE.QUANTITY: {
			if (!action.payload) {
				throw new Error("action.payload missing in QUANTITY action");
			}

			const { sku, qty } = action.payload;

			const itemExists: CartItemType | undefined = state.cart.find(
				(item) => item.sku === sku,
			);

			if (!itemExists) {
				throw new Error("item must exist in order to update quantity");
			}

			const updatedItem: CartItemType = { ...itemExists, qty };

			const filteredCart: CartItemType[] = state.cart.filter(
				(item) => item.sku !== sku,
			);

			return { ...state, cart: [...filteredCart, updatedItem] };
		}

		case REDUCER_ACTION_TYPE.SUBMIT: {
			// we're not really submitting to a server, we're just emptying out the cart when we click the "place a new order" button:
			// you can put in other logic if needed (e.g. linking to a server or submit somewhere, but we're just gonna use cart: [])
			return { ...state, cart: [] };
		}
		default:
			throw new Error("unidentified reducer action type");
	}
};

// this is our value={} via useContext:
const useCartContext = (initCartState: CartStateType) => {
	const [state, dispatch] = useReducer(reducer, initCartState);

	// memoizing the REDUCER_ACTION_TYPE so it always has the same referential equality when we pass it into a component - this will help us memoize the component without worrying about REDUCER_ACTIONS causing a re-render:
	const REDUCER_ACTIONS = useMemo(() => {
		return REDUCER_ACTION_TYPE;
	}, []);

	const totalItems: number = state.cart.reduce((previousValue, cartItem) => {
		return previousValue + cartItem.qty;
	}, 0);

	const totalPrice = new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(
		state.cart.reduce((previousValue, cartItem) => {
			return previousValue + cartItem.qty * cartItem.price;
		}, 0),
	);

	const cart = state.cart.sort((a, b) => {
		// extract the 4 numbers at the end of `sku` (e.g. item0001 → 0001)
		const itemA = Number(a.sku.slice(-4));
		const itemB = Number(b.sku.slice(-4));

		// item 1 will always be above item2:
		return itemA - itemB;
	});

	return { dispatch, REDUCER_ACTIONS, totalItems, totalPrice, cart };
};

export type UseCartContextType = ReturnType<typeof useCartContext>;

const initCartContextState: UseCartContextType = {
	dispatch: () => {},
	REDUCER_ACTIONS: REDUCER_ACTION_TYPE,
	totalItems: 0,
	totalPrice: "",
	cart: [],
};

export const CartContext =
	createContext<UseCartContextType>(initCartContextState);

type ChildrenType = { children?: ReactElement | ReactElement[] };

export const CartProvider = ({ children }: ChildrenType): ReactElement => {
	return (
		<CartContext.Provider value={useCartContext(initCartState)}>
			{children}
		</CartContext.Provider>
	);
};

export default CartContext;
