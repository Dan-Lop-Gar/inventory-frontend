export const environment = {
  production: true,
  apiRestUrl: 'http://localhost/api',
  apiGrpcUrl: 'http://envoy/api/grpc',
  keycloak: {
    url: 'http://keycloak:8180',
    realm: 'inventory',
    clientId: 'inventory-frontend'


  }
};
