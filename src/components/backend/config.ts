export function useConfig() {
  return {
    ...process.env,
    API_HOST: process.env.API_HOST,
    FRONTEND: process.env.FRONTEND,
  }
}
