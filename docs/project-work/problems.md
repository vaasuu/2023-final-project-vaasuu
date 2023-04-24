## Problems

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
