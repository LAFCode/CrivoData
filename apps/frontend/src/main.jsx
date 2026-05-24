import React from "react"
import ReactDOM from "react-dom/client"
import '@/shared/configs/i18n/i18n'

import "./index.css"

import AppRouter from "./app/router"
import AppProviders from "./app/providers/AppProviders"

// Aqui é onde eu ligo o JS ao HTML:
// 1. O 'document.getElementById("root")' vai lá no arquivo index.html (na pasta public ou root)
// 2. Ele procura a <div id="root"></div> que é o "esqueleto" vazio do projeto.
// 3. O 'createRoot' transforma essa div no ponto central onde o React vai desenhar tudo.
ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode: Ativado pra me avisar de bugs e funções obsoletas no console durante o dev.
  <React.StrictMode>
    {/* 
       Providers: Coloco em volta de tudo pra que qualquer página do app 
       consiga acessar dados globais (como usuário logado ou tema).
    */}
    <AppProviders>
      {/* 
         Router: Aqui dentro é que as páginas trocam. 
         O React vai injetar o componente da página atual bem aqui.
      */}
      <AppRouter />
    </AppProviders>
  </React.StrictMode>
)