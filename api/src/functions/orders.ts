import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { executeQuery } from '../shared/database';
import { createSuccessResponse, createErrorResponse, parseIntOrDefault } from '../shared/utils';
import { Order, OrderItem, Address } from '../shared/types';

export async function ordersGetByCustomer(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const customerCode = request.params.customerCode;
        const days = parseIntOrDefault(request.query.get('days'), 30);

        if (!customerCode) {
            return {
                status: 400,
                jsonBody: createErrorResponse('Customer code is required')
            };
        }

        // Get orders for the customer within the specified days
        const ordersQuery = `
            SELECT 
                o.id,
                o.orderNumber,
                o.customerCode,
                o.customerName,
                o.orderDate,
                o.totalAmount,
                o.status,
                o.shippingStreet,
                o.shippingCity,
                o.shippingState,
                o.shippingZipCode,
                o.shippingCountry,
                o.billingStreet,
                o.billingCity,
                o.billingState,
                o.billingZipCode,
                o.billingCountry,
                o.notes,
                o.createdAt,
                o.updatedAt
            FROM Orders o
            WHERE o.customerCode = @customerCode 
                AND o.orderDate >= DATEADD(day, -@days, GETDATE())
            ORDER BY o.orderDate DESC
        `;

        const orders = await executeQuery<any>(ordersQuery, { customerCode, days });

        // Transform orders and get order items
        const transformedOrders: Order[] = [];
        
        for (const orderRow of orders) {
            // Get order items
            const itemsQuery = `
                SELECT 
                    oi.id,
                    oi.orderId,
                    oi.productId,
                    oi.productName,
                    oi.productSku,
                    oi.quantity,
                    oi.unitPrice,
                    oi.totalPrice
                FROM OrderItems oi
                WHERE oi.orderId = @orderId
                ORDER BY oi.productName
            `;
            
            const orderItems = await executeQuery<OrderItem>(itemsQuery, { orderId: orderRow.id });

            const order: Order = {
                id: orderRow.id,
                orderNumber: orderRow.orderNumber,
                customerCode: orderRow.customerCode,
                customerName: orderRow.customerName,
                orderDate: orderRow.orderDate,
                totalAmount: orderRow.totalAmount,
                status: orderRow.status,
                items: orderItems,
                shippingAddress: {
                    street: orderRow.shippingStreet,
                    city: orderRow.shippingCity,
                    state: orderRow.shippingState,
                    zipCode: orderRow.shippingZipCode,
                    country: orderRow.shippingCountry
                },
                billingAddress: {
                    street: orderRow.billingStreet,
                    city: orderRow.billingCity,
                    state: orderRow.billingState,
                    zipCode: orderRow.billingZipCode,
                    country: orderRow.billingCountry
                },
                notes: orderRow.notes,
                createdAt: orderRow.createdAt,
                updatedAt: orderRow.updatedAt
            };

            transformedOrders.push(order);
        }

        return {
            status: 200,
            jsonBody: createSuccessResponse(transformedOrders)
        };
    } catch (error) {
        context.error('Error fetching customer orders:', error);
        return {
            status: 500,
            jsonBody: createErrorResponse('Failed to fetch customer orders')
        };
    }
}

export async function ordersGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const id = request.params.id;
        if (!id) {
            return {
                status: 400,
                jsonBody: createErrorResponse('Order ID is required')
            };
        }

        const orderQuery = `
            SELECT 
                o.id,
                o.orderNumber,
                o.customerCode,
                o.customerName,
                o.orderDate,
                o.totalAmount,
                o.status,
                o.shippingStreet,
                o.shippingCity,
                o.shippingState,
                o.shippingZipCode,
                o.shippingCountry,
                o.billingStreet,
                o.billingCity,
                o.billingState,
                o.billingZipCode,
                o.billingCountry,
                o.notes,
                o.createdAt,
                o.updatedAt
            FROM Orders o
            WHERE o.id = @id
        `;

        const orders = await executeQuery<any>(orderQuery, { id });
        
        if (orders.length === 0) {
            return {
                status: 404,
                jsonBody: createErrorResponse('Order not found')
            };
        }

        const orderRow = orders[0];

        // Get order items
        const itemsQuery = `
            SELECT 
                oi.id,
                oi.orderId,
                oi.productId,
                oi.productName,
                oi.productSku,
                oi.quantity,
                oi.unitPrice,
                oi.totalPrice
            FROM OrderItems oi
            WHERE oi.orderId = @orderId
            ORDER BY oi.productName
        `;
        
        const orderItems = await executeQuery<OrderItem>(itemsQuery, { orderId: orderRow.id });

        const order: Order = {
            id: orderRow.id,
            orderNumber: orderRow.orderNumber,
            customerCode: orderRow.customerCode,
            customerName: orderRow.customerName,
            orderDate: orderRow.orderDate,
            totalAmount: orderRow.totalAmount,
            status: orderRow.status,
            items: orderItems,
            shippingAddress: {
                street: orderRow.shippingStreet,
                city: orderRow.shippingCity,
                state: orderRow.shippingState,
                zipCode: orderRow.shippingZipCode,
                country: orderRow.shippingCountry
            },
            billingAddress: {
                street: orderRow.billingStreet,
                city: orderRow.billingCity,
                state: orderRow.billingState,
                zipCode: orderRow.billingZipCode,
                country: orderRow.billingCountry
            },
            notes: orderRow.notes,
            createdAt: orderRow.createdAt,
            updatedAt: orderRow.updatedAt
        };

        return {
            status: 200,
            jsonBody: createSuccessResponse(order)
        };
    } catch (error) {
        context.error('Error fetching order:', error);
        return {
            status: 500,
            jsonBody: createErrorResponse('Failed to fetch order')
        };
    }
}

// Register HTTP triggers
app.http('ordersGetByCustomer', {
    methods: ['GET'],
    authLevel: 'function', // Requires authentication
    route: 'orders/customer/{customerCode}',
    handler: ordersGetByCustomer
});

app.http('ordersGetById', {
    methods: ['GET'],
    authLevel: 'function', // Requires authentication
    route: 'orders/{id}',
    handler: ordersGetById
});