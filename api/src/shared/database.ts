import * as sql from 'mssql';

const config: sql.config = {
    server: process.env.AZURE_SQL_SERVER || '',
    database: process.env.AZURE_SQL_DATABASE || 'customer-portal',
    authentication: {
        type: 'default',
        options: {
            userName: process.env.AZURE_SQL_USERNAME || '',
            password: process.env.AZURE_SQL_PASSWORD || ''
        }
    },
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

let pool: sql.ConnectionPool | null = null;

export async function getConnection(): Promise<sql.ConnectionPool> {
    if (!pool) {
        pool = new sql.ConnectionPool(config);
        await pool.connect();
    }
    return pool;
}

export async function executeQuery<T = any>(query: string, params?: any): Promise<T[]> {
    const connection = await getConnection();
    const request = connection.request();
    
    // Add parameters if provided
    if (params) {
        Object.keys(params).forEach(key => {
            request.input(key, params[key]);
        });
    }
    
    const result = await request.query(query);
    return result.recordset;
}

export async function executeStoredProcedure<T = any>(
    procedureName: string, 
    params?: any
): Promise<T[]> {
    const connection = await getConnection();
    const request = connection.request();
    
    // Add parameters if provided
    if (params) {
        Object.keys(params).forEach(key => {
            request.input(key, params[key]);
        });
    }
    
    const result = await request.execute(procedureName);
    return result.recordset;
}

export function closeConnection(): void {
    if (pool) {
        pool.close();
        pool = null;
    }
}