# HanapBahay

HanapBahay is a C2C platform where **landlords** can list rental properties and **renters** can search, inquire, and add properties to their wishlist. It is built with a modern full-stack setup:

- **Backend:** ASP.NET Core 9.0, Entity Framework Core, SQL Server, AutoMapper, Azure Blob Storage, NSwag (Swagger docs).
- **Frontend:** React + TypeScript + Vite, TailwindCSS, ShadCN UI, React Router.
- **Deployment:** Docker & Docker Compose, with Nginx serving the frontend.

---

## 🚀 Features

- User authentication (landlords and renters)
- Property listing management for landlords
- Wishlist & property browsing for renters
- Image storage via **Azure Blob Storage**
- REST API documentation via Swagger (NSwag)

---

## 🛠 Prerequisites

Before you begin, make sure you have:

- [Docker](https://www.docker.com/get-started) installed
- [Docker Compose](https://docs.docker.com/compose/) installed
- (Optional, for local dev)

  - [.NET 9 SDK](https://dotnet.microsoft.com/)
  - [Node.js 24+](https://nodejs.org/)
  - [npm](https://www.npmjs.com/)

---

## ⚙️ Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/hanapbahay.git
cd hanapbahay
```

### 2. Environment Variables

Create a `.env` file at the top-level of the project with your secrets:

```bash
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
SQLSERVER_CONNECTION=Server=host.docker.internal,1433;Database=HanapBahayDb;User Id=sa;Password=Your_password123;TrustServerCertificate=True;
```

The backend uses these for:

- **SQL Server** (Entity Framework migrations run automatically at startup)
- **Azure Blob Storage** (image storage)

---

### 3. Build & Run with Docker Compose

From the project root, run:

```bash
docker compose up --build
```

- The **frontend** will be served at:
  👉 [http://localhost:8080](http://localhost:8080)

- The **backend API & Swagger docs** will be available at:
  👉 [http://localhost:5000](http://localhost:5000)

---

### 4. Development Mode

- **Frontend (Vite Dev Server):**

  ```bash
  cd hanapbahay-frontend
  npm install
  npm run dev
  ```

  Runs on [http://localhost:5173](http://localhost:5173)

- **Backend (ASP.NET Core Dev Server):**

  ```bash
  cd hanapbahay-backend
  dotnet run
  ```

  Runs on [http://localhost:5000](http://localhost:5000)

---

## 📦 Deployment

For production:

1. Build images for the correct architecture:

   ```bash
   docker build --platform=linux/amd64 -t hanapbahay-frontend ./hanapbahay-frontend
   docker build --platform=linux/amd64 -t hanapbahay-backend ./hanapbahay-backend
   ```

2. Push them to your container registry:

   ```bash
   docker push your-registry/hanapbahay-frontend
   docker push your-registry/hanapbahay-backend
   ```

3. Deploy using your cloud provider’s container hosting service (Azure App Service, Azure Container Apps, etc.).

---

## 📚 References

- [Docker .NET Guide](https://docs.docker.com/language/dotnet/)
- [Docker Node.js Guide](https://docs.docker.com/language/nodejs/)
- [ShadCN UI](https://ui.shadcn.com/)
- [Vite](https://vitejs.dev/)
