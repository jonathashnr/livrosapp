# Documentação dos Microserviços

---

## Microserviço de Leitor

### Porta

Este microserviço está rodando na porta `3001`.

### Endpoints

#### Criar novo leitor
- **URL**: `/leitor`
- **Método**: `POST`
- **Autenticação**: API_KEY
- **Corpo da Requisição**:
  ```json
  {
    "email": "email@example.com",
    "nome": "Nome do Leitor",
    "senha": "senha123"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "leitor": {
      "id": 1,
      "email": "email@example.com",
      "nome": "Nome do Leitor"
    }
  }
  ```

#### Listar todos os leitores
- **URL**: `/leitores`
- **Método**: `GET`
- **Autenticação**: API_KEY
- **Resposta de Sucesso**:
  ```json
  {
    "leitores": [
      {
        "id": 1,
        "email": "email@example.com",
        "nome": "Nome do Leitor",
        "senha": "senha123"
      }
    ]
  }
  ```

#### Obter leitor por ID
- **URL**: `/leitor/:id`
- **Método**: `GET`
- **Autenticação**: API_KEY
- **Resposta de Sucesso**:
  ```json
  {
    "leitor": {
      "id": 1,
      "email": "email@example.com",
      "nome": "Nome do Leitor",
      "senha": "senha123"
    }
  }
  ```

#### Atualizar leitor por ID
- **URL**: `/leitor/:id`
- **Método**: `PUT`
- **Autenticação**: API_KEY
- **Corpo da Requisição**:
  ```json
  {
    "email": "novoemail@example.com",
    "nome": "Nome Atualizado",
    "senha": "novaSenha123"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "leitor": {
      "id": 1,
      "email": "novoemail@example.com",
      "nome": "Nome Atualizado"
    }
  }
  ```

#### Deletar leitor por ID
- **URL**: `/leitor/:id`
- **Método**: `DELETE`
- **Autenticação**: API_KEY
- **Resposta de Sucesso**:
  ```json
  {
    "message": "Leitor deletado"
  }
  ```

#### Adicionar nova leitura
- **URL**: `/leitura`
- **Método**: `POST`
- **Autenticação**: JWT
- **Corpo da Requisição**:
  ```json
  {
    "isbn": "1234567890123",
    "estado": "Lendo"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "leitura": {
      "id": 1,
      "isbn": "1234567890123",
      "leitor_id": 1,
      "estado": "Lendo"
    }
  }
  ```

#### Obter leitura por ID
- **URL**: `/leitura/:id`
- **Método**: `GET`
- **Autenticação**: JWT
- **Resposta de Sucesso**:
  ```json
  {
    "leitura": {
      "id": 1,
      "isbn": "1234567890123",
      "leitor_id": 1,
      "estado": "Lendo",
      "resenha": {
        "nota": 5,
        "comentario": "Ótimo livro!"
      }
    }
  }
  ```

#### Obter todas as leituras de um usuário
- **URL**: `/leituras`
- **Método**: `GET`
- **Autenticação**: JWT
- **Resposta de Sucesso**:
  ```json
  {
    "leituras": [
      {
        "id": 1,
        "isbn": "1234567890123",
        "leitor_id": 1,
        "estado": "Lendo",
        "resenha": {
          "nota": 5,
          "comentario": "Ótimo livro!"
        }
      }
    ]
  }
  ```

#### Deletar leitura por ID (e resenha relacionada)
- **URL**: `/leitura/:id`
- **Método**: `DELETE`
- **Autenticação**: JWT
- **Resposta de Sucesso**:
  ```json
  {
    "message": "Leitura deletada"
  }
  ```

#### Criar nova resenha
- **URL**: `/resenha`
- **Método**: `POST`
- **Autenticação**: JWT
- **Corpo da Requisição**:
  ```json
  {
    "id_leitura": 1,
    "nota": 5,
    "comentario": "Ótimo livro!"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "resenha": {
      "id_leitura": 1,
      "nota": 5,
      "comentario": "Ótimo livro!"
    }
  }
  ```

#### Atualizar resenha por ID da leitura
- **URL**: `/resenha/:id_leitura`
- **Método**: `PUT`
- **Autenticação**: JWT
- **Corpo da Requisição**:
  ```json
  {
    "nota": 4,
    "comentario": "Muito bom, mas com algumas falhas."
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "resenha": {
      "id_leitura": 1,
      "nota": 4,
      "comentario": "Muito bom, mas com algumas falhas."
    }
  }
  ```

#### Deletar resenha por ID da leitura
- **URL**: `/resenha/:id_leitura`
- **Método**: `DELETE`
- **Autenticação**: JWT
- **Resposta de Sucesso**:
  ```json
  {
    "message": "Resenha deletada"
  }
  ```

---

### Configuração do .env

O microserviço deve incluir um arquivo `.env` com as seguintes variáveis:

```env
API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret_here
```

---
## Microserviço Autenticação

### Porta

Este microserviço está rodando na porta `3002`.

### Endpoints

#### Registro de usuário
- **URL**: `/register`
- **Método**: `POST`
- **Corpo da Requisição**:
  ```json
  {
    "email": "email@example.com",
    "nome": "Nome do Leitor",
    "senha": "senha123"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "leitor": {
      "id": 1,
      "email": "email@example.com",
      "nome": "Nome do Leitor"
    }
  }
  ```
- **Descrição**: Esta rota cria um novo leitor no microserviço de leitor, gerando o hash da senha com um salt antes de salvar.

#### Login de usuário
- **URL**: `/login`
- **Método**: `POST`
- **Corpo da Requisição**:
  ```json
  {
    "email": "email@example.com",
    "senha": "senha123"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "token": "jwt_token_here"
  }
  ```
- **Descrição**: Esta rota verifica as credenciais do usuário. Se o email e a senha estiverem corretos, retorna um token JWT que pode ser usado para autenticação em outros serviços.

---

### Configuração do .env

O microserviço de autenticação deve incluir um arquivo `.env` com as seguintes variáveis:

```env
API_KEY=your_api_key_here
JWT_SECRET=your_jwt_secret_here
```

---

### Observações

1. **Registro de usuário**: Ao registrar um novo usuário, a senha fornecida é hashada com `bcrypt` antes de ser enviada ao microserviço de leitor para armazenamento seguro.
2. **Login de usuário**: Durante o login, a senha fornecida é comparada com o hash armazenado. Se a verificação for bem-sucedida, um token JWT é gerado e retornado para o cliente.

---
## Microserviço de Livros

### Porta

Este microserviço está rodando na porta `3000`.

### Endpoints

#### Listar todos os livros
- **URL**: `/livros`
- **Método**: `GET`
- **Resposta de Sucesso**:
  ```json
  {
    "livros": [
      {
        "isbn": "1234567890123",
        "titulo": "Título do Livro",
        "autor": "Autor do Livro",
        "ano": 2020,
        "url_capa": "http://example.com/capa.jpg",
        "descricao": "Descrição do livro"
      }
    ]
  }
  ```

#### Obter livro por ISBN
- **URL**: `/livros/:isbn`
- **Método**: `GET`
- **Parâmetros da URL**: 
  - `isbn`: O ISBN-13 do livro.
- **Resposta de Sucesso**:
  ```json
  {
    "livro": {
      "isbn": "1234567890123",
      "titulo": "Título do Livro",
      "autor": "Autor do Livro",
      "ano": 2020,
      "url_capa": "http://example.com/capa.jpg",
      "descricao": "Descrição do livro"
    }
  }
  ```
- **Resposta de Erro**:
  - **400**: ISBN-13 inválido
    ```json
    {
      "error": "ISBN-13 inválido"
    }
    ```
  - **404**: Livro não encontrado
    ```json
    {
      "error": "Livro não encontrado"
    }
    ```

#### Adicionar novo livro
- **URL**: `/livros`
- **Método**: `POST`
- **Corpo da Requisição**:
  ```json
  {
    "isbn": "1234567890123",
    "titulo": "Título do Livro",
    "autor": "Autor do Livro",
    "ano": 2020,
    "url_capa": "http://example.com/capa.jpg",
    "descricao": "Descrição do livro"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "livro": {
      "isbn": "1234567890123",
      "titulo": "Título do Livro",
      "autor": "Autor do Livro",
      "ano": 2020,
      "url_capa": "http://example.com/capa.jpg",
      "descricao": "Descrição do livro"
    }
  }
  ```
- **Resposta de Erro**:
  - **400**: ISBN-13 inválido
    ```json
    {
      "error": "ISBN-13 inválido"
    }
    ```
  - **500**: Erro ao inserir o livro
    ```json
    {
      "error": "Descrição do erro"
    }
    ```

#### Atualizar livro por ISBN
- **URL**: `/livros/:isbn`
- **Método**: `PUT`
- **Parâmetros da URL**: 
  - `isbn`: O ISBN-13 do livro.
- **Corpo da Requisição**:
  ```json
  {
    "titulo": "Novo Título do Livro",
    "autor": "Novo Autor do Livro",
    "ano": 2021,
    "url_capa": "http://example.com/novacapa.jpg",
    "descricao": "Nova descrição do livro"
  }
  ```
- **Resposta de Sucesso**:
  ```json
  {
    "livro": {
      "isbn": "1234567890123",
      "titulo": "Novo Título do Livro",
      "autor": "Novo Autor do Livro",
      "ano": 2021,
      "url_capa": "http://example.com/novacapa.jpg",
      "descricao": "Nova descrição do livro"
    }
  }
  ```
- **Resposta de Erro**:
  - **400**: ISBN-13 inválido
    ```json
    {
      "error": "ISBN-13 inválido"
    }
    ```
  - **404**: Livro não encontrado
    ```json
    {
      "error": "Livro não encontrado"
    }
    ```
  - **500**: Erro ao atualizar o livro
    ```json
    {
      "error": "Descrição do erro"
    }
    ```

#### Deletar livro por ISBN
- **URL**: `/livros/:isbn`
- **Método**: `DELETE`
- **Parâmetros da URL**: 
  - `isbn`: O ISBN-13 do livro.
- **Resposta de Sucesso**:
  ```json
  {
    "message": "Livro deletado"
  }
  ```
- **Resposta de Erro**:
  - **400**: ISBN-13 inválido
    ```json
    {
      "error": "ISBN-13 inválido"
    }
    ```
  - **404**: Livro não encontrado
    ```json
    {
      "error": "Livro não encontrado"
    }
    ```
  - **500**: Erro ao deletar o livro
    ```json
    {
      "error": "Descrição do erro"
    }
    ```
