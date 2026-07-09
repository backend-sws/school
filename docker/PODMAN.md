# Podman (macOS / Linux)

This project works with **Docker Compose** or **Podman** using `podman compose` (or `podman-compose`).

## Default ports (to avoid conflicts)

Set in `.env` or use defaults from `docker-compose.yml`:

| Variable              | Default | Purpose                    |
|-----------------------|---------|----------------------------|
| `APP_PORT`            | 18088   | App (Nginx)                |
| `POSTGRES_HOST_PORT`  | 15432   | PostgreSQL (host)          |
| `ADMINER_PORT`        | 18090   | Adminer                    |
| `VITE_PORT`           | 15173   | Vite dev server            |

**URLs:** App → http://localhost:18088 | Adminer → http://localhost:18090

---

## "Proxy already running" or "no such container"

On macOS, Podman uses a VM and a port-forwarding proxy. If you see:

- `Error: unable to start container ... "proxy already running"`
- `Error: no container with name or ID "..." found`

do a **clean teardown and restart the Podman machine**, then bring the stack back up.

### One-time fix

```bash
# From repo root
podman compose down --remove-orphans
podman machine stop
podman machine start
podman compose up -d --build
```

Or run the helper script (from repo root):

```bash
./scripts/podman-reset-and-up.sh
```

### Why this works

- `podman compose down` removes containers so they are not left in a half-created state.
- Fixed `container_name` values have been removed from `docker-compose.yml` so Compose manages container names and lifecycle; `down`/`up` stay in sync.
- Restarting the Podman machine clears the proxy state in the VM, so port binding works again.

After that, use `podman compose up -d` (and `podman compose down`) as usual.
