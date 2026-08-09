# City Administration Information System (CAIS)

Welcome to the enterprise repository for the City Administration Information System (CAIS). 
CAIS is a high-availability RESTful API architecture explicitly engineered to facilitate government sector administration, public engagement, immutable telemetry tracking, and broad-scale data distribution.

## 🏗️ Architecture

CAIS strictly follows a **Layered MVC Pattern** (Model-View-Controller) emphasizing decoupling.
- **Controllers** are kept thin, acting strictly as HTTP bridges.
- **Services** orchestrate all domain and business rules.
- **Models** maintain pure, injection-resistant SQL prepared statements pushing aggregation workloads entirely to the MySQL 8 engine.

## 🧰 Technology Stack
- **Runtime**: Node.js v18 LTS
- **Framework**: Express.js
- **Database**: MySQL 8.0 (MySQL2 Promise Pool)
- **Security**: JWT, Helmet, Joi Validation, PM2 Clustering
- **Documentation**: OpenAPI 3.0 (Swagger)
- **Deployment**: Docker, Docker Compose, NGINX

## 🚀 Installation & Environment Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd cais
   ```
2. **Install exact dependencies:**
   ```bash
   npm ci
   ```
3. **Configure Environment:**
   Copy the example environment matrix.
   ```bash
   cp .env.example .env
   ```
   *Edit the `.env` file to match your local database credentials.*

## 🗄️ Database Setup
Make sure you have a running instance of MySQL 8.0.
Create the target database (as defined in `.env` `DB_NAME`).
*(Table migrations are expected to be injected or run separately depending on your environment strategy).*

## 🏃‍♂️ Running the System

### Development Mode
Uses `nodemon` to hot-reload code changes.
```bash
npm run dev
```

### Production Mode
Executes the native cluster script or Docker lifecycle.
```bash
npm start
```
*For true production, follow the `DEPLOYMENT_GUIDE.md`.*

## 📖 API Documentation (Swagger)
Once the server is running, the OpenAPI UI acts as your central interaction hub.
1. Navigate to: `http://localhost:3000/api-docs`
2. All inputs, responses, parameters, and payloads are strictly documented.

## 📮 Postman Collection
A pre-configured, dynamic Postman Collection (`docs/postman_collection.json`) handles extensive local API testing.
- Uses environment variables `{{baseUrl}}` and `{{token}}`.
- Automatically assigns login tokens securely via Postman Tests scripts.

## 🛡️ Security Features
- **Stateless IAM**: JWT Bearer verification prevents session hijacking.
- **Role-Based Access Control**: Hardcoded scoping restricting `SuperAdmin`, `DepartmentAdmin`, and `Public` traffic dynamically.
- **Immutability**: Audit logs cannot be modified, enforcing chain of custody.
- **Header Hardening**: XSS protection, MIME sniffing protection, and rate limiting implemented via NGINX & Helmet.

## 🚢 Deployment
For Docker, NGINX, and Linux deployment environments, reference the enclosed `DEPLOYMENT_GUIDE.md`.
