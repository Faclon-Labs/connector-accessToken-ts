import { DeviceAccess, DeviceHeaders, DeviceDataByTimeRangeResponse } from './connectors/DeviceAccess.js';

async function testGetDataByTimeRange() {
  const dataUrl = 'appserver.iosense.io'; // Replace with your backend URL
  const accessToken = 'eyJhbGciOiJkaXIiLCJraWQiOiJNZ3g2WFZrenRLejVIejAxWi00UkN1RDlXcjY5MlJJX28yY0pCc3lmRmxhIiwiZW5jIjoiQTI1NkdDTSJ9..0hqATd4sOlYpukAX.MsHIFjsVYcagle2obgj4qv4iS5wPMkak1XiDpyAr9s-S_RRn4fAt_vzPAIkW7BVnV3UaNyYBIf6NKHg0tMce5Da9EToE4D7LE5E2IdwyVbeQqesKptCzBheyzwPYHXy3DTk756mCPX0-vVus6H5gvit31FQ8ks5yrlHfgtKGgGdiP1lB2b0XGNYWVwJ49uUJvc0uGAeuXRZ6XnalPj0_4JrwXBfb0jbkH4DCcPYRa6KCfVqxHsWSpQngTMn0fsHGv-4zjWvFT8RstsMmQa7fzjmljnzXvJRCchYOVc6VHl_KXz0qMjQ-mrFUz4wtOY6UcYndXN6ax9CuwvNEXlw4Eq6e9qkskT8RMc0bC0hPGFV9SazUMo6SCTfK8qVd5r2XfL6mfn3fSQJndoTg2BXKfeYqn_QlXKh2wvMdBJyj1dJkOjJT1RUSStVeu_JrSSiVXMmveD2ho46Dmns-Gtr-aAE-qnU.n92Wp_fcDfSStG4R0ECTnw'; // Replace with your access token
  const devID = 'MJTEM_C1'; // Replace with an actual device devID
  const sensor = 'D5'; // Replace with an actual sensor ID
  const onPrem = false; // Set to true if on-premise (http), false for https

  const deviceAccess = new DeviceAccess(dataUrl, accessToken, onPrem);

  const extraHeaders: Partial<DeviceHeaders> = {
    origin: 'https://iosense.io',
    // Add any additional headers if needed
  };

  try {
    console.log('Testing getDataByTimeRange with different time formats...\n');

    // Test 1: Using ISO strings
    console.log('Test 1: Using ISO strings');
    const data1: DeviceDataByTimeRangeResponse | null = await deviceAccess.getDataByTimeRange(
      devID,
      sensor,
      '2025-06-20T13:00:00.000Z',
      '2025-06-20T14:00:00.000Z',
      60, // 1 minute downsampling
      extraHeaders
    );
    if (data1) {
      console.log('ISO strings response:', JSON.stringify(data1, null, 2));
    } else {
      console.log('Failed to retrieve data with ISO strings');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 2: Using Date objects
    console.log('Test 2: Using Date objects');
    const startDate = new Date('2025-06-20T13:00:00.000Z');
    const endDate = new Date('2025-06-20T14:00:00.000Z');
    const data2: DeviceDataByTimeRangeResponse | null = await deviceAccess.getDataByTimeRange(
      devID,
      sensor,
      startDate,
      endDate,
      60, // 1 minute downsampling
      extraHeaders
    );
    if (data2) {
      console.log('Date objects response:', JSON.stringify(data2, null, 2));
    } else {
      console.log('Failed to retrieve data with Date objects');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 3: Using Unix timestamps in milliseconds
    console.log('Test 3: Using Unix timestamps in milliseconds');
    const startTimeUnix = 1718884800000; // 2025-06-20T13:00:00.000Z
    const endTimeUnix = 1718888400000;   // 2025-06-20T14:00:00.000Z
    const data3: DeviceDataByTimeRangeResponse | null = await deviceAccess.getDataByTimeRange(
      devID,
      sensor,
      startTimeUnix,
      endTimeUnix,
      60, // 1 minute downsampling
      extraHeaders
    );
    if (data3) {
      console.log('Unix timestamps response:', JSON.stringify(data3, null, 2));
    } else {
      console.log('Failed to retrieve data with Unix timestamps');
    }

    console.log('\n' + '='.repeat(50) + '\n');

    // Test 4: Without downsampling
    console.log('Test 4: Without downsampling');
    const data4: DeviceDataByTimeRangeResponse | null = await deviceAccess.getDataByTimeRange(
      devID,
      sensor,
      '2025-06-20T13:00:00.000Z',
      '2025-06-20T13:10:00.000Z',
      undefined, // No downsampling
      extraHeaders
    );
    if (data4) {
      console.log('No downsampling response:', JSON.stringify(data4, null, 2));
    } else {
      console.log('Failed to retrieve data without downsampling');
    }

  } catch (error) {
    console.error('Error testing getDataByTimeRange:', error);
  }
}

testGetDataByTimeRange(); 