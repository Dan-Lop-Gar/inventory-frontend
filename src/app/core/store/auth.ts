import { Injectable, signal, computed } from '@angular/core';
import Keycloak from 'keycloak-js';
import { environment } from '../../../environments/environment';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthStore {

  private keycloak = new Keycloak({
    url: environment.keycloak.url,
    realm: environment.keycloak.realm,
    clientId: environment.keycloak.clientId
  });

  private _user = signal<AuthUser | null>(null);
  private _token = signal<string | null>(null);
  private _initialized = signal(false);

  readonly user = this._user.asReadonly();
  readonly token = this._token.asReadonly();
  readonly initialized = this._initialized.asReadonly();

  readonly isAuthenticated = computed(() => this._token() !== null);

  readonly isAdmin = computed(() =>
    this._user()?.roles.includes('ADMIN') ?? false
  );
  readonly isBuyer = computed(() =>
    this._user()?.roles.includes('BUYER') ?? false
  );
  readonly isWarehouse = computed(() =>
    this._user()?.roles.includes('WAREHOUSE') ?? false
  );
  readonly isAuditor = computed(() =>
    this._user()?.roles.includes('AUDITOR') ?? false
  );

  readonly canManageOrders = computed(() =>
    this.isAdmin() || this.isBuyer()
  );
  readonly canReceiveOrders = computed(() =>
    this.isAdmin() || this.isWarehouse()
  );
  readonly canViewReports = computed(() =>
    this.isAdmin() || this.isAuditor() || this.isWarehouse()
  );

  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak.init({
        onLoad: 'login-required',
        checkLoginIframe: false
      });

      if (authenticated) {
        await this.loadUserProfile();
        this.scheduleTokenRefresh();
      }

      this._initialized.set(true);
      return authenticated;

    } catch (error) {
      console.error('Error inicializando Keycloak', error);
      this._initialized.set(true);
      return false;
    }
  }

  async login(): Promise<void> {
    await this.keycloak.login();
  }

  async logout(): Promise<void> {
    this._user.set(null);
    this._token.set(null);
    await this.keycloak.logout({
      redirectUri: window.location.origin
    });
  }

  getToken(): string | null {
    return this._token();
  }

  private async loadUserProfile(): Promise<void> {
    const tokenParsed = this.keycloak.tokenParsed;
    const token = this.keycloak.token;

    if (!tokenParsed || !token) return;

    const roles: string[] = [
      ...(tokenParsed['realm_access']?.roles ?? [])
    ].map((r: string) => r.toUpperCase());

    this._user.set({
      id: tokenParsed['sub'] ?? '',
      username: tokenParsed['preferred_username'] ?? '',
      email: tokenParsed['email'] ?? '',
      roles
    });

    this._token.set(token);
  }

  // Refresca el token 30 segundos antes de que expire
  private scheduleTokenRefresh(): void {
    setInterval(async () => {
      try {
        const refreshed = await this.keycloak.updateToken(30);
        if (refreshed) {
          this._token.set(this.keycloak.token ?? null);
        }
      } catch {
        await this.logout();
      }
    }, 10_000);
  }
}