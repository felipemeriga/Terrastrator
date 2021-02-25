variable "region" {
  description = "The aws region to deploy the resources"
  type = string
}

variable "layer" {
  description = "The layer that is being run"
  type = string
}

variable "state_bucket" {
  description = "State bucket where the state files of the layers are saved"
  type = string
}

variable "environment" {
  description = "The environment where this layer is being run"
  type = string
}

variable "name" {
  description = "The name of your s3 bucket"
  type = string
}
