/**
 * Mock auth service.
 *
 * To switch to real API later:
 * 1. Replace the mock credentials check with an axios call
 * 2. Return the same shape { user, token }
 * 3. That's it — the rest of the app stays unchanged.
 */

const MOCK_USER = {
  username: 'admin',
  password: 'admin123',
  name: 'Leonardo',
  role: 'Data Engineer',
}

/**
 * Simulates a login request.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{ user: { name: string, role: string, username: string }, token: string }>}
 */
export async function loginService(username, password) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  if (username !== MOCK_USER.username || password !== MOCK_USER.password) {
    throw new Error('Usuário ou senha inválidos')
  }

  const { password: _, ...user } = MOCK_USER

  return {
    user,
    token: 'mock-jwt-token-' + Date.now(),
  }
}

/**
 * Placeholder for a real token validation call.
 * Currently just returns the stored user.
 */
export async function validateTokenService(token) {
  // In the future: GET /auth/me with the token in the header
  return JSON.parse(localStorage.getItem('crivodata_user'))
}