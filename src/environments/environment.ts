export const environment = {
  production: true,
  apiRestUrl: 'http://backend/api',
  apiGrpcUrl: 'http://envoy/api/grpc',
  keycloak: {
    url: 'http://keycloak:8180',
    realm: 'inventory',
    clientId: 'inventory-frontend'
  }
};
