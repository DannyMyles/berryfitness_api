import swaggerJsdoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Berry Fitness for Health API',
      version: '0.2.0',
      description:
        'Backend for the Berry Fitness for Health website. Every /api request must send X-App-Key: berry.',
    },
    servers: [{ url: '/' }],
    security: [{ AppKey: [] }],
    components: {
      securitySchemes: {
        AppKey: { type: 'apiKey', in: 'header', name: 'x-app-key' },
        AdminKey: { type: 'apiKey', in: 'header', name: 'x-admin-key' },
        BearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
});
