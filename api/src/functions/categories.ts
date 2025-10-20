import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { executeQuery } from '../shared/database';
import { createSuccessResponse, createErrorResponse } from '../shared/utils';
import { Category } from '../shared/types';

export async function categoriesGet(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const query = `
            SELECT 
                id,
                name,
                slug,
                description,
                imageUrl,
                sortOrder,
                isActive,
                createdAt,
                updatedAt
            FROM Categories 
            WHERE isActive = 1 
            ORDER BY sortOrder, name
        `;

        const categories = await executeQuery<Category>(query);

        return {
            status: 200,
            jsonBody: createSuccessResponse(categories)
        };
    } catch (error) {
        context.error('Error fetching categories:', error);
        return {
            status: 500,
            jsonBody: createErrorResponse('Failed to fetch categories')
        };
    }
}

// Register HTTP trigger
app.http('categoriesGet', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'categories',
    handler: categoriesGet
});