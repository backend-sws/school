# Running tests with Podman

The **app container** (production image) does **not** include Node.js or PHPUnit. It uses `composer install --no-dev` and has no `npm`. Use one of the options below to run tests.

---

## Option 1: Test runner container (recommended)

Build a one-off image that has PHP and Composer, then run tests with your code mounted and dev dependencies installed inside the container.

### Quick run (script)

From the **project root**:

```bash
./infra/podman/scripts/run-tests-podman.sh
```

Use `--build` to force rebuild the test image: `./infra/podman/scripts/run-tests-podman.sh --build`.

### Manual steps

**1. Build the test image** (from project root):

```bash
podman build -f Dockerfile.test -t ems-test .
```

**2. Install dev dependencies and run PHP tests** (from project root):

```bash
podman run --rm -v "$(pwd)":/var/www/html -w /var/www/html ems-test sh -c "composer install && php artisan test"
```

- `composer install` installs dev dependencies (including PHPUnit) into `vendor/` on your host.
- `php artisan test` runs the test suite.

### 3. (Optional) Use SQLite for tests

If your app uses PostgreSQL in production but you want tests to use SQLite (no DB container needed), set this before running tests:

```bash
podman run --rm -v "$(pwd)":/var/www/html -w /var/www/html \
  -e DB_CONNECTION=sqlite \
  -e DB_DATABASE=":memory:" \
  ems-test sh -c "composer install && php artisan test"
```

Or create a `.env.testing` in the project root with:

```
APP_ENV=testing
DB_CONNECTION=sqlite
DB_DATABASE=:memory:
```

Then run the same `podman run` from step 2 (Laravel will load `.env.testing` when `APP_ENV=testing`).

### 4. Run only PHP tests (no frontend build)

- **Inside test container:**  
  `php artisan test` (or the full `sh -c "composer install && php artisan test"` above).
- **`composer test:full`** (build + tests) is **not** for the app container or the test image; it requires Node.js. Use it on the host or in a CI job that has `npm` (see Option 2).

---

## Option 2: On the host (or CI with Node)

If Podman is not required for the test run (e.g. local host or CI runner with Node and PHP):

1. **PHP-only tests**
   ```bash
   composer install
   php artisan test
   ```
   Or: `composer test`

2. **Frontend build + PHP tests**
   ```bash
   composer install
   npm ci
   composer test:full
   ```
   (`test:full` runs `npm run build` then `php artisan test`.)

---

## Option 3: One-off shell in the app container

You can install dev deps inside the **running app container** and run tests there. The app container has no Node, so only PHP tests (no `composer test:full`).

```bash
# Replace container name with your app container (e.g. ems-app-ptjmrajgir)
podman exec -it ems-app-ptjmrajgir sh

# Inside the container
cd /var/www/html
composer install
php artisan test
exit
```

- This adds dev dependencies and PHPUnit into the container’s `vendor/`. It does not change the image; the next deploy will still use the image built with `--no-dev`.
- The app container does **not** have `npm`, so do not run `composer test:full` inside it.

---

## Summary

| Where              | Command / action                                      | Build (npm) |
|--------------------|--------------------------------------------------------|-------------|
| Test image (Option 1) | `podman run ... ems-test sh -c "composer install && php artisan test"` | No          |
| Host / CI (Option 2)  | `composer install && php artisan test` or `composer test:full`         | Only with `test:full` |
| App container (Option 3) | `composer install && php artisan test` inside container          | No (npm not present) |
