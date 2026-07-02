# Awesome Pizza API

A RESTful API for managing daily menu and pizza orders built with Express.js and TypeScript.

## Features

- **Daily Menu API**: Get the current pizza menu
- **Orders API**: Full CRUD operations for pizza orders
- **In-memory Database**: Fast development and testing
- **TypeScript**: Type-safe development
- **CORS Support**: Ready for frontend integration

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

### Scripts

- `npm run dev` - Start development server with hot reload
- `npm start` - Start production server
- `npm run build` - Build TypeScript to JavaScript

## API Documentation (Swagger / OpenAPI)

The API ships with a complete **OpenAPI 3.0** specification and an interactive
**Swagger UI** viewer so you can read the docs and execute every endpoint
directly from your browser — no Postman or curl required.

| File / Route | Purpose |
| --- | --- |
| `openapi.yaml` | The OpenAPI 3.0 spec (single source of truth) |
| `ui/swagger.html` | The Swagger UI viewer page |
| `GET /swagger.html` | Interactive docs served by the app |
| `GET /openapi.yaml` | The raw spec served by the app (for imports/tools) |

> **Note:** The viewer loads the Swagger UI assets from a public CDN
> (`cdn.jsdelivr.net`), so rendering the page requires an internet connection.
> The spec file itself is fully standalone and works offline in any editor.

### 1. Open the interactive docs

1. Start the server:
   ```bash
   npm start
   ```
   You should see:
   ```
   🍕 Awesome Pizza API server running on port 3000
   ```
2. Open **http://localhost:3000/swagger.html** in your browser.

You'll see all endpoints grouped by tag (**Daily Menu**, **Orders**, **Auth**),
each showing its parameters, request body schema, and every possible response
(200 / 201 / 400 / 401 / 403 / 404 / 500) with example payloads.

### 2. Execute an API request ("Try it out")

Swagger UI lets you send real requests to the running server:

1. Click a route (e.g. **`GET /api/daily-menu`**) to expand it.
2. Click the **Try it out** button (top-right of the expanded operation).
3. Fill in any **parameters** or edit the pre-filled **Request body** JSON.
4. Click the blue **Execute** button.
5. Scroll to **Responses** to inspect:
   - the exact **curl** command that was sent,
   - the **Request URL**,
   - the live **Response body**, **HTTP status code**, and **response headers**.

#### Example: create an order end-to-end

1. Expand **`POST /api/orders`** → **Try it out**.
2. Replace the request body with:
   ```json
   {
     "sender": "Alice Johnson",
     "contents": [
       { "name": "Margherita Pizza", "quantity": 2 },
       { "name": "BBQ Chicken Pizza", "quantity": 1 }
     ]
   }
   ```
3. Click **Execute**. You'll get a `201 Created` response containing the new
   order and its generated `id` (e.g. `order-1698123456789-123`).
4. Copy that `id`, expand **`GET /api/orders/{id}`** → **Try it out**, paste the
   `id` into the `id` field, and **Execute** to fetch the order you just created.
5. To advance it, use **`PUT /api/orders/{id}`** with a body like
   `{ "status": "DELIVERING" }`.

> The seeded orders `order-001`, `order-002`, and `order-003` are always
> available to try immediately after startup.

### 3. Call the protected & admin endpoints (Bearer token)

`GET /api/protected` and `GET /api/admin` require a **Bearer token**. The token
is a Base64-encoded JSON payload describing a role.

1. Click the green **Authorize** button at the top of the Swagger UI page.
2. In the **Value** field, paste the admin token (no `Bearer ` prefix needed —
   Swagger adds it automatically):
   ```
   eyJyb2xlIjoiYWRtaW4ifQ==
   ```
3. Click **Authorize**, then **Close**. A padlock icon now appears on the
   secured operations.
4. Expand **`GET /api/protected`** or **`GET /api/admin`** → **Try it out** →
   **Execute**. You should receive `200 OK`.

To generate your own token:
```bash
# role: admin  ->  eyJyb2xlIjoiYWRtaW4ifQ==
node -e "console.log(Buffer.from(JSON.stringify({ role: 'admin' })).toString('base64'))"
```
A non-admin token (e.g. `{ "role": "user" }`) will pass `/api/protected` only if
it equals the hardcoded token, and will return `403 Forbidden` from `/api/admin`.

### 4. Use the spec in other tools

The `openapi.yaml` spec is portable. You don't need this app running to view it:

- **Swagger Editor (online):** copy the contents of `openapi.yaml` into
  [editor.swagger.io](https://editor.swagger.io).
- **Postman / Insomnia:** *Import* → select `openapi.yaml` to auto-generate a
  collection of all requests.
- **VS Code:** install the *OpenAPI (Swagger) Editor* extension and open
  `openapi.yaml` for an inline preview.
- **Direct import from a running server:** point any tool at
  `http://localhost:3000/openapi.yaml`.

## API Endpoints

### Daily Menu

#### GET /api/daily-menu
Returns the current daily pizza menu.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "name": "Margherita Pizza",
      "description": "Classic pizza with fresh tomatoes, mozzarella cheese, and basil",
      "imageUrl": "https://example.com/margherita.jpg"
    }
  ],
  "message": "Daily menu retrieved successfully"
}
```

### Orders

#### GET /api/orders/:id
Get a specific order by ID.

**Parameters:**
- `id` (string) - Order ID

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-001",
    "name": "John Doe",
    "status": "RECEIVED",
    "contents": [
      {
        "name": "Margherita Pizza",
        "quantity": 2
      }
    ]
  },
  "message": "Order retrieved successfully"
}
```

#### POST /api/orders
Create a new order.

**Body:**
```json
{
  "name": "Customer Name",
  "contents": [
    {
      "name": "Pizza Name",
      "quantity": 2
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-1698123456789-123",
    "name": "Customer Name",
    "status": "RECEIVED",
    "contents": [
      {
        "name": "Pizza Name",
        "quantity": 2
      }
    ]
  },
  "message": "Order created successfully"
}
```

#### PUT /api/orders/:id
Update an existing order.

**Parameters:**
- `id` (string) - Order ID

**Body (all fields optional):**
```json
{
  "name": "Updated Customer Name",
  "status": "DELIVERING",
  "contents": [
    {
      "name": "Updated Pizza Name",
      "quantity": 3
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "order-001",
    "name": "Updated Customer Name",
    "status": "DELIVERING",
    "contents": [
      {
        "name": "Updated Pizza Name",
        "quantity": 3
      }
    ]
  },
  "message": "Order updated successfully"
}
```

## Data Models

### Menu Entry
```typescript
type menu_entry = {
    name: string,
    description: string,
    imageUrl: string
}
```

### Order
```typescript
type order = {
    id: string,
    name: string,
    status: 'RECEIVED' | 'DELIVERING' | 'DELIVERED' | 'CANCELED'
    contents: {
        name: string,
        quantity: number
    }[]
}
```

## Order Status

Orders have four possible statuses:
- `RECEIVED` - Order has been received and is being prepared
- `DELIVERING` - Order is out for delivery
- `DELIVERED` - Order has been successfully delivered
- `CANCELED` - Order has been canceled

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

## Development

The API uses an in-memory database for simplicity. Data will be reset when the server restarts. For production use, consider integrating with a persistent database like PostgreSQL or MongoDB.

## Testing the API

You can test the API using tools like:
- Postman
- curl
- Thunder Client (VS Code extension)
- Any HTTP client

Example curl commands:

```bash
# Get daily menu
curl http://localhost:3000/api/daily-menu

# Get order by ID
curl http://localhost:3000/api/orders/order-001

# Create new order
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Customer",
    "contents": [
      {"name": "Margherita Pizza", "quantity": 1}
    ]
  }'

# Update order status
curl -X PUT http://localhost:3000/api/orders/order-001 \
  -H "Content-Type: application/json" \
  -d '{"status": "DELIVERING"}'
```