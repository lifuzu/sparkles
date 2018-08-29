# Set the variable value in *.tfvars file
# or using -var="do_token=..." CLI option

variable "SECRET_PATH" {}

variable "do_token" {}

variable "ssh_fingerprint" {
  type = "string"
  default = "e5:5a:dc:33:31:5a:33:e4:e4:d8:22:e2:5a:45:74:5f"
}


output "ip" {
  value = "${digitalocean_droplet.web.ipv4_address}"
}
