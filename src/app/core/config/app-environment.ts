export type AppMode = 'demo' | 'api';

export interface AppEnvironment {
  readonly mode: AppMode;
}
