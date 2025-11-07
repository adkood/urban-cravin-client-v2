export const BASE_URL= "https://darfit.in"
export const LOGINURL = `${BASE_URL}/api/auth/login`
export const REGISTERURL = `${BASE_URL}/api/auth/signup`
export const CLIENT_LOGINURL = `api/auth/login`
export const CLIENT_REGISTERURL = `api/auth/register`
export const GET_USER_DETAILSURL = `${BASE_URL}/api/users/details`
export const GET_CART_URL = `${BASE_URL}/api/cart/`
export const ADD_CART_URL = `${BASE_URL}/api/cart/add`
export const REMOVE_CART_URL = `${BASE_URL}/api/cart/remove`
export const CHECKOUT_CASH_ON_DELIVERY_URL = `${BASE_URL}/api/orders/checkout/cod`
export const CHECKOUT_ONLINE_URL = `${BASE_URL}/api/orders/checkout/online`
export const VERIFY_PAYMENT_URL = `${BASE_URL}/api/orders/verify-payment`;
export const RETURNURLAFTERPAYMENT = "/"
export const GET_ADDRESSES_URL= `${BASE_URL}/api/users/addresses`
export const ADD_ADDRESS_URL = `${BASE_URL}/api/users/addresses`
export const DELETE_ADDRESS_URL = (addressId : string) => `${BASE_URL}/api/users/addresses/${addressId}`
export const UPDATE_ADDRESS_URL = (addressId : string) => `${BASE_URL}/api/users/addresses/${addressId}`
export const GET_ORDERS_URL = `${BASE_URL}/api/orders/my-orders`
export const ADD_REVIEW_URL = `${BASE_URL}/api/reviews`