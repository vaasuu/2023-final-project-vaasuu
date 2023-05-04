# Some stuff I learned during this project

## SQL Triggers

I hadn't used triggers before, so I had to learn how to use them. I use them to add a default role to users and to update the listing updated_at timestamp when a listing's category, pictures are updated.

## Terraform

Created a [super simple terraform script to create a new RDS instance](../../terraform/) with the help of [this article](https://dev.to/aws-builders/create-a-mysql-rds-database-instance-with-terraform-3oab). It's not super useful, but it was a good learning experience and I needed to create the RDS instance anyway.

<details>

<summary>terraform plan and apply outputs</summary>

```bash
valtteri@Hackintosh:terraform$ terraform plan

Terraform used the selected providers to generate the following execution plan.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # aws_db_instance.myinstance will be created
  + resource "aws_db_instance" "myinstance" {
      + address                               = (known after apply)
      + allocated_storage                     = 20
      + apply_immediately                     = false
      + arn                                   = (known after apply)
      + auto_minor_version_upgrade            = true
      + availability_zone                     = (known after apply)
      + backup_retention_period               = (known after apply)
      + backup_window                         = (known after apply)
      + ca_cert_identifier                    = (known after apply)
      + character_set_name                    = (known after apply)
      + copy_tags_to_snapshot                 = false
      + db_name                               = (known after apply)
      + db_subnet_group_name                  = (known after apply)
      + delete_automated_backups              = true
      + endpoint                              = (known after apply)
      + engine                                = "mysql"
      + engine_version                        = "5.7"
      + engine_version_actual                 = (known after apply)
      + hosted_zone_id                        = (known after apply)
      + id                                    = (known after apply)
      + identifier                            = "marketplace-db-prod"
      + identifier_prefix                     = (known after apply)
      + instance_class                        = "db.t2.micro"
      + iops                                  = (known after apply)
      + kms_key_id                            = (known after apply)
      + latest_restorable_time                = (known after apply)
      + license_model                         = (known after apply)
      + listener_endpoint                     = (known after apply)
      + maintenance_window                    = (known after apply)
      + master_user_secret                    = (known after apply)
      + master_user_secret_kms_key_id         = (known after apply)
      + monitoring_interval                   = 0
      + monitoring_role_arn                   = (known after apply)
      + multi_az                              = (known after apply)
      + name                                  = (known after apply)
      + nchar_character_set_name              = (known after apply)
      + network_type                          = (known after apply)
      + option_group_name                     = (known after apply)
      + parameter_group_name                  = "default.mysql5.7"
      + password                              = (sensitive value)
      + performance_insights_enabled          = false
      + performance_insights_kms_key_id       = (known after apply)
      + performance_insights_retention_period = (known after apply)
      + port                                  = (known after apply)
      + publicly_accessible                   = true
      + replica_mode                          = (known after apply)
      + replicas                              = (known after apply)
      + resource_id                           = (known after apply)
      + skip_final_snapshot                   = true
      + snapshot_identifier                   = (known after apply)
      + status                                = (known after apply)
      + storage_throughput                    = (known after apply)
      + storage_type                          = (known after apply)
      + tags_all                              = (known after apply)
      + timezone                              = (known after apply)
      + username                              = "dbuser"
      + vpc_security_group_ids                = (known after apply)
    }

  # aws_security_group.rds_sg will be created
  + resource "aws_security_group" "rds_sg" {
      + arn                    = (known after apply)
      + description            = "Managed by Terraform"
      + egress                 = [
          + {
              + cidr_blocks      = [
                  + "0.0.0.0/0",
                ]
              + description      = ""
              + from_port        = 0
              + ipv6_cidr_blocks = []
              + prefix_list_ids  = []
              + protocol         = "-1"
              + security_groups  = []
              + self             = false
              + to_port          = 0
            },
        ]
      + id                     = (known after apply)
      + ingress                = [
          + {
              + cidr_blocks      = [
                  + "0.0.0.0/0",
                ]
              + description      = ""
              + from_port        = 3306
              + ipv6_cidr_blocks = []
              + prefix_list_ids  = []
              + protocol         = "tcp"
              + security_groups  = []
              + self             = false
              + to_port          = 3306
            },
        ]
      + name                   = "rds_sg"
      + name_prefix            = (known after apply)
      + owner_id               = (known after apply)
      + revoke_rules_on_delete = false
      + tags_all               = (known after apply)
      + vpc_id                 = (known after apply)
    }

Plan: 2 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  + db_instance_endpoint = (known after apply)
  + security_group_id    = (known after apply)

───────────────────────────────────────────────────────────────────────────────

Note: You didn't use the -out option to save this plan, so Terraform can't
guarantee to take exactly these actions if you run "terraform apply" now.
valtteri@Hackintosh:terraform$ terraform apply

Terraform used the selected providers to generate the following execution plan.
Resource actions are indicated with the following symbols:
  + create

Terraform will perform the following actions:

  # aws_db_instance.myinstance will be created
  + resource "aws_db_instance" "myinstance" {
      + address                               = (known after apply)
      + allocated_storage                     = 20
      + apply_immediately                     = false
      + arn                                   = (known after apply)
      + auto_minor_version_upgrade            = true
      + availability_zone                     = (known after apply)
      + backup_retention_period               = (known after apply)
      + backup_window                         = (known after apply)
      + ca_cert_identifier                    = (known after apply)
      + character_set_name                    = (known after apply)
      + copy_tags_to_snapshot                 = false
      + db_name                               = (known after apply)
      + db_subnet_group_name                  = (known after apply)
      + delete_automated_backups              = true
      + endpoint                              = (known after apply)
      + engine                                = "mysql"
      + engine_version                        = "5.7"
      + engine_version_actual                 = (known after apply)
      + hosted_zone_id                        = (known after apply)
      + id                                    = (known after apply)
      + identifier                            = "marketplace-db-prod"
      + identifier_prefix                     = (known after apply)
      + instance_class                        = "db.t2.micro"
      + iops                                  = (known after apply)
      + kms_key_id                            = (known after apply)
      + latest_restorable_time                = (known after apply)
      + license_model                         = (known after apply)
      + listener_endpoint                     = (known after apply)
      + maintenance_window                    = (known after apply)
      + master_user_secret                    = (known after apply)
      + master_user_secret_kms_key_id         = (known after apply)
      + monitoring_interval                   = 0
      + monitoring_role_arn                   = (known after apply)
      + multi_az                              = (known after apply)
      + name                                  = (known after apply)
      + nchar_character_set_name              = (known after apply)
      + network_type                          = (known after apply)
      + option_group_name                     = (known after apply)
      + parameter_group_name                  = "default.mysql5.7"
      + password                              = (sensitive value)
      + performance_insights_enabled          = false
      + performance_insights_kms_key_id       = (known after apply)
      + performance_insights_retention_period = (known after apply)
      + port                                  = (known after apply)
      + publicly_accessible                   = true
      + replica_mode                          = (known after apply)
      + replicas                              = (known after apply)
      + resource_id                           = (known after apply)
      + skip_final_snapshot                   = true
      + snapshot_identifier                   = (known after apply)
      + status                                = (known after apply)
      + storage_throughput                    = (known after apply)
      + storage_type                          = (known after apply)
      + tags_all                              = (known after apply)
      + timezone                              = (known after apply)
      + username                              = "dbuser"
      + vpc_security_group_ids                = (known after apply)
    }

  # aws_security_group.rds_sg will be created
  + resource "aws_security_group" "rds_sg" {
      + arn                    = (known after apply)
      + description            = "Managed by Terraform"
      + egress                 = [
          + {
              + cidr_blocks      = [
                  + "0.0.0.0/0",
                ]
              + description      = ""
              + from_port        = 0
              + ipv6_cidr_blocks = []
              + prefix_list_ids  = []
              + protocol         = "-1"
              + security_groups  = []
              + self             = false
              + to_port          = 0
            },
        ]
      + id                     = (known after apply)
      + ingress                = [
          + {
              + cidr_blocks      = [
                  + "0.0.0.0/0",
                ]
              + description      = ""
              + from_port        = 3306
              + ipv6_cidr_blocks = []
              + prefix_list_ids  = []
              + protocol         = "tcp"
              + security_groups  = []
              + self             = false
              + to_port          = 3306
            },
        ]
      + name                   = "rds_sg"
      + name_prefix            = (known after apply)
      + owner_id               = (known after apply)
      + revoke_rules_on_delete = false
      + tags_all               = (known after apply)
      + vpc_id                 = (known after apply)
    }

Plan: 2 to add, 0 to change, 0 to destroy.

Changes to Outputs:
  + db_instance_endpoint = (known after apply)
  + security_group_id    = (known after apply)

Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes

aws_security_group.rds_sg: Creating...
aws_security_group.rds_sg: Creation complete after 4s [id=sg-0de2ad8fbdc4cecfd]
aws_db_instance.myinstance: Creating...
aws_db_instance.myinstance: Still creating... [10s elapsed]
aws_db_instance.myinstance: Still creating... [20s elapsed]
aws_db_instance.myinstance: Still creating... [30s elapsed]
aws_db_instance.myinstance: Still creating... [40s elapsed]
aws_db_instance.myinstance: Still creating... [50s elapsed]
aws_db_instance.myinstance: Still creating... [1m0s elapsed]
aws_db_instance.myinstance: Still creating... [1m10s elapsed]
aws_db_instance.myinstance: Still creating... [1m20s elapsed]
aws_db_instance.myinstance: Still creating... [1m30s elapsed]
aws_db_instance.myinstance: Still creating... [1m40s elapsed]
aws_db_instance.myinstance: Still creating... [1m50s elapsed]
aws_db_instance.myinstance: Still creating... [2m0s elapsed]
aws_db_instance.myinstance: Still creating... [2m10s elapsed]
aws_db_instance.myinstance: Still creating... [2m20s elapsed]
aws_db_instance.myinstance: Still creating... [2m30s elapsed]
aws_db_instance.myinstance: Still creating... [2m40s elapsed]
aws_db_instance.myinstance: Still creating... [2m50s elapsed]
aws_db_instance.myinstance: Still creating... [3m0s elapsed]
aws_db_instance.myinstance: Still creating... [3m10s elapsed]
aws_db_instance.myinstance: Still creating... [3m20s elapsed]
aws_db_instance.myinstance: Still creating... [3m30s elapsed]
aws_db_instance.myinstance: Still creating... [3m40s elapsed]
aws_db_instance.myinstance: Still creating... [3m50s elapsed]
aws_db_instance.myinstance: Still creating... [4m0s elapsed]
aws_db_instance.myinstance: Still creating... [4m10s elapsed]
aws_db_instance.myinstance: Still creating... [4m20s elapsed]
aws_db_instance.myinstance: Creation complete after 4m28s [id=marketplace-db-prod]

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.

Outputs:

db_instance_endpoint = "marketplace-db-prod.cefzhz3c1sq9.us-east-1.rds.amazonaws.com:3306"
security_group_id = "sg-0de2ad8fbdc4cecfd"
valtteri@Hackintosh:terraform$
```

</section>
</details>

## More React stuff

- React router v6
- React query
- React hook form
- misc stuff

## Testing

- React Testing Library & Vitest
- Cypress
