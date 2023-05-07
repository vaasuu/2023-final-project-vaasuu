# Setup

## Production

If using the [`db/init-scripts/prod/init_prod.sql`](db/init-scripts/prod/init_prod.sql) script, you need to manually add the admin user to the database.

```sql
INSERT INTO `user_roles` (`user_id`, `role_id`)
VALUES ('<USER-ID-HERE>', 2);
```
