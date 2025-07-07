# API-Documentation

A TypeScript-first, ESM-ready connector library for accessing and documenting IoT platform APIs, including device, user, login, and pub/sub utilities. Designed for robust backend integrations, full type safety, and modern Node.js workflows.

---

## 🚀 Installation

Install dependencies after cloning:

```bash
npm install
```

---

## 📋 Requirements

- Node.js 18+
- TypeScript 4.5+
- Modern ESM support (set `"type": "module"` in `package.json`)

---

## 📦 Project Structure

```
API-Documentation/
├── src/                # Main TypeScript source code
│   └── connectors/     # Device, user, login, pubsub connectors
│   └── pubsub/         # Pub/Sub utilities (Mongo, Redis, RMQ, MQTT)
│   └── index.ts        # Main entry point
|   └── utils/          # API endpoint constants
├── test/               # Example/test scripts
├── .eslintrc.json      # ESLint config
├── .prettierrc         # Prettier config
├── tsconfig.json       # TypeScript config
├── package.json
└── README.md
```

---

## 🔧 Usage

### Basic Device Access Example

```typescript
import { DeviceAccess } from './src/connectors/DeviceAccess.js';

const deviceAccess = new DeviceAccess('your-backend-url', 'your-access-token', false);
const devices = await deviceAccess.getAllDevices({ origin: 'https://iosense.io' });
console.log(devices);
```

### Load Entities Example

```typescript
const entities = await deviceAccess.loadEntitiesGen();
console.log(entities);

const entity = await deviceAccess.loadEntitiesGenById('entity_id');
console.log(entity);
```

See the `test/` folder for runnable examples of each API function.

---

## 📚 API Reference

### Main Classes
- **DeviceAccess**: Device and entity API methods
- **UserAccess**: User profile and quota API
- **LoginManager**: Login/authentication API
- **Pub/Sub Utilities**: MongoCRUD, RedisCRUD, RMQHandler, MqttConnector

### Example Methods
- `getAllDevices(extraHeaders?)`: List all devices
- `getDeviceData(deviceId, extraHeaders?)`: Get device data
- `loadEntitiesGen(extraHeaders?)`: List all entities (clusters/groups)
- `loadEntitiesGenById(id, extraHeaders?)`: Get a single entity by ID
- `userdetails(extraHeaders?)`: Get user details
- `login(...)`: Authenticate and get tokens

All methods are fully typed and documented in the source code.

---

## 🧪 Testing

Run a test file with ts-node (ESM):

```bash
node --loader ts-node/esm test/test_devices.ts 
```

---

## 🧹 Linting & Formatting

- Lint your code:
  ```bash
  npx eslint .
  ```
- Format your code:
  ```bash
  npx prettier --write .
  ```

---

## 🤝 Contributing

1. Fork the repository and create a feature branch.
2. Add or update code and tests.
3. Run lint and tests before submitting a PR.

---

## 📄 License

MIT License