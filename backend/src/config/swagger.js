const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const path = require('path');

/**
 * Initializes and configures Swagger UI using swagger-jsdoc.
 * Combines the static YAML definition with dynamic routing.
 * @param {import('express').Application} app - The Express application instance.
 */
const setupSwagger = (app) => {
    const options = {
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'City Administration Information System (CAIS) API',
                version: '1.0.0',
                description: 'Enterprise RESTful API for managing city administration, sectors, public engagement, and systemic analytics.',
                contact: {
                    name: 'Government IT Support',
                    email: 'support@cais-gov.local'
                },
            },
            servers: [
                {
                    url: '/api/v1',
                    description: 'Development Server (v1)'
                },
                {
                    url: 'https://api.cais.gov/v1',
                    description: 'Production Server (v1)'
                }
            ],
            // Ensures security definitions apply globally to all routes unless overridden
            security: [
                {
                    bearerAuth: []
                }
            ]
        },
        // Injects the centralized OpenAPI specification document
        apis: [path.join(__dirname, '../../docs/openapi.yaml')],
    };

    const swaggerSpec = swaggerJsdoc(options);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
        customSiteTitle: "CAIS API Documentation",
        customCss: '.swagger-ui .topbar { display: none }', // Cleaner UI for government portals
        swaggerOptions: {
            persistAuthorization: true, // Prevents losing token on refresh
            displayRequestDuration: true,
        }
    }));
};

module.exports = setupSwagger;
