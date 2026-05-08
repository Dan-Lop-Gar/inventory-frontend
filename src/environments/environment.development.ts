export const environment = {
  production: false,
  apiRestUrl: 'http://localhost:8080/api',
  apiGrpcUrl: 'http://localhost:8090/api/grpc',
  keycloak: {
    url: 'http://localhost:8180',
    realm: 'inventory',
    clientId: 'inventory-frontend'
  }
};