## DeviceAccess Module

Modular device API access using an orchestrator + focused handlers. The orchestrator composes handlers (composition over inheritance) and shares common HTTP utilities via `DeviceAccessBase`.

### Files and Responsibilities

- `DeviceAccess.ts`
  - **Class**: `DeviceAccess`
  - **Public APIs**:
    - `getAllDevicesPaginated(options)`
    - `getDeviceData(options)`
    - `getDeviceByDevID(options)`
    - `getLastDataPoints(extraHeaders)`
    - `getLastDP(options)`
    - `getLimitedData(options)`
    - `getDataCount(options)`
    - `loadEntitiesGen(options)`
    - `loadEntitiesGenById(options)`
    - `loadEntitiesGenPaginated(options)`
    - `getMonthlyConsumption(options)`
    - `getDataByTimeRange(options)`
    - `getDataByTimeRangeWithCalibration(options)`
    - `getDataByStEt(options)`
  - **Purpose**: Orchestrator delegating to handler classes.

- `base.ts`
  - **Class**: `DeviceAccessBase`
  - **Public APIs**:
    - `formatUrl(template, onPrem?)`
    - `createHeaders(extraHeaders?)`
    - `requestWithRetry(url, headers)`
    - `postWithRetry(url, payload, headers)`
    - `putWithRetry(url, payload, headers)`
    - `timeToUnix(time)`
    - `getAccessToken()`, `getDataUrl()`, `isOnPrem()`, `getTimezone()`
  - **Purpose**: Shared configuration and HTTP helpers with retry logic.

- `deviceList.ts`
  - **Class**: `DeviceListHandler`
  - **Public APIs**: `getAllDevicesPaginated(options)`
  - **Purpose**: List/search devices with pagination, filters, and sorting.

- `deviceInfo.ts`
  - **Class**: `DeviceInfoHandler`
  - **Public APIs**: `getDeviceData(options)`, `getDeviceByDevID(options)`
  - **Purpose**: Fetch device configuration and details.

- `deviceData.ts`
  - **Class**: `DeviceDataHandler`
  - **Public APIs**: `getLastDataPoints(extraHeaders)`, `getLastDP(options)`, `getLimitedData(options)`, `getDataCount(options)`
  - **Purpose**: Recent and limited time-series data utilities.

- `deviceTimeData.ts`
  - **Class**: `DeviceTimeDataHandler`
  - **Public APIs**: `getDataByTimeRange(options)`, `getDataByTimeRangeWithCalibration(options)`, `getDataByStEt(options)`
  - **Purpose**: Time-windowed data retrieval with calibration and StEt endpoints.

- `deviceEntities.ts`
  - **Class**: `DeviceEntitiesHandler`
  - **Public APIs**: `loadEntitiesGen(options)`, `loadEntitiesGenById(options)`, `loadEntitiesGenPaginated(options)`
  - **Purpose**: Entity metadata and pagination.

- `deviceConsumption.ts`
  - **Class**: `DeviceConsumptionHandler`
  - **Public APIs**: `getMonthlyConsumption(options)`
  - **Purpose**: Monthly consumption analytics based on first/last readings per month.

- `types.ts`
  - **Exports**: All request/response interfaces used across handlers (e.g., `GetAllDevicesPaginatedOptions`, `GetDeviceDataOptions`, `GetDataByTimeRangeOptions`, etc.).
  - **Purpose**: Centralized type safety for the module.

- `index.ts`
  - **Exports**: `DeviceAccess`, `DeviceAccessBase`, all handlers, and all types.
  - **Purpose**: Public entry point for consumers.