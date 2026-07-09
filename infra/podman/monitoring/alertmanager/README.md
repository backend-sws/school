# Alertmanager config

Alerts are sent to **sutracodehq@gmail.com** via **Mailtrap SMTP** (`sandbox.smtp.mailtrap.io:2525`).

- **From address:** aleartcollege@sutracode.in  
- **From name:** College name when the alert has a `college` label (e.g. ptjmrajgir), otherwise "CMS".  
- **Subject:** `[<college>] <alertname>` so you can see which college triggered the alert.

**Note:** Mailtrap *sandbox* is for testing — it catches emails and does not deliver to real inboxes. For production delivery to sutracodehq@gmail.com, use Mailtrap's sending domain, Gmail SMTP, or another SMTP provider and update `alertmanager.yml` on the VPS.

Access: local-only via SSH tunnel (`-L 9093:127.0.0.1:9093`).
