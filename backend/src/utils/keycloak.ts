import axios from 'axios';
import { config } from '../config';
import { logger } from '../config/logger';

export async function getKeycloakAccessToken(): Promise<string> {
  try {
    const response = await axios.post(
      `${config.keycloak.url}/realms/${config.keycloak.realm}/protocol/openid-connect/token`,
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: config.keycloak.clientId,
        client_secret: config.keycloak.clientSecret,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    return response.data.access_token;
  } catch (error) {
    logger.error('Failed to get Keycloak access token', { error: (error as Error).message });
    throw error;
  }
}

export async function getUserFromKeycloak(
  keycloakId: string,
  accessToken: string
): Promise<Record<string, any>> {
  try {
    const response = await axios.get(
      `${config.keycloak.url}/admin/realms/${config.keycloak.realm}/users/${keycloakId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    logger.error('Failed to fetch user from Keycloak', { error: (error as Error).message });
    throw error;
  }
}

export async function createKeycloakUser(
  userData: Record<string, any>,
  accessToken: string
): Promise<string> {
  try {
    const response = await axios.post(
      `${config.keycloak.url}/admin/realms/${config.keycloak.realm}/users`,
      {
        username: userData.email,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        enabled: true,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.headers.location?.split('/').pop() || '';
  } catch (error) {
    logger.error('Failed to create Keycloak user', { error: (error as Error).message });
    throw error;
  }
}
