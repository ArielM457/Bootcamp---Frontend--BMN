import { AppEnvironment } from '../app/core/config/app-environment';

interface RuntimeConfig {
  apiUrl: string;
  hubUrl: string;
}

declare global {
  var __BOMBERMAN_CONFIG__: RuntimeConfig | undefined;
}

const runtimeConfig = globalThis.__BOMBERMAN_CONFIG__;

if (!runtimeConfig?.apiUrl || !runtimeConfig.hubUrl) {
  throw new Error('Falta generar la configuración desde el archivo .env.');
}

export const environment: AppEnvironment = {
  apiUrl: runtimeConfig.apiUrl,
  hubUrl: runtimeConfig.hubUrl,
};
