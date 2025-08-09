# IOSense SDK

[![npm version](https://badge.fury.io/js/iosense-sdk.svg)](https://badge.fury.io/js/iosense-sdk)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The official TypeScript SDK for IOSense platform APIs, providing seamless access to device management, user operations, authentication, and multi-protocol pub/sub messaging systems.

## ✨ Features

- 🔐 **Authentication & User Management** - Complete login flow with token management
- 📱 **Device Operations** - Full CRUD operations for IoT devices with real-time data access
- 📊 **Data Analytics** - Time-series data retrieval, aggregation, and insights management
- 🔄 **Multi-Protocol PubSub** - Support for Kafka, MQTT, RabbitMQ, Redis, PostgreSQL, MongoDB
- 📝 **Full Type Safety** - 40+ TypeScript interfaces for robust development
- ⚡ **Modern ESM** - ES modules with Node.js 18+ support
- 🔄 **Built-in Retry Logic** - Automatic retry mechanisms for resilient operations
- 📄 **Pagination Support** - Efficient handling of large datasets

## 🚀 Quick Start

### Installation

```bash
npm install iosense-sdk
```

### Platform Support

Choose the right import for your environment:

```typescript
// Universal (recommended) - works everywhere
import { login, DeviceAccess, UserAccess } from 'iosense-sdk';

// Browser only (no PubSub)
import { login, DeviceAccess, UserAccess } from 'iosense-sdk/browser';

// Node.js (full features)
import { login, DeviceAccess, UserAccess, MqttConnector } from 'iosense-sdk/node';

// Core features only
import { login, DeviceAccess, UserAccess } from 'iosense-sdk/core';
```

### Basic Usage

```typescript
import { login, DeviceAccess, UserAccess } from 'iosense-sdk';

// 1. Authenticate (now with defaults!)
const loginResponse = await login({
  username: 'user@example.com',
  password: 'securepassword123'
  // dataUrl defaults to 'connector.iosense.io'
  // organisation defaults to 'https://iosense.io' 
  // origin defaults to 'https://iosense.io'
});

// 2. Initialize connectors
const deviceAccess = new DeviceAccess(
  'connector.iosense.io', 
  loginResponse.authorization, 
  false
);

// 3. Fetch devices
const devices = await deviceAccess.getAllDevicesPaginated({
  skip: 1,
  limit: 50
});

console.log(`Found ${devices.data.totalCount} devices`);
```

## 📚 API Reference

### 🔐 Authentication

```typescript
import { login } from 'iosense-sdk';

const response = await login({
  username: 'user@example.com',
  password: 'securepassword123',
  dataUrl: 'connector.iosense.io',
  organisation: 'https://iosense.io',
  origin: 'https://iosense.io'
});

// Access tokens
const { authorization, refresh_token, ifToken } = response;
```

### 📱 Device Management

```typescript
import { DeviceAccess } from 'iosense-sdk';

const deviceAccess = new DeviceAccess('connector.iosense.io', accessToken, false);

// Get all devices with pagination
const devices = await deviceAccess.getAllDevicesPaginated({
  skip: 1,
  limit: 20,
  extraHeaders: { origin: 'https://iosense.io' }
});

// Get specific device data
const deviceData = await deviceAccess.getDeviceData({
  deviceId: 'device-id',
  extraHeaders: { origin: 'https://iosense.io' }
});

// Get time-series data (multiple options available)
const timeRangeData = await deviceAccess.getDataByTimeRange({
  devID: 'device-id',
  sensor: 'arduino', // optional, defaults to 'arduino'
  startTime: new Date('2024-01-01'),
  endTime: new Date('2024-01-31'),
  downSample: 1,
  extraHeaders: { origin: 'https://iosense.io' }
});

// Or calibrated time-series
const calibratedData = await deviceAccess.getDataByTimeRangeWithCalibration({
  devID: 'device-id',
  sensor: 'TOTAL',
  startTime: '2024-01-01T00:00:00Z',
  endTime: '2024-01-31T23:59:59Z',
  calibration: true
});

// Or by start/end timestamps (with optional cursor)
const stetData = await deviceAccess.getDataByStEt({
  devID: 'device-id',
  startTime: 1704067200, // seconds or Date/string also supported
  endTime: 1706659200,
  cursor: false
});

// Entity management
const entities = await deviceAccess.loadEntitiesGen();
const entity = await deviceAccess.loadEntitiesGenById({ id: 'entity-id' });
```

### 👤 User Operations

```typescript
import { UserAccess } from 'iosense-sdk';

const userAccess = new UserAccess('connector.iosense.io', accessToken, false);

// Get user profile
const userDetails = await userAccess.getUserDetails({
  origin: 'https://iosense.io',
  organisation: 'https://iosense.io'
});

// Check user quota
const quota = await userAccess.getUserQuota({
  origin: 'https://iosense.io'
});

// Get user entities
const userEntities = await userAccess.getUserEntities({
  origin: 'https://iosense.io'
});
```

### 💡 Insights Management

```typescript
import { BruceHandler } from 'iosense-sdk';

const bruceHandler = new BruceHandler('connector.iosense.io', accessToken, false);

// Fetch user insights
const insights = await bruceHandler.fetchUserInsights({
  pagination: { page: 1, count: 10 },
  populate: ['sourceInsightID'],
  extraHeaders: { origin: 'https://iosense.io' }
});

// Add new insight
const newInsight = await bruceHandler.addUserInsight({
  insightName: 'Energy Efficiency Report',
  source: 'analytics',
  userTags: ['energy', 'efficiency']
});
```

> Note: DeviceAccess, UserAccess, and BruceHandler have been refactored internally into modular handlers with a shared base. Public APIs remain simple and are accessed via the orchestrator classes above.

## 🔄 PubSub Connectors

### MQTT (IoT Device Communication)

```typescript
import { MqttConnector } from 'iosense-sdk';

const mqtt = new MqttConnector({
  brokerUrl: 'mqtt://connector.iosense.io',
  port: 1883,
  username: 'mqtt-user',
  password: 'mqtt-pass'
});

await mqtt.connect();

// Subscribe to device data
await mqtt.subscribeToDeviceData('device-123', (deviceData) => {
  console.log('Received data:', deviceData);
});

// Publish device data
await mqtt.publishDeviceData('device-123', {
  deviceId: 'device-123',
  timestamp: Date.now(),
  data: [
    { tag: 'temperature', value: 23.5 },
    { tag: 'humidity', value: 65.2 }
  ]
});
```

### Redis (Caching & Fast Storage)

```typescript
import { RedisCRUD } from 'iosense-sdk';

const redis = new RedisCRUD({
  uri: 'redis://localhost:6379'
});

await redis.connect();

// Cache device data
await redis.set('devices:latest', devices, 300); // 5 minutes TTL

// Retrieve cached data
const cachedDevices = await redis.get<Device[]>('devices:latest');

// Update cache
await redis.update('device:123', { lastSeen: new Date().toISOString() });
```

### Kafka (Event Streaming)

```typescript
import { KafkaHandler } from 'iosense-sdk';

const kafka = new KafkaHandler({
  clientId: 'iot-app',
  brokers: ['kafka1:9092', 'kafka2:9092'],
  groupId: 'device-processors'
});

// Produce events
await kafka.produce('device-events', [{
  key: 'device-123',
  value: JSON.stringify({
    deviceId: 'device-123',
    event: 'status_change',
    data: { status: 'online' }
  })
}]);

// Consume events
await kafka.consume('device-events', async (message) => {
  const event = JSON.parse(message.value.toString());
  console.log('Processing event:', event);
});
```

### PostgreSQL (Persistent Storage)

```typescript
import { PostgresCRUD } from 'iosense-sdk';

const postgres = new PostgresCRUD({
  host: 'localhost',
  database: 'iot_platform',
  user: 'postgres',
  password: 'password',
  port: 5432
});

await postgres.connect();

// Store device readings
await postgres.create('device_readings', {
  device_id: 'device-123',
  temperature: 23.5,
  humidity: 65.2,
  timestamp: new Date()
});

// Query historical data
const readings = await postgres.read('device_readings', 
  'device_id = $1 AND timestamp > $2',
  ['device-123', new Date('2024-01-01')]
);
```

## 🏗️ Integration Patterns

### Complete IOSense Data Pipeline

```typescript
import { 
  login, 
  DeviceAccess, 
  UserAccess,
  BruceHandler,
  MqttConnector, 
  RedisCRUD, 
  PostgresCRUD,
  KafkaHandler 
} from 'iosense-sdk';

class IOSenseDataPipeline {
  private deviceAccess: DeviceAccess;
  private userAccess: UserAccess;
  private bruceHandler: BruceHandler;
  private mqtt: MqttConnector;
  private redis: RedisCRUD;
  private postgres: PostgresCRUD;
  private kafka: KafkaHandler;

  async initialize() {
    // Authenticate with IOSense platform
    const auth = await login({
      username: 'your-username@company.com',
      password: 'your-secure-password',
      dataUrl: 'connector.iosense.io',
      organisation: 'https://iosense.io',
      origin: 'https://iosense.io'
    });
    
    // Initialize all IOSense connectors
    this.deviceAccess = new DeviceAccess('connector.iosense.io', auth.authorization, false);
    this.userAccess = new UserAccess('connector.iosense.io', auth.authorization, false);
    this.bruceHandler = new BruceHandler('connector.iosense.io', auth.authorization, false);
    
    // Initialize PubSub connectors
    this.mqtt = new MqttConnector({ 
      brokerUrl: 'mqtt://connector.iosense.io',
      port: 1883
    });
    this.redis = new RedisCRUD({ uri: 'redis://localhost:6379' });
    this.postgres = new PostgresCRUD({ 
      host: 'localhost', 
      database: 'iosense_data',
      user: 'iosense_user',
      password: 'your_db_password'
    });
    this.kafka = new KafkaHandler({ 
      clientId: 'iosense-pipeline',
      brokers: ['localhost:9092']
    });

    // Connect all services
    await Promise.all([
      this.mqtt.connect(),
      this.redis.connect(),
      this.postgres.connect()
    ]);
  }

  async processDeviceData() {
    // Fetch all devices from IOSense
    const devicesResponse = await this.deviceAccess.getAllDevicesPaginated({
      skip: 1,
      limit: 100,
      extraHeaders: { 
        origin: 'https://iosense.io',
        organisation: 'https://iosense.io' 
      }
    });

    if (devicesResponse.success) {
      console.log(`Processing ${devicesResponse.data.totalCount} IOSense devices`);
      
      // Subscribe to real-time data for each device
      for (const device of devicesResponse.data.devices) {
        await this.mqtt.subscribeToDeviceData(device._id, async (deviceData) => {
          // Cache latest reading in Redis
          await this.redis.set(`iosense:latest:${deviceData.deviceId}`, deviceData, 300);
          
          // Store historical data in PostgreSQL
          await this.postgres.create('iosense_readings', {
            device_id: deviceData.deviceId,
            device_name: device.deviceName,
            location: device.location,
            data: deviceData.data,
            timestamp: new Date(deviceData.timestamp),
            organization: 'iosense'
          });
          
          // Stream to analytics pipeline
          await this.kafka.produce('iosense-device-analytics', [{
            key: deviceData.deviceId,
            value: JSON.stringify({
              ...deviceData,
              deviceName: device.deviceName,
              organization: 'iosense'
            })
          }]);
        });
      }
    }
  }

  async generateInsights() {
    // Fetch user insights from IOSense
    const insights = await this.bruceHandler.fetchUserInsights({
      pagination: { page: 1, count: 50 },
      extraHeaders: { 
        origin: 'https://iosense.io',
        organisation: 'https://iosense.io' 
      }
    });

    if (insights.success) {
      console.log(`Processing ${insights.data.length} IOSense insights`);
      
      // Process and store insights
      for (const insight of insights.data) {
        await this.postgres.create('iosense_insights', {
          insight_id: insight._id,
          insight_name: insight.insightName,
          source: insight.source,
          tags: insight.userTags,
          created_at: new Date(insight.createdAt),
          organization: 'iosense'
        });
      }
    }
  }
}

// Usage Example
const pipeline = new IOSenseDataPipeline();
await pipeline.initialize();
await pipeline.processDeviceData();
await pipeline.generateInsights();
```

### Real-time IOSense Dashboard

```typescript
import { DeviceAccess, UserAccess, RedisCRUD } from 'iosense-sdk';

class IOSenseDashboard {
  private deviceAccess: DeviceAccess;
  private userAccess: UserAccess;
  private redis: RedisCRUD;

  constructor(accessToken: string) {
    this.deviceAccess = new DeviceAccess('connector.iosense.io', accessToken, false);
    this.userAccess = new UserAccess('connector.iosense.io', accessToken, false);
    this.redis = new RedisCRUD({ uri: 'redis://localhost:6379' });
  }

  async getDashboardData() {
    const headers = {
      origin: 'https://iosense.io',
      organisation: 'https://iosense.io'
    };

    // Get user profile and quota
    const [userDetails, userQuota] = await Promise.all([
      this.userAccess.getUserDetails(headers),
      this.userAccess.getUserQuota(headers)
    ]);

    // Get device statistics
    const devicesResponse = await this.deviceAccess.getAllDevicesPaginated({
      skip: 1,
      limit: 1, // Just get count
      extraHeaders: headers
    });

    // Get cached latest readings
    const activeDevices = await this.redis.get('iosense:active_devices') || [];
    
    return {
      user: {
        name: `${userDetails.personalDetails.name.first} ${userDetails.personalDetails.name.last}`,
        email: userDetails.email,
        quota: userQuota
      },
      devices: {
        total: devicesResponse.data.totalCount,
        active: activeDevices.length,
        offline: devicesResponse.data.totalCount - activeDevices.length
      },
      lastUpdated: new Date().toISOString()
    };
  }
}
```

## 🔧 Configuration

### Environment Variables

```bash
# IOSense Platform Configuration
IOSENSE_DATA_URL=connector.iosense.io
IOSENSE_ORG_URL=https://iosense.io
IOSENSE_ORIGIN=https://iosense.io
IOSENSE_USERNAME=your-username@company.com
IOSENSE_PASSWORD=your-secure-password

# Database connections
POSTGRES_HOST=localhost
POSTGRES_DB=iosense_data
POSTGRES_USER=iosense_user
POSTGRES_PASS=your_db_password

REDIS_URL=redis://localhost:6379
MONGO_URL=mongodb://localhost:27017

# Message brokers  
KAFKA_BROKERS=localhost:9092
RABBITMQ_URL=amqp://localhost:5672
MQTT_BROKER=mqtt://connector.iosense.io:1883

# Optional: Custom headers for IOSense API
IOSENSE_CUSTOM_HEADERS={"x-api-version": "1.0", "x-client": "iosense-sdk"}
```

### IOSense-Specific Configuration

```typescript
// config/iosense.config.ts
export const IOSenseConfig = {
  platform: {
    dataUrl: process.env.IOSENSE_DATA_URL || 'connector.iosense.io',
    organisation: process.env.IOSENSE_ORG_URL || 'https://iosense.io',
    origin: process.env.IOSENSE_ORIGIN || 'https://iosense.io',
    onPrem: false // IOSense cloud platform
  },
  auth: {
    username: process.env.IOSENSE_USERNAME,
    password: process.env.IOSENSE_PASSWORD
  },
  defaults: {
    headers: {
      origin: 'https://iosense.io',
      organisation: 'https://iosense.io',
      'content-type': 'application/json'
    },
    pagination: {
      skip: 1,
      limit: 50
    },
    timeout: 30000 // 30 seconds
  }
};
```

## 📋 Requirements

- **Node.js** 18+
- **TypeScript** 4.5+
- **Modern ESM Support**

## 🔍 Error Handling

The library includes comprehensive error handling with automatic retries:

```typescript
try {
  const devices = await deviceAccess.getAllDevices();
} catch (error) {
  if (error.code === 'RATE_LIMIT') {
    // Automatic retry with exponential backoff
    console.log('Rate limited, retrying...');
  } else if (error.code === 'AUTH_FAILED') {
    // Re-authenticate
    console.log('Token expired, re-authenticating...');
  }
}
```

## 🎯 Real-world IOSense Use Cases

### Energy Management System
```typescript
import { DeviceAccess, login } from 'iosense-sdk';

class EnergyMonitor {
  private deviceAccess: DeviceAccess;

  async initialize() {
    const auth = await login({
      username: 'energy-manager@company.com',
      password: 'secure-password',
      dataUrl: 'connector.iosense.io',
      organisation: 'https://iosense.io',
      origin: 'https://iosense.io'
    });
    
    this.deviceAccess = new DeviceAccess('connector.iosense.io', auth.authorization, false);
  }

  async getEnergyConsumption(buildingId: string) {
    // Get monthly energy consumption for a building
    const consumption = await this.deviceAccess.getMonthlyConsumption({
      device: buildingId,
      sensor: 'energy',
      endTime: new Date('2024-12-31'),
      months: 12,
      extraHeaders: { 
        origin: 'https://iosense.io',
        organisation: 'https://iosense.io' 
      }
    });

    return consumption.data.map(item => ({
      month: item.month,
      totalConsumption: item.consumption,
      cost: item.consumption * 0.12, // $0.12 per kWh
      efficiency: this.calculateEfficiency(item.consumption)
    }));
  }
}
```

### Smart Building Management
```typescript
import { DeviceAccess, UserAccess, BruceHandler } from 'iosense-sdk';

class SmartBuildingController {
  private deviceAccess: DeviceAccess;
  private userAccess: UserAccess;
  private bruceHandler: BruceHandler;

  async getBuildingStatus() {
    const headers = { 
      origin: 'https://iosense.io',
      organisation: 'https://iosense.io' 
    };

    // Get all building devices
    const devices = await this.deviceAccess.getAllDevicesPaginated({
      skip: 1,
      limit: 100,
      extraHeaders: headers
    });

    // Get real-time data for critical systems
    const criticalSystems = ['hvac', 'security', 'lighting', 'energy'];
    const systemStatus: Record<string, any> = {};

    for (const system of criticalSystems) {
      const systemDevices = devices.data.devices.filter(d => 
        d.tags.includes(system)
      );
      
      systemStatus[system] = {
        devices: systemDevices.length,
        online: systemDevices.filter(d => d.status === 'active').length,
        alerts: systemDevices.filter(d => d.hasAlert).length
      };
    }

    return systemStatus;
  }
}
```

## 🧪 Testing

### Basic Testing
```bash
# Run all tests
npm test

# Run specific test suites
npm run test:devices
npm run test:users
npm run test:pubsub
```

### IOSense Integration Testing
```typescript
// test/iosense.integration.test.ts
import { login, DeviceAccess } from 'iosense-sdk';

describe('IOSense Integration', () => {
  let deviceAccess: DeviceAccess;

  beforeAll(async () => {
    const auth = await login({
      username: process.env.IOSENSE_TEST_USERNAME!,
      password: process.env.IOSENSE_TEST_PASSWORD!,
      dataUrl: 'connector.iosense.io',
      organisation: 'https://iosense.io',
      origin: 'https://iosense.io'
    });
    
    deviceAccess = new DeviceAccess('connector.iosense.io', auth.authorization, false);
  });

  test('should fetch devices successfully', async () => {
    const response = await deviceAccess.getAllDevicesPaginated({
      skip: 1,
      limit: 10,
      extraHeaders: { 
        origin: 'https://iosense.io',
        organisation: 'https://iosense.io' 
      }
    });

    expect(response.success).toBe(true);
    expect(response.data.devices).toBeDefined();
    expect(Array.isArray(response.data.devices)).toBe(true);
  });
});
```

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

- **Documentation**: [IOSense Documentation](https://docs.iosense.io)
- **Issues**: [GitHub Issues](https://github.com/Faclon-Labs/connector-accessToken-ts/issues)
- **Support**: [IOSense Support](https://support.iosense.io)

---

Built with ❤️ for the IOSense community