// Test login endpoint using axios
const axios = require('axios');

async function testLogin() {
    try {
        const response = await axios.post('http://localhost:3001/api/auth/login', {
            email: 'khulud357diafat@heroadmin',
            password: 'diafatnoor1'
        });

        console.log('✅ Status:', response.status);
        console.log('✅ Success! Login works!');
        console.log('Response:', JSON.stringify(response.data, null, 2));
    } catch (error) {
        console.log('❌ Status:', error.response?.status);
        console.log('❌ Error:', error.response?.data || error.message);
    }
}

testLogin();
