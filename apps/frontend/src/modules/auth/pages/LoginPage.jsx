import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) return

    try {
      await login(username.trim(), password)
      navigate('/', { replace: true })
    } catch {
      // error is already in the store
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* ── Left panel: Branding ── */}
      <div className="hidden flex-1 flex-col justify-between bg-zinc-950 p-12 text-white lg:flex">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">CrivoData</h1>
          <p className="mt-1 text-sm text-zinc-400">
            Sistema de Workflows Dinâmicos
          </p>
        </div>

        <blockquote className="max-w-md">
          <p className="text-lg leading-relaxed text-zinc-300">
            &ldquo;Crie fluxos de validação de dados sem escrever uma linha de
            código.&rdquo;
          </p>
          <footer className="mt-4 text-sm text-zinc-500">
            — Plataforma de Governança de Dados
          </footer>
        </blockquote>

        <div className="text-xs text-zinc-600">
          &copy; {new Date().getFullYear()} CrivoData. Todos os direitos
          reservados.
        </div>
      </div>

      {/* ── Right panel: Login form ── */}
      <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 dark:bg-zinc-900">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="mb-8 lg:hidden">
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
              CrivoData
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Faça login para continuar
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
              <button
                onClick={clearError}
                className="ml-auto text-red-500 hover:text-red-700 dark:hover:text-red-200"
              >
                &times;
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Usuário
              </label>
              <input
                id="username"
                type="text"
                autoComplete="username"
                placeholder="Digite seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="
                  h-12 w-full
                  rounded-2xl
                  border border-zinc-200
                  bg-white
                  px-4
                  text-sm
                  outline-none
                  transition-all
                  placeholder:text-zinc-400
                  focus:border-zinc-800
                  focus:ring-2
                  focus:ring-zinc-800/10
                  dark:border-zinc-700
                  dark:bg-zinc-800
                  dark:text-white
                  dark:placeholder:text-zinc-500
                  dark:focus:border-zinc-300
                  dark:focus:ring-zinc-300/10
                "
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                Senha
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
                    h-12 w-full
                    rounded-2xl
                    border border-zinc-200
                    bg-white
                    px-4
                    pr-11
                    text-sm
                    outline-none
                    transition-all
                    placeholder:text-zinc-400
                    focus:border-zinc-800
                    focus:ring-2
                    focus:ring-zinc-800/10
                    dark:border-zinc-700
                    dark:bg-zinc-800
                    dark:text-white
                    dark:placeholder:text-zinc-500
                    dark:focus:border-zinc-300
                    dark:focus:ring-zinc-300/10
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    text-zinc-400
                    hover:text-zinc-600
                    dark:hover:text-zinc-300
                  "
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Hint */}
            <p className="text-xs text-zinc-400 dark:text-zinc-500">
              Credenciais padrão: <strong>admin</strong> /{' '}
              <strong>admin123</strong>
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !username.trim() || !password.trim()}
              className="
                flex h-12 w-full items-center justify-center gap-2
                rounded-2xl
                bg-zinc-900
                text-sm
                font-semibold
                text-white
                transition-all
                hover:bg-zinc-800
                disabled:cursor-not-allowed
                disabled:opacity-50
                dark:bg-white
                dark:text-zinc-900
                dark:hover:bg-zinc-200
              "
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <LogIn className="h-4 w-4" />
              )}
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}