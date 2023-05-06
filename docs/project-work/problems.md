# Problems I encountered during development

## Jest test failing randomly

I had some problems with the tests failing randomly. I had a test that would fail sometimes, and sometimes it would pass.
It was caused by async code that was not properly awaited.

### Solution

`jest`'s `--detectOpenHandles` flag helped me during troubleshooting. It showed me that there was an open handle, which was causing the issue.
Also `--detectLeaks` was helpful, as it showed me that there was a memory leak, which was the same async code. This took me a while to solve.

I also noticed that the example code from the lecture had the same problem but it was not so obvious as it was only a few tests instead of 50+ I have here.

## Timezone

I had some problems with the timezone. I had failing tests and timestamps were off by 2-3 hours.

The reason for this was that node-mysql2 client uses the local timezone, and conversions happen when the database is in a different timezone than the client.

### Solution

I solved this by setting the timezone manually to GMT+0/UTC, wherever I could set it. This fixed the problem. I had to manually add the TZ environment variable to the node start scripts to make it work locally as well.

## Mysql vs MariaDB

I started developing this project with MySQL, but switched to MariaDB because it's so much lighter on resources.
I was going to use the TAMK MySQL server, so I tested my complete SQL queries on MySQL and found out that they didn't work on MySQL.
Main problem was that MySQL returned JSON as a actual JSON Object, while MariaDB returned it as a string of the JSON, so my parsing code didn't work. Also problems with the stricter default SQL_MODE on MySQL.

### Solution

I had to then rewrite some parts of the code to make it work on MySQL. As a compromise, I switched dev environment to MySQL, even though it's heavier on resources.
I could probably have made it work the same on both, as I know MariaDB can fake being MySQL, but I didn't have time to do that.

## TAMK MySQL server

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

### Problem with email e2e tests on GitHub Actions

They were failing on GitHub Actions, but not locally.
I spent a lot of time trying to figure out why, but the problem was that the email server was running on the wrong port! Stupid me!

I had changed the SMTP port to `10025` for tests in `backend/.env.test`, so test runs would not overlap with development mail server on `1025`, but I forgot to change it in the GitHub Actions workflow file. So the tests were trying to connect to the wrong port. I was running SMTP server on `maildev` default port 1025. :facepalm: :facepalm: :facepalm:
Tests were passing locally because I was running things in dev mode, not test mode, so `.env` was used instead of `.env.test`.

### Discovery and solution

I discovered the problem by sshing into the GitHub Actions runner and looking at `lsof -P -i -n` output. and logs.

I fixed it by changing the port to the correct one.

<details>
<summary>SSH log session on GH Actions runner</summary>

```
runner@fv-az618-408:~/work/2023-final-project-vaasuu/2023-final-project-vaasuu$ lsof -P -i -n
COMMAND    PID   USER   FD   TYPE DEVICE SIZE/OFF NODE NAME
Runner.Li 1524 runner   93u  IPv6  24103      0t0  TCP 10.1.0.76:48256->13.107.42.16:443 (ESTABLISHED)
Runner.Li 1524 runner   95u  IPv6  24711      0t0  TCP 10.1.0.76:48270->13.107.42.16:443 (ESTABLISHED)
Runner.Wo 1539 runner   94u  IPv6  24130      0t0  TCP 10.1.0.76:48280->13.107.42.16:443 (ESTABLISHED)
Runner.Wo 1539 runner  105u  IPv6  24763      0t0  TCP 10.1.0.76:58582->13.107.42.16:443 (ESTABLISHED)
Runner.Wo 1539 runner  119u  IPv6  25155      0t0  TCP 10.1.0.76:49958->13.107.42.16:443 (ESTABLISHED)
mysqld    1637 runner   20u  IPv6  25854      0t0  TCP *:33060 (LISTEN)
mysqld    1637 runner   23u  IPv6  25857      0t0  TCP *:3306 (LISTEN)
node      1919 runner   18u  IPv4  25240      0t0  TCP 127.0.0.1:1080 (LISTEN)
node      1919 runner   19u  IPv4  25241      0t0  TCP 127.0.0.1:1025 (LISTEN)
node      1940 runner   18u  IPv6  26291      0t0  TCP *:3000 (LISTEN)
node      1969 runner   24u  IPv6  26308      0t0  TCP [::1]:5173 (LISTEN)
upterm    2020 runner    9u  IPv4  25501      0t0  TCP 10.1.0.76:41304->37.16.25.99:22 (ESTABLISHED)
runner@fv-az618-408:~/work/2023-final-project-vaasuu/2023-final-project-vaasuu$
runner@fv-az618-408:~/work/2023-final-project-vaasuu/2023-final-project-vaasuu$ cat backend/app.log
{"level":"info","message":"Server is running on port 3000","timestamp":"2023-05-05T23:14:21.134Z"}
runner@fv-az618-408:~/work/2023-final-project-vaasuu/2023-final-project-vaasuu$ curl -v localhost:1080/email
*   Trying 127.0.0.1:1080...
* Connected to localhost (127.0.0.1) port 1080 (#0)
> GET /email HTTP/1.1
> Host: localhost:1080
> User-Agent: curl/7.81.0
> Accept: */*
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 200 OK
< X-Powered-By: Express
< Access-Control-Allow-Origin: *
< Content-Type: application/json; charset=utf-8
< Content-Length: 2
< ETag: W/"2-l9Fw4VUO7kr8CvBlt4zaMCqXZ0w"
< Vary: Accept-Encoding
< Date: Fri, 05 May 2023 23:15:56 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
* Connection #0 to host localhost left intact
[]runner@fv-az618-408:~/work/2023-final-project-vaasuu/2023-final-project-vaasuucurl -v localhost:3000/api/v1/password-reset/send-reset-email -d '{"email":"john.smith@example.com"}' -H 'Content-Type: application/json'n'
*   Trying 127.0.0.1:3000...
* Connected to localhost (127.0.0.1) port 3000 (#0)
> POST /api/v1/password-reset/send-reset-email HTTP/1.1
> Host: localhost:3000
> User-Agent: curl/7.81.0
> Accept: */*
> Content-Type: application/json
> Content-Length: 34
>
* Mark bundle as not supporting multiuse
< HTTP/1.1 500 Internal Server Error
< X-Powered-By: Express
< Vary: Origin
< Content-Type: application/json; charset=utf-8
< Content-Length: 33
< ETag: W/"21-u8tno/8IdqEY6PFcopkQe0syfE4"
< Date: Fri, 05 May 2023 23:16:07 GMT
< Connection: keep-alive
< Keep-Alive: timeout=5
<
* Connection #0 to host localhost left intact
{"error":"Internal server error"}runner@fv-az618-408:~/work/2023-final-project-v
runner@fv-az618-408:~/work/2023-final-project-vaasuu/2023-final-project-vaasuu$ cat backend/app.log
{"level":"info","message":"Server is running on port 3000","timestamp":"2023-05-05T23:14:21.134Z"}
{"level":"info","message":"Sending password reset email. Reset token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImFhYWFhYWFhLTA2MTUtNGQwNC1hNzk1LTljNTc1NmVmNWY0YyIsImlhdCI6MTY4MzMyODU2NywiZXhwIjoxNjgzMzMwMzY3fQ._SbEmt2tCQcp5axpq1j1-M8nR0m6iN0CmoalrDDIhzM","timestamp":"2023-05-05T23:16:07.704Z"}
{"address":"127.0.0.1","code":"ESOCKET","command":"CONN","errno":-111,"level":"error","port":10025,"syscall":"connect","timestamp":"2023-05-05T23:16:07.714Z"}
```

</details>
