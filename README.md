# SERVICE DESK Front-End

[![Capa do Projeto](https://i.imgur.com/E8YvzaC.png)](https://github.com/caiquenaimi/servicedesk-front)

Este é um projeto de front-end para um sistema de Service Desk do SENAI-Valinhos. Ele permite que os usuários criem uma requisição de um problema na infraestrutura, facilitando a comunicação entre alunos e a equipe de manutenção do SENAI-Valinhos.

## Índice
- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Instalação e Configuração](#instalação-e-configuração)
- [Como Usar](#como-usar)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## Visão Geral

Este projeto visa fornecer uma interface intuitiva para um sistema de gerenciamento de requisição de manutenções, onde os alunos podem registrar problemas na infraestrutura e o administrador pode gerenciar e responder a essas solicitações. O objetivo é melhorar a eficiência no atendimento, garantir um fluxo organizado de comunicação e facilitar a manutenção do patrimônio do SENAI.

## Funcionalidades

- **Registro de Requisições**: Permite aos usuários criar novas requisições.
- **Visualização de Requisições**: Os usuários podem visualizar o status das suas requisições.
- **Atualização de Requisições**: A equipe de manutenção pode atualizar seu status.
- **Pesquisa e Filtro**: Permite pesquisar e filtrar requisições por diferentes critérios, como status, local e data.

## Tecnologias Utilizadas

- **React**: Biblioteca JavaScript para construção da interface de usuário.
- **Redux**: Gerenciamento do estado da aplicação.
- **Axios**: Requisições HTTP para comunicação com a API.
- **Styled Components**: Estilização dos componentes de forma modular.
- **React Router**: Navegação entre as diferentes páginas do aplicativo.

## Instalação e Configuração ⚙

### Pré-requisitos

- **Node.js** (versão 14 ou superior)
- **npm** ou **yarn** para gerenciar pacotes

### Passos para Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu_usuario/ServiceDesk-frontend.git

   ```

2. Entre no diretório do projeto:

   ```bash
   cd service-desk-frontend
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

   ou, se estiver usando **yarn**:

   ```bash
   yarn install
   ```

4. Configure as variáveis de ambiente:

   Crie um arquivo `.env` na raiz do projeto e configure a URL da API do back-end:

   ```
   URL=http://localhost:4000
   REACT_APP_API_URL=http://localhost:4000
   ```

## Como Usar

1. Após instalar as dependências e configurar o projeto, inicie o servidor de desenvolvimento:

   ```bash
   npm start
   ```

   ou, se estiver usando **yarn**:

   ```bash
   yarn start
   ```

2. Abra [http://localhost:3000](http://localhost:3000) no navegador para visualizar o projeto.

3. Use a interface para criar, visualizar e gerenciar requisição de manutenção.

## Scripts Disponíveis

- `npm start`: Inicia o servidor de desenvolvimento.
- `npm run build`: Gera a versão de produção do aplicativo.
- `npm run test`: Executa os testes da aplicação.
- `npm run lint`: Analisa o código em busca de problemas de estilo e qualidade.

## Contribuindo

Se desejar contribuir para este projeto:

1. Faça um fork do repositório.
2. Crie uma nova branch com sua feature ou correção de bug:

   ```bash
   git checkout -b feature/nome-da-feature
   ```

3. Commit suas alterações:

   ```bash
   git commit -m "Descrição da alteração"
   ```

4. Faça o push para sua branch:

   ```bash
   git push origin feature/nome-da-feature
   ```

5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para obter mais detalhes.
