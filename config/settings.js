import env from './env';

export function getEnv() {
  return env[process.env.NODE_ENV || 'development'];
}
