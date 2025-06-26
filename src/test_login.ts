import { login, LoginRequest, LoginResponse } from './connectors/login_manager.js';

async function testLogin() {
  const dataUrl = 'appserver.iosense.io'; // Replace with your backend URL
  const onPrem = false; // Set to true if on-premise (http), false for https

  const request: LoginRequest = {
    username: 'abhinav.g@iosense.io',
    password: 'Dawnstar@15072000',
    // fcmToken: 'optional_token',
  };

  const headers = {
    organisation: 'https://iosense.io',
    origin: 'https://iosense.io',
    // 'x-real-ip': '127.0.0.1',
    // 'user-agent': 'CustomAgent',
    // fcmToken: 'optional_token',
  };

  const response = await login(dataUrl, onPrem, request, headers);
  console.log('Login response:', response);
}

testLogin(); 