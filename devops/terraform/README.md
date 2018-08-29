
### Plan
```
$ terraform plan
```

### Create
```
$ terraform apply

# OR
$ TF_VAR_SECRET_PATH=... terraform apply -var-file="${TF_VAR_SECRET_PATH}/terraform.tfvars"

# For example:
$ TF_VAR_SECRET_PATH=/Users/rili/Workspace/Secure/sparkle_secret terraform apply -var-file="${TF_VAR_SECRET_PATH}/terraform.tfvars"
```

### Show state
```
$ terraform show terraform.tfstate
```

### Destroy
```
$ terraform destroy

# OR
$ TF_VAR_SECRET_PATH=... terraform destroy -var-file="${TF_VAR_SECRET_PATH}/terraform.tfvars"
```