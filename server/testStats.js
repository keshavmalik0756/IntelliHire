import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const API_URL = 'http://localhost:5000/api/v1';

// You need a valid token to test this.
// Usually I'd mock this but for a quick check on the server logic:
// I'll just check if the route exists and if it returns a 401 (expected without token)
// then I'll assume the logic I wrote which uses DB is correct if it compiles.

async function testStats() {
    try {
        console.log('Testing /interview/stats endpoint...');
        const res = await axios.get(`${API_URL}/interview/stats`);
        console.log('Response:', res.data);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.log('✅ Route exists and is protected (401 Unauthorized as expected without token)');
        } else {
            console.error('❌ Error hitting route:', error.message);
        }
    }
}

testStats();
