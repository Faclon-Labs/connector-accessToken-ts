import { login } from './src/connectors/login_manager.js';
import { DeviceAccess } from './src/connectors/DeviceAccess.js';
import { UserAccess } from './src/connectors/UserAccess.js';
import { BruceHandler } from './src/connectors/BruceHandler.js';

async function testLogin() {
  try {
    console.log('🔐 Attempting login...');
    
    const loginOptions = {
      username: 'abhinav.g@iosense.io',
      password: 'Dawnstar@15072000',
      dataUrl: 'connector.iosense.io',
      organisation: 'https://iosense.io',
      origin: 'https://iosense.io',
      onPrem: false // Use HTTPS
    };

    console.log('📤 Sending request with options:', {
      username: loginOptions.username,
      dataUrl: loginOptions.dataUrl,
      organisation: loginOptions.organisation,
      origin: loginOptions.origin
    });

    const response = await login(loginOptions);
    
    if (response && response.success) {
      console.log('✅ Login successful!');
      console.log('📋 Auth Token:', response.authorization);
      console.log('🔄 Refresh Token:', response.refresh_token);
      console.log('🔑 IF Token:', response.ifToken);
      console.log('📦 Version:', response.version);
      console.log('👤 User ID:', response.user.id);
      console.log('📧 User Email:', response.user.email);
      console.log('🏢 Organisation:', response.user.organisation.orgName);
      console.log('👤 User Name:', response.user.userDetail.personalDetails.name.first + ' ' + response.user.userDetail.personalDetails.name.last);
    } else {
      console.log('❌ Login failed');
      if (response) {
        console.log('Errors:', response.errors);
        console.log('Full response:', JSON.stringify(response, null, 2));
      } else {
        console.log('No response received');
      }
    }
  } catch (error) {
    console.error('❌ Error during login:', error);
  }
}

async function testLoginAndFetchDevices() {
  try {
    // Use the provided auth token directly
    const accessToken = 'eyJhbGciOiJkaXIiLCJraWQiOiJNZ3g2WFZrenRLejVIejAxWi00UkN1RDlXcjY5MlJJX28yY0pCc3lmRmxhIiwiZW5jIjoiQTI1NkdDTSJ9..IDh4mFig14Q_AOYf.0IgyosgRR6qwWoTkhv31GjzI6pXpiKAipRcEVHMNrnyoQB9PeY0f6rfeX0HBGJbnnOnk0RYBrfIHGD0r50zCetoFfoH5YikDKzZLPBdzGqepxDe7QU_zQmB3OylYZX3XTRIE8N_ZMuORIOU-MrAaTIgxuGUy88W-wmYlajGXAgincFxO472EbVGqHNrizXsCkrPgNQP-6WFx-6WSBIkF8EcXi__63GVnnSqob7KxcEyuSJ3WCpGC3JCf0lFLzWjXGjTXR_c3x99XpU3oT1WYoH78QsnikKbPUyWBpvOsFzifVTSjdDIy5soCYflbVqUtZb_3_-IEuUc_Obu7gCmQWWIV8drqJH2UKqJ1RPANHey0QBaPtPA0JyNFymgLi4dOxEMCRWnAUGTbz5dZHsCWTD1B4TxmgJMM0Y2edEvcAhA6VrKMEEaNZQtX6FjmIysb49cQqAWwkQpYqZktGL6H9Vj9SAY.qnLA5vBXMlLe8seBm6g0bw';
    const dataUrl = 'connector.iosense.io';
    const onPrem = false;

    // Create DeviceAccess instance
    const deviceAccess = new DeviceAccess(dataUrl, accessToken, onPrem);

    // Fetch all devices (first 20 for demonstration)
    const devicesResponse = await deviceAccess.getAllDevicesPaginated({});

    if (devicesResponse && devicesResponse.success) {
      console.log('✅ Devices fetched successfully!');
      console.log('Total devices:', devicesResponse.data.totalCount);
      console.log('Devices:', devicesResponse.data.devices);
    } else {
      console.log('❌ Failed to fetch devices');
      if (devicesResponse) {
        console.log('Response:', devicesResponse);
      }
    }
  } catch (error) {
    console.error('❌ Error during device fetch:', error);
  }
}

async function testFetchUserDetails() {
  try {
    const accessToken = 'eyJhbGciOiJkaXIiLCJraWQiOiJNZ3g2WFZrenRLejVIejAxWi00UkN1RDlXcjY5MlJJX28yY0pCc3lmRmxhIiwiZW5jIjoiQTI1NkdDTSJ9..IDh4mFig14Q_AOYf.0IgyosgRR6qwWoTkhv31GjzI6pXpiKAipRcEVHMNrnyoQB9PeY0f6rfeX0HBGJbnnOnk0RYBrfIHGD0r50zCetoFfoH5YikDKzZLPBdzGqepxDe7QU_zQmB3OylYZX3XTRIE8N_ZMuORIOU-MrAaTIgxuGUy88W-wmYlajGXAgincFxO472EbVGqHNrizXsCkrPgNQP-6WFx-6WSBIkF8EcXi__63GVnnSqob7KxcEyuSJ3WCpGC3JCf0lFLzWjXGjTXR_c3x99XpU3oT1WYoH78QsnikKbPUyWBpvOsFzifVTSjdDIy5soCYflbVqUtZb_3_-IEuUc_Obu7gCmQWWIV8drqJH2UKqJ1RPANHey0QBaPtPA0JyNFymgLi4dOxEMCRWnAUGTbz5dZHsCWTD1B4TxmgJMM0Y2edEvcAhA6VrKMEEaNZQtX6FjmIysb49cQqAWwkQpYqZktGL6H9Vj9SAY.qnLA5vBXMlLe8seBm6g0bw';
    const dataUrl = 'connector.iosense.io';
    const onPrem = false;

    const userAccess = new UserAccess(dataUrl, accessToken, onPrem);
    const userDetails = await userAccess.getUserDetails({
      origin: 'https://iosense.io',
      organisation: 'https://iosense.io'
    });

    if (userDetails) {
      console.log('✅ User details fetched successfully!');
      console.log(JSON.stringify(userDetails, null, 2));
    } else {
      console.log('❌ Failed to fetch user details');
    }
  } catch (error) {
    console.error('❌ Error during user details fetch:', error);
  }
}

async function testFetchUserInsights() {
  try {
    const accessToken = 'eyJhbGciOiJkaXIiLCJraWQiOiJNZ3g2WFZrenRLejVIejAxWi00UkN1RDlXcjY5MlJJX28yY0pCc3lmRmxhIiwiZW5jIjoiQTI1NkdDTSJ9..IDh4mFig14Q_AOYf.0IgyosgRR6qwWoTkhv31GjzI6pXpiKAipRcEVHMNrnyoQB9PeY0f6rfeX0HBGJbnnOnk0RYBrfIHGD0r50zCetoFfoH5YikDKzZLPBdzGqepxDe7QU_zQmB3OylYZX3XTRIE8N_ZMuORIOU-MrAaTIgxuGUy88W-wmYlajGXAgincFxO472EbVGqHNrizXsCkrPgNQP-6WFx-6WSBIkF8EcXi__63GVnnSqob7KxcEyuSJ3WCpGC3JCf0lFLzWjXGjTXR_c3x99XpU3oT1WYoH78QsnikKbPUyWBpvOsFzifVTSjdDIy5soCYflbVqUtZb_3_-IEuUc_Obu7gCmQWWIV8drqJH2UKqJ1RPANHey0QBaPtPA0JyNFymgLi4dOxEMCRWnAUGTbz5dZHsCWTD1B4TxmgJMM0Y2edEvcAhA6VrKMEEaNZQtX6FjmIysb49cQqAWwkQpYqZktGL6H9Vj9SAY.qnLA5vBXMlLe8seBm6g0bw';
    const dataUrl = 'connector.iosense.io';
    const onPrem = false;

    const bruceHandler = new BruceHandler(dataUrl, accessToken, onPrem);
    const insightsResponse = await bruceHandler.fetchUserInsights({
      pagination: { page: 1, count: 10 },
      extraHeaders: {
        origin: 'https://iosense.io',
        organisation: 'https://iosense.io'
      }
    });

    if (insightsResponse && insightsResponse.success) {
      console.log('✅ User insights fetched successfully!');
      console.log(JSON.stringify(insightsResponse, null, 2));
    } else {
      console.log('❌ Failed to fetch user insights');
      if (insightsResponse) {
        console.log('Response:', insightsResponse);
      }
    }
  } catch (error) {
    console.error('❌ Error during user insights fetch:', error);
  }
}

// Run the test
//testLogin();
testLoginAndFetchDevices();
testFetchUserDetails();
testFetchUserInsights();