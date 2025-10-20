import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { executeQuery } from '../shared/database';
import { createSuccessResponse, createErrorResponse, parseIntOrDefault } from '../shared/utils';
import { Product, ProductImage, ProductSpecification, PaginatedResponse } from '../shared/types';

export async function getProducts(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const page = parseIntOrDefault(request.query.get('page'), 1);
        const pageSize = parseIntOrDefault(request.query.get('pageSize'), 20);
        const categoryId = request.query.get('categoryId');
        const offset = (page - 1) * pageSize;

        let whereClause = 'WHERE p.isActive = 1';
        const params: any = { offset, pageSize };

        if (categoryId) {
            whereClause += ' AND p.categoryId = @categoryId';
            params.categoryId = categoryId;
        }

        // Get total count
        const countQuery = `
            SELECT COUNT(*) as total 
            FROM Products p 
            ${whereClause}
        `;
        const countResult = await executeQuery<{ total: number }>(countQuery, params);
        const totalCount = countResult[0]?.total || 0;

        // Get paginated products with category info
        const productsQuery = `
            SELECT 
                p.id,
                p.name,
                p.sku,
                p.description,
                p.shortDescription,
                p.price,
                p.categoryId,
                c.name as categoryName,
                p.isActive,
                p.createdAt,
                p.updatedAt
            FROM Products p
            LEFT JOIN Categories c ON p.categoryId = c.id
            ${whereClause}
            ORDER BY p.name
            OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
        `;

        const products = await executeQuery<Product>(productsQuery, params);

        // Get images and specifications for each product
        for (const product of products) {
            // Get product images
            const imagesQuery = `
                SELECT id, productId, url, alt, caption, sortOrder, isPrimary
                FROM ProductImages 
                WHERE productId = @productId 
                ORDER BY isPrimary DESC, sortOrder
            `;
            product.images = await executeQuery<ProductImage>(imagesQuery, { productId: product.id });

            // Get product specifications
            const specsQuery = `
                SELECT id, productId, name, value, unit, sortOrder
                FROM ProductSpecifications 
                WHERE productId = @productId 
                ORDER BY sortOrder
            `;
            product.specifications = await executeQuery<ProductSpecification>(specsQuery, { productId: product.id });
        }

        const response: PaginatedResponse<Product> = {
            items: products,
            totalCount,
            page,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize)
        };

        return {
            status: 200,
            jsonBody: createSuccessResponse(response)
        };
    } catch (error) {
        context.error('Error fetching products:', error);
        return {
            status: 500,
            jsonBody: createErrorResponse('Failed to fetch products')
        };
    }
}

export async function productsGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const id = request.params.id;
        if (!id) {
            return {
                status: 400,
                jsonBody: createErrorResponse('Product ID is required')
            };
        }

        const query = `
            SELECT 
                p.id,
                p.name,
                p.sku,
                p.description,
                p.shortDescription,
                p.price,
                p.categoryId,
                c.name as categoryName,
                p.isActive,
                p.createdAt,
                p.updatedAt
            FROM Products p
            LEFT JOIN Categories c ON p.categoryId = c.id
            WHERE p.id = @id AND p.isActive = 1
        `;

        const products = await executeQuery<Product>(query, { id });
        
        if (products.length === 0) {
            return {
                status: 404,
                jsonBody: createErrorResponse('Product not found')
            };
        }

        const product = products[0];

        // Get product images
        const imagesQuery = `
            SELECT id, productId, url, alt, caption, sortOrder, isPrimary
            FROM ProductImages 
            WHERE productId = @productId 
            ORDER BY isPrimary DESC, sortOrder
        `;
        product.images = await executeQuery<ProductImage>(imagesQuery, { productId: product.id });

        // Get product specifications
        const specsQuery = `
            SELECT id, productId, name, value, unit, sortOrder
            FROM ProductSpecifications 
            WHERE productId = @productId 
            ORDER BY sortOrder
        `;
        product.specifications = await executeQuery<ProductSpecification>(specsQuery, { productId: product.id });

        return {
            status: 200,
            jsonBody: createSuccessResponse(product)
        };
    } catch (error) {
        context.error('Error fetching product:', error);
        return {
            status: 500,
            jsonBody: createErrorResponse('Failed to fetch product')
        };
    }
}

// Register HTTP triggers
app.http('productsGet', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'products',
    handler: getProducts
});

app.http('productsGetById', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'products/{id}',
    handler: productsGetById
});