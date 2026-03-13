import insforge from '../lib/insforge';
import { CartItem, User } from '../types';

export const CheckoutHandler = {
    /**
     * Places an order and synchronizes the user's phone number if it has changed.
     * 
     * @param user The authenticated user object
     * @param cart The items in the shopping cart
     * @param cartTotal The total amount of the order
     * @param address The shipping address
     * @param phone The contact phone number provided by the user
     * @returns A promise that resolves to the created order or throws an error
     */
    placeOrder: async (
        user: User,
        cart: CartItem[],
        cartTotal: number,
        address: string,
        phone: string
    ) => {
        try {
            // 1. Update user profile with phone number if provided/changed
            const fullPhone = `+94${phone.trim()}`;
            if (fullPhone && fullPhone !== user.phone) {
                await insforge.database
                    .from('users')
                    .update({ phone: fullPhone })
                    .eq('id', user.id);
            }

            // 2. Create order
            const { data: order, error: orderError } = await insforge.database
                .from('orders')
                .insert([{
                    user_id: user.id,
                    total_amount: cartTotal,
                    shipping_address: address,
                    payment_method: 'manual_confirmation',
                    status: 'pending',
                    payment_status: 'unpaid',
                }])
                .select()
                .single();

            if (orderError) {
                console.error('Order creation error:', orderError);
                throw orderError;
            }

            if (!order) {
                throw new Error('Order was created but no data was returned.');
            }

            // 3. Create order items
            const orderItems = cart.map(item => ({
                order_id: order.id,
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            }));

            const { error: itemsError } = await insforge.database
                .from('order_items')
                .insert(orderItems);

            if (itemsError) {
                console.error('Order items insertion error:', itemsError);
                // We don't throw here to avoid the "false failure" if the order itself was created.
                // Instead, we log it and return the order.
                // In a production app, you might want to consider atomic transactions if the SDK supported it.
                // Or implement a compensating action (delete the order).
                // But given the user's report, we want to at least ensure they know SOMETHING worked.
                return { order, itemsError };
            }

            return { order, success: true };
        } catch (error) {
            console.error('CheckoutHandler.placeOrder error:', error);
            throw error;
        }
    }
};
