## BruceHandler Module

Modular insights API access using an orchestrator + focused handlers. The orchestrator composes handlers and shares common HTTP utilities via `BruceHandlerBase`.

### Files and Responsibilities

- `BruceHandler.ts`
  - **Class**: `BruceHandler`
  - **Public APIs**:
    - `fetchUserInsights(options)`
    - `fetchSourceInsight(options)`
    - `updateSingleUserInsight(options)`
    - `addUserInsight(options)`
    - `fetchInsightResult(options)`
  - **Purpose**: Orchestrator delegating to handler classes.

- `base.ts`
  - **Class**: `BruceHandlerBase`
  - **Public APIs**:
    - `formatUrl(template, onPrem?)`
    - `requestWithRetry(url, headers)`
    - `putWithRetry(url, payload, headers)`
    - `postWithRetry(url, payload, headers)`
    - `getAccessToken()`, `getDataUrl()`, `isOnPrem()`, `getTimezone()`
  - **Purpose**: Shared configuration and HTTP helpers with retry logic.

- `userInsights.ts`
  - **Class**: `UserInsightsHandler`
  - **Public APIs**: `fetchUserInsights(options)`
  - **Purpose**: Fetch paginated user insights with filters and population options.

- `sourceInsights.ts`
  - **Class**: `SourceInsightsHandler`
  - **Public APIs**: `fetchSourceInsight(options)`
  - **Purpose**: Fetch source insight metadata by insight ID.

- `userInsightManagement.ts`
  - **Class**: `UserInsightManagementHandler`
  - **Public APIs**: `updateSingleUserInsight(options)`, `addUserInsight(options)`
  - **Purpose**: Create and update user insights.

- `insightResults.ts`
  - **Class**: `InsightResultsHandler`
  - **Public APIs**: `fetchInsightResult(options)`
  - **Purpose**: Fetch paginated insight results for an insight.

- `types.ts`
  - **Exports**: All request/response interfaces used across handlers (e.g., pagination options, insight payloads, etc.).
  - **Purpose**: Centralized type safety for the module.

- `index.ts`
  - **Exports**: `BruceHandler`, `BruceHandlerBase`, all handlers, and all types.
  - **Purpose**: Public entry point for consumers.