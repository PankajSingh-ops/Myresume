import pool from './pool';
import bcrypt from 'bcryptjs';
import { config } from '../config';

async function seed() {
    if (config.NODE_ENV !== 'development') {
        console.warn('Seeding is only allowed in development mode. Exiting.');
        process.exit(0);
    }

    const client = await pool.connect();
    console.log('Starting seed process...');

    try {
        await client.query('BEGIN');

        // 1. Create Test User
        const email = 'test@example.com';
        const password = 'Test@123456';
        const passwordHash = await bcrypt.hash(password, config.BCRYPT_ROUNDS);

        const userRes = await client.query(`
      INSERT INTO users (email, password_hash, first_name, last_name, is_email_verified)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE 
      SET password_hash = EXCLUDED.password_hash
      RETURNING id
    `, [email, passwordHash, 'Test', 'User', true]);

        const userId = userRes.rows[0].id;
        console.log(`User created/updated: ${userId}`);

        // 2. Grant Signup Bonus Credits
        const checkCreditRes = await client.query(`
      SELECT balance FROM user_credits WHERE user_id = $1
    `, [userId]);

        let currentBalance = 0;

        if (checkCreditRes.rowCount === 0) {
            // Insert default record if not exists.
            const initialBalanceRes = await client.query(`
          INSERT INTO user_credits (user_id, balance) 
          VALUES ($1, $2)
          RETURNING balance
       `, [userId, 0]);
            currentBalance = initialBalanceRes.rows[0].balance;
        } else {
            currentBalance = checkCreditRes.rows[0].balance;
        }

        if (currentBalance === 0) {
            console.log('Granting signup bonus...');
            const bonus = config.SIGNUP_BONUS_CREDITS;
            const newBalance = currentBalance + bonus;

            await client.query(`
        UPDATE user_credits SET balance = $1 WHERE user_id = $2
      `, [newBalance, userId]);

            await client.query(`
        INSERT INTO credit_transactions (user_id, type, amount, balance_after, description)
        VALUES ($1, $2, $3, $4, $5)
      `, [userId, 'signup_bonus', bonus, newBalance, 'Signup bonus granted initially.']);
        } else {
            console.log(`User already has a non-zero credit balance: ${currentBalance}. Skipping signup bonus grant.`);
        }

        // 3. Create a Sample Resume
        const resumeCheckRes = await client.query(`
      SELECT id FROM resumes WHERE user_id = $1 AND title = $2
    `, [userId, 'Sample Resume']);

        if (resumeCheckRes.rowCount === 0) {
            console.log('Creating sample resume...');
            await client.query(`
        INSERT INTO resumes (user_id, title, slug, is_public, content)
        VALUES ($1, $2, $3, $4, $5)
      `, [
                userId,
                'Sample Resume',
                'sample-resume-test-user',
                false,
                JSON.stringify({
                    basics: { name: 'Test User', email: 'test@example.com', title: 'Software Engineer' },
                    work: [{ company: 'TestCorp', position: 'Developer', current: true }]
                })
            ]);
        } else {
            console.log('Sample resume already exists. Skipping creation.');
        }

        await client.query('COMMIT');
        console.log('Seed completed successfully!');

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Seeding failed:', error);
    } finally {
        client.release();
        await pool.end();
    }
}

seed();
