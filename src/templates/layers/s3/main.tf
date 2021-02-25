


terraform {
  backend "s3" {

  }
}

provider "aws" {
  region = var.region
}


module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"
  bucket = var.name
  acl    = "private"
  server_side_encryption_configuration = {
    rule = {
      apply_server_side_encryption_by_default = {
        sse_algorithm = "AES256"
      }
    }
  }

}
