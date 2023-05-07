# Usage

Default ports are listed below. You can change them in the `.env` file.

## Default ports

| Service        | URL                   |
| -------------- | --------------------- |
| Backend        | http://localhost:3000 |
| Frontend       | http://localhost:5173 |
| MailDev UI     | http://localhost:1080 |
| Adminer        | http://localhost:8080 |
| MailDev (smtp) | localhost:1025        |
| Database       | localhost:3306        |

MailDev is a fake SMTP server that catches all the emails sent by the backend. You can view them in the MailDev UI. This is useful for testing the forgot password functionality.
