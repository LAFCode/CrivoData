// O 'children' é uma palavra mágica do React: ela representa 
// TUDO o que for colocado dentro das tags <AppProviders>...</AppProviders>
export default function AppProviders({ children }) {
  
  // Por enquanto, ele não está injetando nada (como temas ou banco de dados).
  // Ele apenas recebe os filhos (no seu caso, o AppRouter) e os joga na tela.
  return children
}