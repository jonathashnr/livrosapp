### Documentação dos Microserviços

---

## Microserviço de Leitor, Leitura e Resenha

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
