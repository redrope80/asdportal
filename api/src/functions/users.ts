import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { executeQuery } from '../shared/database';
import { createSuccessResponse, createErrorResponse } from '../shared/utils';
import { User } from '../shared/types';

export async function usersProfile(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        // In a real implementation, you would extract user info from the SWA authentication headers
        // For now, we'll use a mock user based on x-ms-client-principal header
        
        const clientPrincipalHeader = request.headers.get('x-ms-client-principal');
        
        if (!clientPrincipalHeader) {
            return {
                status: 401,
                jsonBody: createErrorResponse('User not authenticated')
            };
        }

        // Decode the client principal (in real SWA, this would be base64 encoded)
        let userEmail: string;
        try {
            const clientPrincipal = JSON.parse(Buffer.from(clientPrincipalHeader, 'base64').toString());
            userEmail = clientPrincipal.userDetails || clientPrincipal.claims?.find((c: any) => c.typ === 'emails')?.val;
        } catch {
            // For development, assume the header contains the email directly
            userEmail = clientPrincipalHeader;
        }

        if (!userEmail) {
            return {
                status: 401,
                jsonBody: createErrorResponse('Invalid user authentication')
            };
        }

        // Get user profile from database
        const query = `
            SELECT 
                id,
                email,
                firstName,
                lastName,
                customerCode,
                role,
                createdAt,
                lastLoginAt
            FROM Users 
            WHERE email = @email
        `;

        const users = await executeQuery<User>(query, { email: userEmail });
        
        if (users.length === 0) {
            return {
                status: 404,
                jsonBody: createErrorResponse('User profile not found')
            };
        }

        // Update last login time
        const updateQuery = `
            UPDATE Users 
            SET lastLoginAt = GETDATE() 
            WHERE id = @userId
        `;
        await executeQuery(updateQuery, { userId: users[0].id });

        const user = users[0];
        // Remove sensitive data
        delete (user as any).passwordHash;

        return {
            status: 200,
            jsonBody: createSuccessResponse(user)
        };
    } catch (error) {
        context.error('Error fetching user profile:', error);
        return {
            status: 500,
            jsonBody: createErrorResponse('Failed to fetch user profile')
        };
    }
}

export async function usersRegister(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const body = await request.json() as any;
        
        if (!body || !body.email || !body.firstName || !body.lastName || !body.customerCode) {
            return {
                status: 400,
                jsonBody: createErrorResponse('Missing required fields: email, firstName, lastName, customerCode')
            };
        }

        // Check if user already exists
        const existingUserQuery = `SELECT id FROM Users WHERE email = @email`;
        const existingUsers = await executeQuery(existingUserQuery, { email: body.email });
        
        if (existingUsers.length > 0) {
            return {
                status: 409,
                jsonBody: createErrorResponse('User with this email already exists')
            };
        }

        // Create new user (in a real app, you'd hash the password)
        const insertQuery = `
            INSERT INTO Users (id, email, firstName, lastName, customerCode, role, createdAt)
            OUTPUT INSERTED.*
            VALUES (NEWID(), @email, @firstName, @lastName, @customerCode, 'customer', GETDATE())
        `;

        const newUsers = await executeQuery<User>(insertQuery, {
            email: body.email,
            firstName: body.firstName,
            lastName: body.lastName,
            customerCode: body.customerCode
        });

        const user = newUsers[0];
        // Remove sensitive data
        delete (user as any).passwordHash;

        return {
            status: 201,
            jsonBody: createSuccessResponse(user, 'User registered successfully')
        };
    } catch (error) {
        context.error('Error registering user:', error);
        return {
            status: 500,
            jsonBody: createErrorResponse('Failed to register user')
        };
    }
}

// Register HTTP triggers
app.http('usersProfile', {
    methods: ['GET'],
    authLevel: 'function', // Requires authentication
    route: 'users/profile',
    handler: usersProfile
});

app.http('usersRegister', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'users/register',
    handler: usersRegister
});