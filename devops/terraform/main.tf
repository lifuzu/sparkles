
# Configure the DigitalOcean Provider
provider "digitalocean" {
  token = "${var.do_token}"
}

locals {
  pvt_key = "${var.SECRET_PATH}/.ssh/id_rsa.insecure"
}

# Create a web server
resource "digitalocean_droplet" "web" {
  # ...
  image = "ubuntu-18-04-x64"
  name = "web"
  region = "sfo2"
  size = "512mb"
  private_networking = false
  ssh_keys = [
    "${var.ssh_fingerprint}"
  ]

  provisioner "remote-exec" {
    inline = [
      "export PATH=$PATH:/usr/local/bin",

      # install docker
      "apt update",
      "apt install -y docker.io",
      "docker --version",

      # install docker-compose
      "curl -L https://github.com/docker/compose/releases/download/1.22.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose",
      "chmod +x /usr/local/bin/docker-compose",
      "docker-compose --version",

      # launch restapi service
      "mkdir -p services/restapi",
      "curl -L https://raw.githubusercontent.com/lifuzu/sparkles/master/devops/docker-compose/docker-compose.yml -o services/restapi/docker-compose.yml",
      "mkdir -p /data/restapi",
      "cd services/restapi",
      "docker-compose up -d"
    ]

    connection {
      user = "root"
      type = "ssh"
      private_key = "${file(local.pvt_key)}"
      timeout = "2m"
    }
  }
}
