# TaskHub - Dashboard de Gerenciamento de Projetos

O **TaskHub** é uma plataforma completa para gerenciamento de projetos, times e tarefas, desenvolvida com tecnologias modernas de Frontend e Backend.

![TaskHub Preview](public/images/logo/logo.png)

## 🚀 Tecnologias Utilizadas

### Frontend (Vercel)
*   **React.js** (Vite)
*   **TypeScript**
*   **Tailwind CSS** (Estilização e Modo Dark)
*   **FullCalendar** (Calendário interativo)
*   **ApexCharts** (Gráficos e métricas)
*   **Firebase** (Autenticação Social)

### Backend (Render)
*   **Java 17**
*   **Spring Boot 3**
*   **Spring Data JPA** (Hibernate)
*   **Docker** (Containerização)

### Banco de Dados (Supabase)
*   **PostgreSQL** (Gerenciado na nuvem)

---

## ✨ Funcionalidades

*   **Autenticação:** Login e Cadastro com Email/Senha e Google (Firebase).
*   **Dashboard:** Visão geral com gráficos de desempenho e métricas.
*   **Projetos:** Criação, edição e arquivamento de projetos com status e prazos.
*   **Times:** Gerenciamento de equipes e adição de membros.
*   **Calendário:** Agendamento de reuniões e eventos com notificações visuais.
*   **Notificações:** Alertas em tempo real para prazos próximos e reuniões.
*   **Perfil:** Edição de dados do usuário e foto de perfil (com crop).
*   **Configurações:** Preferências de tema (Claro/Escuro), idioma e notificações.
*   **Modo Escuro:** Suporte total a tema dark em todas as telas.

---

## 🛠️ Como Rodar Localmente

### Pré-requisitos
*   Node.js (v18+)
*   Java JDK 17+
*   Maven
*   Docker (Opcional)

### 1. Configurar o Backend
1.  Clone o repositório do backend (se estiver separado).
2.  Configure as variáveis de ambiente no `application.properties` ou via IDE:
    *   `SPRING_DATASOURCE_URL`
    *   `SPRING_DATASOURCE_USERNAME`
    *   `SPRING_DATASOURCE_PASSWORD`
3.  Execute o projeto:
    ```bash
    mvn spring-boot:run
    ```

### 2. Configurar o Frontend
1.  Clone este repositório.
2.  Instale as dependências:
    ```bash
    npm install
    ```
3.  Crie um arquivo `.env.local` na raiz com a URL do seu backend local:
    ```properties
    VITE_API_URL=http://localhost:8080/api
    ```
    *(Adicione também as chaves do Firebase)*
4.  Rode o projeto:
    ```bash
    npm run dev
    ```

---

## 📦 Deploy

*   **Frontend:** Deploy automático na **Vercel**.
*   **Backend:** Deploy via Docker no **Render**.
*   **Banco de Dados:** Hospedado no **Supabase**.

---

## 📝 Licença

Este projeto é de código aberto e está licenciado sob a [MIT License](LICENSE).
