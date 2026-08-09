# City Administration Information System (CAIS) - API Documentation

Welcome to the enterprise RESTful API documentation for CAIS. This platform manages core city administration workflows including sector administration, public engagement (contact messages), administrative analytics (dashboard), and immutable audit logs.

## 🚀 Getting Started

### 1. Installation
Ensure you are running Node.js (v18+) and MySQL (v8.0+).
```bash
# Clone the repository and install dependencies
npm install
```

### 2. Starting the Server
The application relies on environmental variables. Ensure your `.env` file is configured with the correct `DB_HOST`, `JWT_SECRET`, and port values.
```bash
# Run in development mode (with nodemon)
npm run dev

# Run in production mode
npm start
```

### 3. Opening Swagger (OpenAPI 3.0)
The API uses `swagger-ui-express` combined with a strict `openapi.yaml` configuration to provide interactive, visual API documentation.
1. Start the server.
2. Navigate to: **`http://localhost:3000/api-docs`**
3. Use the visual interface to execute endpoints directly from your browser.

### 4. Importing the Postman Collection
For heavy Quality Assurance (QA) and integration testing, a fully pre-configured Postman Collection is provided.
1. Open Postman.
2. Click **Import** (top left).
3. Select the file: `docs/postman_collection.json`.
4. Open the collection settings and set the `baseUrl` variable to your local or remote server.

---

## 🔐 Security & Access Control

### Authentication Workflow
CAIS utilizes **JWT Bearer Authentication**.
1. Call `POST /api/v1/auth/login` with your administrator credentials.
2. The response will yield a `token` inside the `data` object.
3. Attach this token to all subsequent protected endpoints using the HTTP header:
   `Authorization: Bearer <your_token>`
*Note: Our Postman collection automatically intercepts the login response and binds the token globally.*

### Role Hierarchy (RBAC)
Endpoints are heavily guarded by the `authorize()` middleware.
- **SuperAdmin**: Maximum authority. Can create other admins, permanently delete audit logs, and override sector states.
- **DepartmentAdmin**: Operational authority. Can manage messages, edit assigned sectors, and view analytics. Cannot delete audit logs.
- **Public**: Zero authentication required. Can only view active sectors, submit contact messages, and read city information.

---

## 🧪 Testing Workflow & QA

To execute QA validation, adhere to the following sequence:

1. **System Check**: Fire `GET /api/v1/health` (Unauthenticated) to ensure the Node instance is alive.
2. **Identity Issuance**: Fire `POST /api/v1/auth/login` to obtain a SuperAdmin token.
3. **Write Operations**: Create a Sector (`POST /api/v1/sectors`). Confirm a `201 Created` response.
4. **Audit Validation**: Fire `GET /api/v1/audit-logs`. Confirm that the `CREATE_SECTOR` action was immutably recorded by the background audit orchestrator.
5. **Unauthorized Rejection**: Remove the Bearer token and attempt to fetch the Dashboard (`GET /api/v1/dashboard`). Confirm a `401 Unauthorized` response via the standard `ApiError` format.

---
*Built to strict government standards for performance, security, and scalability.*
