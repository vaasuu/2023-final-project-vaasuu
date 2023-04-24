## Problems

### Jest test failing randomly

I had some problems with the tests failing randomly. I had a test that would fail sometimes, and sometimes it would pass.
It was caused by async code that was not properly awaited.

#### Solution

`jest`'s `--detectOpenHandles` flag helped me during troubleshooting. It showed me that there was an open handle, which was causing the issue.
Also `--detectLeaks` was helpful, as it showed me that there was a memory leak, which was the same async code. This took me a while to solve.

I also noticed that the example code from the lecture had the same problem but it was not so obvious as it was only a few tests instead of 50+ I have here.

### Timezone

I had some problems with the timezone. I had failing tests and timestamps were off by 2-3 hours.

The reason for this was that node-mysql2 client uses the local timezone, and conversions happen when the database is in a different timezone than the client.

#### Solution

I solved this by setting the timezone manually to GMT+0/UTC, wherever I could set it. This fixed the problem. I had to manually add the TZ environment variable to the node start scripts to make it work locally as well.

#### Mysql vs MariaDB

I started developing this project with MySQL, but switched to MariaDB because it's so much lighter on resources.
I was going to use the TAMK MySQL server, so I tested my complete SQL queries on MySQL and found out that they didn't work on MySQL.
Main problem was that MySQL returned JSON as a actual JSON Object, while MariaDB returned it as a string of the JSON, so my parsing code didn't work.

#### Solution

I had to then rewrite some parts of the code to make it work on MySQL. As a compromise, I switched dev environment to MySQL, even though it's heavier on resources.
I could probably have made it work the same on both, as I know MariaDB can fake being MySQL, but I didn't have time to do that.

### TAMK MySQL server

TAMK's mysql server does not grant me the necessary permissions to use it for this project. Can't bypass it as I don't have SUPER user priviledges.

```
bash-4.4# mysql -u hkvahu -h mydb.tamk.fi -p dbhkvahu2
Enter password:
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Welcome to the MySQL monitor.  Commands end with ; or \g.
Your MySQL connection id is 22621
Server version: 5.7.41-0ubuntu0.18.04.1-log (Ubuntu)

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> SHOW GRANTS;
+-------------------------------------------------------------------------+
| Grants for hkvahu@%                                                     |
+-------------------------------------------------------------------------+
| GRANT USAGE ON *.* TO 'hkvahu'@'%'                                      |
| GRANT ALL PRIVILEGES ON `dbhkvahu2`.* TO 'hkvahu'@'%' WITH GRANT OPTION |
| GRANT ALL PRIVILEGES ON `dbhkvahu1`.* TO 'hkvahu'@'%' WITH GRANT OPTION |
+-------------------------------------------------------------------------+
3 rows in set (0.01 sec)
```

### Example of the problem

```sql
mysql> CREATE TRIGGER `user_default_role`
    -> AFTER
    -> INSERT ON `users` FOR EACH ROW
    -> INSERT INTO `user_roles` (`user_id`)
    -> VALUES (NEW.id);
ERROR 1419 (HY000): You do not have the SUPER privilege and binary logging is enabled (you *might* want to use the less safe log_bin_trust_function_creators variable)
```

### As I don't have admin/super permissions, I can't fix it.

```sql
mysql> SET log_bin_trust_function_creators = 1;
ERROR 1229 (HY000): Variable 'log_bin_trust_function_creators' is a GLOBAL variable and should be set with SET GLOBAL
mysql> SET GLOBAL log_bin_trust_function_creators = 1;
ERROR 1227 (42000): Access denied; you need (at least one of) the SUPER privilege(s) for this operation
mysql> GRANT SUPER ON `dbhkvahu2`.* TO 'hkvahu'@'%';
ERROR 1045 (28000): Access denied for user 'hkvahu'@'%' (using password: YES)
```

#### Solution

My solution was to use AWS RDS instead.

And because I'm obsessed with spending _more_ time on this project, I also created a [terraform](https://www.terraform.io/) script to create the RDS instance, just because I wanted to try it out.

I had some problems at first with the creads, but managed to fix it by reading the [AWS terraform provider documentation](https://registry.terraform.io/providers/hashicorp/aws/latest/docs#provider-configuration) (I had the wrong field name for the `token` field).
