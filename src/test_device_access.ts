import { DeviceAccess } from './connectors/DeviceAccess.js';

// Replace with your actual backend URL and access token
const backendUrl = 'appserver.iosense.io';
const accessToken = 'eyJhbGciOiJkaXIiLCJraWQiOiJNZ3g2WFZrenRLejVIejAxWi00UkN1RDlXcjY5MlJJX28yY0pCc3lmRmxhIiwiZW5jIjoiQTI1NkdDTSJ9..KdpV6MbZeucpkfOE.xhyZ4ilAzWQGhjm6_s_VaKQTuDaGAxH19OmSHh_x6jSrVF7NZN_qvH9PtGx7Jowl04pxQDqMuwQzfKXX6m7p_MiS5QOFXcmscuuroZ2lWuEgSMVQdABeyU91CK1V1C72ADX5UHWv73JWXb-hRjvpwIpudFqNIlljDMIP_Rw3Oiqeb9ciA4sTa2q5HCGT4LAJSloUH0UshM9E-AqP6ygZco1LH35Dlfs-UHyWW9yjoZAAb5w2gdWTMxT-6DRoYXKJki201QEYTwGGYU0dhjjBT7adCcTzLq2IsZB-dCU-66FEMOPGZ0wD39T0jcL9u37FJUV6vFRxDu4NFSpNUZQtKA61HIoPjc8gpAgPRYIxHGRfJQLcqzDrdty53yoFRgriycSn0ilAEs_rKQAHsKtFB4ZEZsUDmlNt88tHdAB-2y72rYsr_R13-htNkBmWP4RAMdvUinZkDg2AObn_asteKcgf1H69xA.UJ5kkkUfo7CA1eecHJnk2g';
const onPrem = false; // or true if on-premise
const tz = 'UTC'; // or 'ICT', etc.

const deviceAccess = new DeviceAccess(backendUrl, accessToken, onPrem, tz);

async function runTest() {
  const devID = 'DS_TEST_DATA_POSTING';
  const sensor = 'APR';
  const limit = 5;
  const startTime = '2024-11-19T07:39:00.000Z';
  const endTime = '2024-11-20T07:37:00.000Z';

  const limitedData = await deviceAccess.getLimitedData(devID, sensor, limit);
  console.log('\n=== getLimitedData ===');
  console.dir(limitedData, { depth: 3 });

  const countResult = await deviceAccess.getDataCount(devID, sensor, startTime, endTime);
  console.log('\n=== getDataCount ===');
  console.dir(countResult, { depth: 3 });
}

runTest().catch((err) => {
  console.error('Test failed:', err);
}); 