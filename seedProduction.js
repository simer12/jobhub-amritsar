// Script to seed production database via API
const fetch = require('node-fetch');

const API_URL = 'https://jobhub-amritsar.onrender.com/api';

const seedUsers = async () => {
    const users = [
        {
            name: 'Admin',
            email: 'admin@jobhub.com',
            password: 'admin123',
            role: 'admin',
            phone: '9999999999'
        },
        {
            name: 'Rajesh Kumar',
            email: 'rajesh@techAmr.com',
            password: 'password123',
            role: 'employer',
            companyName: 'TechAmr Solutions',
            phone: '9876543210'
        },
        {
            name: 'Manpreet Kaur',
            email: 'manpreet@example.com',
            password: 'password123',
            role: 'jobseeker',
            phone: '9876543220'
        }
    ];

    console.log('🌱 Registering users...');
    
    for (const user of users) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            
            const result = await response.json();
            if (response.ok) {
                console.log(`✅ Created: ${user.email}`);
            } else {
                console.log(`⚠️ ${user.email}: ${result.message}`);
            }
        } catch (error) {
            console.error(`❌ Failed ${user.email}:`, error.message);
        }
    }
    
    console.log('\n✅ Seeding complete!');
};

seedUsers();
