export const environment = {
  production: true,
  apiRestUrl: 'http://backend:8081/api',
  apiGrpcUrl: 'http://envoy:8090/api/grpc',
  keycloak: {
    url: 'http://keycloak:8080',
    realm: 'inventory',
    clientId: 'inventory-frontend'
  }
};
