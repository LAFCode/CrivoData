import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom" // Biblioteca padrão para gerenciar rotas no React

import { routes } from "./routes" // Aqui eu busco a lista de "caminhos" (ex: /home, /login)

// 1. Aqui eu crio o objeto de rotas. 
// O 'createBrowserRouter' é o modo moderno que permite usar as APIs mais novas do React.
const router = createBrowserRouter(routes)

export default function AppRouter() {
  // 2. O 'RouterProvider' é quem de fato "liga" o sistema de rotas.
  // Eu passo o objeto 'router' que configurei acima para ele.
  return (
    <RouterProvider router={router} />
  )
}