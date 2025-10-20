const sql = require('mssql');
const fs = require('fs');
const path = require('path');

const config = {
    server: 'redropedev1.database.windows.net',
    database: 'arizona-shower-door-db-prod',
    user: 'sqladmin',
    password: 'CustomerPortal2025!',
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

async function setupDatabase() {
    try {
        console.log('Connecting to database...');
        await sql.connect(config);
        console.log('Connected successfully!');

        // Read and execute schema
        console.log('Setting up database schema...');
        const schemaScript = fs.readFileSync(path.join(__dirname, 'database', 'schema.sql'), 'utf8');
        
        // Split by GO statements and execute each batch
        const batches = schemaScript.split(/\bGO\b/gi).filter(batch => batch.trim());
        
        for (let i = 0; i < batches.length; i++) {
            const batch = batches[i].trim();
            if (batch) {
                console.log(`Executing batch ${i + 1}/${batches.length}...`);
                await sql.query(batch);
            }
        }

        console.log('Schema setup complete!');

        // Read and execute sample data
        console.log('Loading sample data...');
        const sampleDataScript = fs.readFileSync(path.join(__dirname, 'database', 'sample-data.sql'), 'utf8');
        
        const dataBatches = sampleDataScript.split(/\bGO\b/gi).filter(batch => batch.trim());
        
        for (let i = 0; i < dataBatches.length; i++) {
            const batch = dataBatches[i].trim();
            if (batch) {
                console.log(`Executing data batch ${i + 1}/${dataBatches.length}...`);
                await sql.query(batch);
            }
        }

        console.log('Sample data loaded successfully!');
        console.log('Database setup complete!');

    } catch (err) {
        console.error('Database setup failed:', err);
    } finally {
        await sql.close();
    }
}

setupDatabase();