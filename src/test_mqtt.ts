import { MqttConnector } from './pubsub/mqttHandler.js';

/**
 * Test script for MQTT Connector
 * 
 * This script demonstrates how to use the MqttConnector class with access token authentication.
 * It shows how to connect to an MQTT broker, publish device data, and subscribe to topics.
 */

async function testMqttConnector() {
  // Configuration - replace with your actual values
  const brokerUrl = 'mqtt.iosense.io';
  const accessToken = 'your_access_token_here';
  const onPrem = false; // Set to true for on-premise deployment

  try {
    // Create MQTT connector instance
    console.log('Creating MQTT connector...');
    const mqttConnector = new MqttConnector(brokerUrl, accessToken, onPrem);

    // Connect to MQTT broker
    console.log('Connecting to MQTT broker...');
    await mqttConnector.connect();
    console.log('Successfully connected to MQTT broker');

    // Test publishing device data
    console.log('\n--- Testing Device Data Publishing ---');
    const deviceId = 'test-device-001';
    const deviceData = [
      { tag: 'temperature', value: '25.5' },
      { tag: 'humidity', value: '60.2' },
      { tag: 'pressure', value: '1013.25' }
    ];

    await mqttConnector.publishDeviceData(deviceId, deviceData);
    console.log(`Published device data for device: ${deviceId}`);

    // Test publishing custom message
    console.log('\n--- Testing Custom Message Publishing ---');
    const customTopic = 'custom/test/topic';
    const customMessage = {
      message: 'Hello from MQTT connector',
      timestamp: Date.now(),
      source: 'test-script'
    };

    await mqttConnector.publish(customTopic, customMessage);
    console.log(`Published custom message to topic: ${customTopic}`);

    // Test subscribing to device data
    console.log('\n--- Testing Device Data Subscription ---');
    await mqttConnector.subscribeToDeviceData(deviceId, (deviceData) => {
      console.log('Received device data:', JSON.stringify(deviceData, null, 2));
    });

    // Test subscribing to all devices
    console.log('\n--- Testing All Devices Subscription ---');
    await mqttConnector.subscribeToAllDevices((deviceId, deviceData) => {
      console.log(`Received data from device ${deviceId}:`, JSON.stringify(deviceData, null, 2));
    });

    // Test custom topic subscription
    console.log('\n--- Testing Custom Topic Subscription ---');
    await mqttConnector.subscribe('custom/+/topic', (topic, message) => {
      console.log(`Received message on topic ${topic}:`, JSON.stringify(message, null, 2));
    });

    // Keep the connection alive for a while to receive messages
    console.log('\n--- Keeping connection alive for 30 seconds to receive messages ---');
    console.log('Press Ctrl+C to exit...');
    
    setTimeout(async () => {
      console.log('\n--- Closing MQTT connection ---');
      await mqttConnector.close();
      console.log('MQTT connection closed successfully');
      process.exit(0);
    }, 30000);

  } catch (error) {
    console.error('Error in MQTT test:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  process.exit(0);
});

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  testMqttConnector();
} 