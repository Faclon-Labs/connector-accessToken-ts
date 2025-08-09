## UserAccess Module

Modular user API access using an orchestrator + focused handlers. The orchestrator composes handlers and shares common HTTP utilities via `UserAccessBase`.

### Files and Responsibilities

- `UserAccess.ts`
  - **Class**: `UserAccess`
  - **Public APIs**:
    - `getUserDetails(extraHeaders?)`
    - `getUserQuota(extraHeaders?)`
    - `getUserEntities(extraHeaders?)`
    - `getUserEntityFetch(extraHeaders?)`
    - `userdetails(extraHeaders?)` (deprecated alias)
  - **Purpose**: Orchestrator delegating to handler classes.

- `base.ts`
  - **Class**: `UserAccessBase`
  - **Public APIs**:
    - `formatUrl(template, onPrem?)`
    - `createHeaders(extraHeaders?)`
    - `requestWithRetry(url, headers)`
    - `getAccessToken()`, `getDataUrl()`, `isOnPrem()`, `getTimezone()`
  - **Purpose**: Shared configuration and HTTP helpers with retry logic.

- `userDetails.ts`
  - **Class**: `UserDetailsHandler`
  - **Public APIs**: `getUserDetails(extraHeaders?)`
  - **Purpose**: Fetch authenticated user's profile details.

- `userQuota.ts`
  - **Class**: `UserQuotaHandler`
  - **Public APIs**: `getUserQuota(extraHeaders?)`
  - **Purpose**: Retrieve quota credits and usage for the user.

- `userEntities.ts`
  - **Class**: `UserEntitiesHandler`
  - **Public APIs**: `getUserEntities(extraHeaders?)`, `getUserEntityFetch(extraHeaders?)`
  - **Purpose**: Fetch user routes/entities and full entity structure.

- `types.ts`
  - **Exports**: All request/response interfaces used across handlers (e.g., `UserDetailsResponse`, `UserQuotaResponse`, `UserEntitiesResponse`, etc.).
  - **Purpose**: Centralized type safety for the module.

- `index.ts`
  - **Exports**: `UserAccess`, `UserAccessBase`, all handlers, and all types.
  - **Purpose**: Public entry point for consumers.