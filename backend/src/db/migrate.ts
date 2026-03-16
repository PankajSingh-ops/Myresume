import fs from 'fs';
import path from 'path';
import pool from './pool';

async function runMigrations() {
    const client = await pool.connect();

    try {
        // 1. Create the migrations tracking table if not exists
        await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

        console.log('Fetching applied migrations...');
        const { rows } = await client.query('SELECT version FROM schema_migrations');
        const appliedMigrations = new Set(rows.map((row) => row.version));

        // 2. Read all .sql files in /migrations
        const migrationsDir = path.join(__dirname, 'migrations');
        const files = fs.readdirSync(migrationsDir)
            .filter((file) => file.endsWith('.sql'))
            .sort(); // Sort alphabetically (and effectively, chronologically because of 001_, etc)

        // 3. Process each migration in a transaction
        for (const file of files) {
            if (!appliedMigrations.has(file)) {
                console.log(`Applying migration: ${file}`);
                const sql = fs.readFileSync(path.join(migrationsDir, file), 'utf-8');

                // Wrapping in transaction
                await client.query('BEGIN');
                try {
                    await client.query(sql);
                    await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file]);
                    await client.query('COMMIT');
                    console.log(`Successfully applied: ${file}`);
                } catch (err: any) {
                    await client.query('ROLLBACK');
                    console.error(`Failed migration ${file}: ${err.message}`);
                    throw err;
                }
            } else {
                console.log(`Skipping already applied migration: ${file}`);
            }
        }

        console.log('All migrations applied successfully.');
    } catch (error) {
        console.error('Migration execution failed:', error);
        process.exit(1);
    } finally {
        client.release();
        // End the pool so the process can exit
        await pool.end();
    }
}

// Execute migration
runMigrations();
