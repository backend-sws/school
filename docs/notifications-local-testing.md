# Testing notifications locally

This guide helps you verify real-time (live toast) and push notifications on your machine.

## Notification registry

All notification types and their triggers are listed in **`config/notifications.php`** (key `notifications.registry`). Use it to see what sends a notification and who receives it. Types include:

| Type | Trigger | Recipients |
|------|---------|------------|
| `admission_application_submitted` | New application (desk or student) | Admission cell + applicant |
| `admission_status_changed` | Application processed | Applicant |
| `admission_payment_recorded` | Payment recorded | Applicant |
| `class_updated` | LMS class updated | Enrolled students |
| `lms_test_created` | New test created | Enrolled students |
| `lms_announcement_created` | New announcement | Enrolled students |
| `lms_assignment_created` | New assignment | Enrolled students |
| `lms_material_created` | New material | Enrolled students |
| `lms_live_session_scheduled` | Live session created | Enrolled students |
| `lms_recording_added` | Recording added | Enrolled students |
| `attendance_marked` | Daily/subject attendance saved or record updated | That student |
| `public_notice` | Notice created/updated/toggled (when published) | Targeted students |
| `test` | Dev test endpoint / artisan command | Specified user |

## 1. Prerequisites

- **Reverb** must be running so the app can broadcast and the browser can connect via WebSocket.
- **`.env`** must have broadcasting enabled and Reverb keys set.

### Option A: Docker

```bash
docker compose up -d
```

Reverb runs as the `reverb` service and listens on port 8080 (mapped to host).

### Option B: Reverb on the host

```bash
# In a separate terminal
php artisan reverb:start
```

Ensure `.env` has:

```env
BROADCAST_CONNECTION=reverb
REVERB_APP_ID=my-app-id
REVERB_APP_KEY=your-key
REVERB_APP_SECRET=your-secret
REVERB_HOST=localhost
REVERB_PORT=8080
REVERB_SCHEME=http
```

Frontend (Vite) uses the same host/port via:

```env
VITE_REVERB_APP_KEY="${REVERB_APP_KEY}"
VITE_REVERB_HOST=localhost
VITE_REVERB_PORT=8080
VITE_REVERB_SCHEME=http
```

If you use Docker for Reverb, the **browser** still connects to `localhost:8080` (exposed port). The Laravel app in Docker uses `REVERB_HOST=reverb` (set in `docker-compose.yml`).

## 2. Queue (for notifications to be sent)

Notifications are queued. For instant delivery locally, use the sync driver:

```env
QUEUE_CONNECTION=sync
```

If you use `redis` or `database`, run a worker in another terminal:

```bash
php artisan queue:work
```

## 3. Trigger a test notification

### A. From the browser (when `APP_DEBUG=true`)

1. Log in to the app.
2. Open DevTools → Console and run:

```js
fetch('/api/v1/notifications/test', {
  method: 'POST',
  headers: { 'Accept': 'application/json', 'X-XSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '' },
  credentials: 'include'
}).then(r => r.json()).then(console.log);
```

(Use your app’s CSRF token if the above doesn’t work; or use a tool like Postman with your session cookie.)

You should see a **live toast** in the same tab.

### B. From the terminal

Send a test notification to a user by ID or email:

```bash
php artisan notification:test 1
# or
php artisan notification:test "admin@example.com"
```

Optional title and body:

```bash
php artisan notification:test 1 --title="Hello" --body="This is a test."
```

Keep the app open in the browser as that user; you should get the toast when the notification is sent (and processed by the queue if not using `sync`).

## 4. Test “real” flows

| Action | Who gets the toast |
|--------|--------------------|
| Submit an admission application (student or desk) | Admission cell users + applicant |
| Update an LMS class | Students enrolled in that class |
| Mark daily attendance | Each student whose attendance was marked |
| Create or publish a notice | Targeted students (all or by stream/session) |
| Process application / record payment | Applicant |

Log in as the right user, perform the action (in another tab or via API), and watch for the toast.

## 5. Troubleshooting

- **No toast**
  - Reverb running? Check `http://localhost:8080` or the Reverb logs.
  - Browser console: look for WebSocket errors (e.g. connection refused).
  - `VITE_REVERB_APP_KEY` must be set and match `REVERB_APP_KEY` (rebuild frontend after changing: `npm run build` or use Vite dev server).
  - User must be logged in; the Echo client subscribes to `private-App.Models.User.{id}`.

- **500 when sending notification**
  - Reverb not reachable from the app (e.g. in Docker, app must use `REVERB_HOST=reverb`).
  - Set `BROADCAST_CONNECTION=null` to disable broadcasting and avoid 500 when Reverb is down; toasts will not appear but DB/push can still work.

- **Notification in DB but no toast**
  - Broadcast channel is failing (Reverb not running or not reachable from the app).
  - Frontend not connected (wrong Reverb host/port/key, or not authenticated).

- **Web push**
  - Requires HTTPS (or localhost), a service worker, and VAPID keys in `.env`. Use the in-app prompt to allow and subscribe; then send a test notification to see a system push.
