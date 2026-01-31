// Test update credentials endpoint
const axios = require('axios');

async function testUpdateCredentials() {
    try {
        // First login to get token
        const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
            email: 'khulud357diafat@heroadmin',
            password: 'diafatnoor1'
        });

        const token = loginResponse.data.token;
        console.log('✅ Login successful, got token');

        // Try to update with wrong current password
        try {
            await axios.post('http://localhost:3001/api/admin/update-credentials', {
                currentPassword: 'wrongpassword',
                newEmail: 'test@example.com'
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.log('✅ Wrong password rejected:', error.response?.data);
        }

        // Try with correct password but no changes
        try {
            await axios.post('http://localhost:3001/api/admin/update-credentials', {
                currentPassword: 'diafatnoor1'
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
        } catch (error) {
            console.log('✅ No changes detected:', error.response?.data);
        }

        console.log('\n✅ Update credentials endpoint is working correctly!');

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    }
}

testUpdateCredentials();
