# Task Manager — Containerized MERN App with CI/CD Pipeline

A full-stack task management application demonstrating production-grade DevOps practices: multi-service Docker containerization, automated CI/CD pipeline, and cloud deployment to AWS EC2.

**Live Demo:** http://13.41.224.89

---

## Project Overview

This project goes beyond writing application code — the focus is the infrastructure that builds, ships, and runs it reliably. Every push to `main` automatically builds fresh Docker images, pushes them to a container registry, and deploys to a live cloud server without any manual steps.

The application itself is a MERN stack task manager with user authentication, but the real deliverable is the deployment pipeline around it.

---

## Architecture

```
Developer (git push)
        │
        ▼
  GitHub (main branch)
        │
        ▼
GitHub Actions Pipeline
   ├── Build backend image  ──► GHCR (ghcr.io/duubemmm/task-manager-backend)
   ├── Build frontend image ──► GHCR (ghcr.io/duubemmm/task-manager-frontend)
   └── Deploy to EC2
            │
            ▼
      AWS EC2 (Ubuntu 26.04)
      └── Docker Compose
          ├── frontend  (nginx, port 80) ◄── public internet
          ├── backend   (Node/Express)   ◄── internal network only
          └── mongo     (MongoDB)        ◄── internal network only
                  │
                  └── Named volume (mongo_data) → host disk
```

**Network design:** All three services share a private bridge network (`app-network`). Only the frontend container exposes a port to the outside world. The backend and MongoDB are unreachable from the internet — the backend is only accessible via nginx reverse proxy, and MongoDB is only accessible from the backend. This enforces the principle of least privilege at the network layer.

**Data persistence:** MongoDB data is stored in a named Docker volume (`mongo_data`) that survives container restarts and redeployments. Running `docker compose down` does not destroy the database.

**Reverse proxy:** nginx inside the frontend container serves the React static files and proxies all `/api/*` requests to the backend container using Docker's internal DNS. The browser only ever talks to one host on port 80.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Containerization | Docker, Docker Compose |
| Web server / Proxy | nginx (alpine) |
| CI/CD | GitHub Actions |
| Container Registry | GitHub Container Registry (GHCR) |
| Cloud | AWS EC2 (Ubuntu 26.04) |

---

## Repository Structure

```
task-manager/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline definition
├── backend/
│   ├── src/
│   │   ├── config/db.js        # MongoDB connection
│   │   ├── controller/         # Route handlers
│   │   ├── models/             # Mongoose schemas
│   │   └── routes/             # Express routes
│   ├── server.js               # Entry point
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api.js              # Axios instance with auth interceptor
│   │   ├── pages/              # React pages
│   │   └── components/         # Reusable components
│   ├── nginx.conf              # nginx reverse proxy config
│   └── Dockerfile              # Multi-stage build
├── docker-compose.yml          # Local development
└── docker-compose.prod.yml     # Production (uses GHCR images)
```

---

## CI/CD Pipeline

The pipeline is defined in `.github/workflows/deploy.yml` and runs automatically on every push to `main`.

**Job 1 — Build and Push** (runs on GitHub-hosted Ubuntu runner):
1. Checks out the repository
2. Authenticates to GitHub Container Registry
3. Builds the backend Docker image and tags it with both `latest` and the git commit SHA
4. Builds the frontend Docker image (injecting the API URL as a build argument)
5. Pushes both images to GHCR

**Job 2 — Deploy** (runs after Job 1 succeeds):
1. Copies `docker-compose.prod.yml` to the EC2 instance via SCP
2. SSHs into EC2 and authenticates to GHCR
3. Pulls the latest images
4. Restarts all services with `docker compose up -d`
5. Prunes unused images to free disk space

**Image tagging strategy:** Every image is tagged twice — `latest` for convenience and a git SHA tag (e.g. `ghcr.io/duubemmm/task-manager-backend:a1b2c3d`) for traceability. This means you can always identify exactly which commit is running in production.

**Secret management:** EC2 host, SSH private key, EC2 username, and GHCR token are stored as encrypted GitHub Actions secrets. No credentials appear in code.

---

## Prerequisites

To run this locally you need:
- Docker Engine and Docker Compose plugin installed
- Git

To deploy you need:
- AWS account with an EC2 instance (Ubuntu, t2.micro works)
- Docker installed on the EC2 instance
- A GitHub account with a Personal Access Token (scopes: `write:packages`, `read:packages`)

---

## Local Development Setup

```bash
# Clone the repository
git clone https://github.com/Duubemmm/task-manager.git
cd task-manager

# Start all three services
docker compose up --build

# App will be available at http://localhost:3000
# Frontend proxies /api requests to the backend automatically
```

To stop and remove containers (data is preserved in the named volume):
```bash
docker compose down
```

To also remove the volume (wipes the database):
```bash
docker compose down -v
```

---

## Production Deployment

Deployment is fully automated via the CI/CD pipeline. To trigger a deployment, simply push to `main`:

```bash
git add .
git commit -m "your change"
git push origin main
```

GitHub Actions handles the rest. Monitor progress in the Actions tab of the repository.

**To set up the pipeline from scratch:**

1. Fork this repository
2. Launch an EC2 instance with Docker installed
3. Add these four secrets to your repo (Settings → Secrets → Actions):
   - `EC2_HOST` — your EC2 public IP
   - `EC2_USER` — `ubuntu`
   - `EC2_SSH_KEY` — contents of your `.pem` private key file
   - `GHCR_TOKEN` — GitHub Personal Access Token with packages scopes
4. Push any change to `main` to trigger the first deployment

---

## Key DevOps Concepts Demonstrated

**Multi-stage Docker builds** — the frontend Dockerfile uses a two-stage build: a Node.js stage that installs dependencies and runs `vite build`, and an nginx stage that copies only the compiled static files. The final image contains no Node.js, no `node_modules`, and no source code — just nginx and the built assets. This keeps the production image small and the attack surface minimal.

**Build-time vs runtime environment variables** — Vite bakes environment variables into the compiled JavaScript at build time, not runtime. The pipeline passes `VITE_API_URL` as a Docker build argument (`--build-arg`) so the correct API URL is embedded during the CI build step.

**Docker named volumes** — MongoDB data persists in a named volume managed by Docker on the host filesystem. Containers are ephemeral; the data is not.

**Bridge networking and internal DNS** — Docker Compose creates a private bridge network. Containers communicate using service names as hostnames (`http://backend:5000`) resolved by Docker's embedded DNS server. No IP addresses, no hardcoded ports exposed externally.

**nginx as reverse proxy** — a single nginx instance serves static files for `/` routes and proxies `/api/*` requests to the backend container. This means only one port (80) is exposed to the internet.

**Immutable image tags** — git SHA tags mean every deployment is traceable to a specific commit. Rolling back is as simple as updating the image tag and rerunning compose.

---

## Troubleshooting

**Pipeline fails at SSH deploy step**
- Verify `EC2_SSH_KEY` secret contains the full `.pem` file contents including the header/footer lines
- Check that port 22 is open in your EC2 security group

**App loads but API calls fail**
- SSH into EC2 and run `docker compose -f docker-compose.prod.yml logs backend`
- Verify the `MONGO_URL` environment variable uses the service name `mongo`, not `localhost`

**Containers not starting after deployment**
- Run `docker compose -f docker-compose.prod.yml ps` on EC2 to see container states
- Check logs with `docker compose -f docker-compose.prod.yml logs`

**MongoDB data lost after redeployment**
- Confirm the named volume exists: `docker volume ls | grep mongo`
- The volume should persist across `docker compose down` unless `-v` flag was used

---

## Future Improvements

- **HTTPS/TLS** — add a domain name and provision a Let's Encrypt certificate via Certbot or use AWS Certificate Manager with a load balancer
- **Health checks** — add Docker Compose health checks so the backend only starts after MongoDB is ready, and the frontend only starts after the backend is healthy
- **Environment-based secrets** — move `MONGO_URL` and `JWT_SECRET` to a secrets manager (AWS Secrets Manager or HashiCorp Vault) instead of compose environment variables
- **Container orchestration** — migrate from Docker Compose to Kubernetes (EKS) for horizontal scaling, self-healing, and rolling deployments
- **Monitoring and observability** — add Prometheus for metrics scraping, Grafana for dashboards, and Loki for log aggregation
- **Multi-environment pipeline** — add a `staging` branch that deploys to a separate EC2 instance for testing before production
- **Database backups** — schedule automated MongoDB dumps to an S3 bucket

---

## Author

**Chidubem Okoli** — DevOps Engineer  
[GitHub](https://github.com/Duubemmm) · [LinkedIn](https://linkedin.com/in/chidubem-okoli)