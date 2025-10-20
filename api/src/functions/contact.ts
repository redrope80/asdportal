import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { createSuccessResponse, createErrorResponse } from '../shared/utils';

export async function contactSubmit(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        if (request.method !== 'POST') {
            return {
                status: 405,
                jsonBody: createErrorResponse('Method not allowed')
            };
        }

        const body = await request.json() as any;
        
        if (!body || !body.name || !body.email || !body.subject || !body.message) {
            return {
                status: 400,
                jsonBody: createErrorResponse('Missing required fields: name, email, subject, message')
            };
        }

        // In a real implementation, you would:
        // 1. Save the contact form to database
        // 2. Send email notification to admin
        // 3. Send confirmation email to user
        
        context.log('Contact form submitted:', {
            name: body.name,
            email: body.email,
            phone: body.phone,
            subject: body.subject,
            messageLength: body.message?.length
        });

        // For now, just return success
        return {
            status: 200,
            jsonBody: createSuccessResponse(null, 'Contact form submitted successfully')
        };
    } catch (error) {
        context.error('Error processing contact form:', error);
        return {
            status: 500,
            jsonBody: createErrorResponse('Failed to submit contact form')
        };
    }
}

// Register HTTP trigger
app.http('contactSubmit', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'contact',
    handler: contactSubmit
});