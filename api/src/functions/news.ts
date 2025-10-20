import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { executeQuery } from '../shared/database';
import { createSuccessResponse, createErrorResponse, parseIntOrDefault } from '../shared/utils';
import { NewsItem, PaginatedResponse } from '../shared/types';

export async function newsGet(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const page = parseIntOrDefault(request.query.get('page'), 1);
        const pageSize = parseIntOrDefault(request.query.get('pageSize'), 10);
        const offset = (page - 1) * pageSize;

        // Get total count
        const countResult = await executeQuery<{ total: number }>(
            `SELECT COUNT(*) as total FROM News WHERE isActive = 1 AND (expiresAt IS NULL OR expiresAt > GETDATE())`
        );
        const totalCount = countResult[0]?.total || 0;

        // Get paginated news items
        const newsQuery = `
            SELECT 
                n.id,
                n.title,
                n.content,
                n.summary,
                n.imageUrl,
                n.publishedAt,
                n.expiresAt,
                n.isActive,
                n.authorId,
                u.firstName + ' ' + u.lastName as authorName,
                n.createdAt,
                n.updatedAt
            FROM News n
            LEFT JOIN Users u ON n.authorId = u.id
            WHERE n.isActive = 1 
                AND (n.expiresAt IS NULL OR n.expiresAt > GETDATE())
            ORDER BY n.publishedAt DESC
            OFFSET @offset ROWS FETCH NEXT @pageSize ROWS ONLY
        `;

        const newsItems = await executeQuery<NewsItem>(newsQuery, { offset, pageSize });

        const response: PaginatedResponse<NewsItem> = {
            items: newsItems,
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
        context.error('Error fetching news:', error);
        return {
            status: 500,
            jsonBody: createErrorResponse('Failed to fetch news items')
        };
    }
}

export async function newsGetById(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const id = request.params.id;
        if (!id) {
            return {
                status: 400,
                jsonBody: createErrorResponse('News ID is required')
            };
        }

        const query = `
            SELECT 
                n.id,
                n.title,
                n.content,
                n.summary,
                n.imageUrl,
                n.publishedAt,
                n.expiresAt,
                n.isActive,
                n.authorId,
                u.firstName + ' ' + u.lastName as authorName,
                n.createdAt,
                n.updatedAt
            FROM News n
            LEFT JOIN Users u ON n.authorId = u.id
            WHERE n.id = @id AND n.isActive = 1
        `;

        const newsItems = await executeQuery<NewsItem>(query, { id });
        
        if (newsItems.length === 0) {
            return {
                status: 404,
                jsonBody: createErrorResponse('News item not found')
            };
        }

        return {
            status: 200,
            jsonBody: createSuccessResponse(newsItems[0])
        };
    } catch (error) {
        context.error('Error fetching news item:', error);
        return {
            status: 500,
            jsonBody: createErrorResponse('Failed to fetch news item')
        };
    }
}

// Register HTTP triggers
app.http('newsGet', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'news',
    handler: newsGet
});

app.http('newsGetById', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'news/{id}',
    handler: newsGetById
});