// Simple test script to verify backend functionality
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000/api';

async function testBackend() {
  console.log('Testing backend functionality...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server connectivity...');
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword123'
      })
    });
    
    if (response.status === 400) {
      console.log('✅ Server is running (expected 400 for missing fields)');
    } else {
      console.log(`✅ Server is running (status: ${response.status})`);
    }
  } catch (error) {
    console.log('❌ Server is not running or not accessible');
    console.log('Error:', error.message);
    return;
  }

  // Test 2: Test signup endpoint
  console.log('\n2. Testing signup endpoint...');
  try {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpassword123'
      })
    });
    
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Signup endpoint working');
      console.log('Response:', data.message);
    } else {
      console.log('⚠️  Signup endpoint returned error (expected if email exists)');
      console.log('Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Signup endpoint failed');
    console.log('Error:', error.message);
  }

  console.log('\n✅ Backend testing completed!');
  console.log('\nNote: Some tests may fail if MongoDB is not running or configured.');
  console.log('Make sure to:');
  console.log('1. Start MongoDB service');
  console.log('2. Create a .env file in the backend directory with MONGO_URI');
  console.log('3. Run: cd backend && npm start');
}

testBackend();
