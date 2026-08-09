# CAIS Quality Assurance (QA) & Testing Guide

This comprehensive guide outlines the methodologies required to rigorously test the CAIS API endpoints before authorizing a production deployment.

## 1. Manual Swagger Testing

The Swagger interface provides a point-and-click staging environment natively.
- **Access:** Open `http://localhost:3000/api-docs`
- **Authentication:** 
  1. Trigger `POST /auth/login` to retrieve your JWT token.
  2. Copy the token string.
  3. Scroll to the top and click the green **Authorize** button. Paste the token.
- **Objective:** Every subsequent request initiated through Swagger will automatically inject the Bearer token. Navigate through every module (Sectors, Messages) and click "Execute" to validate the DB connections.

## 2. Postman Suite Automation

Postman is heavily configured to evaluate complex Request/Response mapping.
- **Import:** Import `docs/postman_collection.json`.
- **Dynamic Flows:** Ensure your environment variable `{{baseUrl}}` is active. Click `Send` on the `Admin Login` route. Postman scripts will intercept the JWT payload and lock it into the `{{token}}` variable automatically.
- **CRUD Check:** Execute the `Sectors -> Create Sector` route. Then, execute `Get Paginated Sectors`. Verify that the newly created record is appended correctly.

## 3. Strict Boundary Testing (RBAC & Auth)

- **401 Unauthorized Checking**: Strip the token out of your header (or remove it from Postman). Call `GET /dashboard`. Assert that the system bounces the request cleanly with a JSON Error.
- **403 Forbidden Checking**: Issue a token linked to a `DepartmentAdmin` profile. Attempt to call `DELETE /audit-logs/1`. Assert that the middleware blocks the execution before database logic is evaluated.

## 4. File Upload (Multer) Edge Cases

- **MIME Tricking**: Attempt to upload a `.txt` file disguised as `logo.png` to `PATCH /city-information/logo`. Assert that the `verifyImageContent` utility scans the magic numbers and rejects the upload.
- **Volume Checks**: Test uploading a 6MB file. The Nginx reverse proxy should throw a `413 Request Entity Too Large` error, or Multer will intercept if run natively.

## 5. Security & Rate Limit Testing

- **Spam Mitigation**: Use Apache Benchmark (`ab`) or rapid Postman clicks to fire 20 requests rapidly to `POST /contact-messages`. Ensure the API traps the sender into a HTTP 429 Rate Limiting cooldown block.
- **Audit Logging**: Confirm Immutability. Trigger a sequence of edits to a Sector. Then, log in as `SuperAdmin`, query `/audit-logs`, and manually verify every modification correctly populated an un-tampered audit ledger row.

## 6. Performance Validation

- Monitor the cluster utilizing `pm2 monit` or `docker stats`.
- Dispatch the `/dashboard` route. Assert that the Node application memory does not balloon excessively (verifying that native SQL aggregation `SUM/COUNT` rules are properly circumventing array heap population).
