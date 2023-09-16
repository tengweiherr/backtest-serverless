terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.15.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.2.0"
    }
    # mongodbatlas = {
    #   source = "mongodb/mongodbatlas"
    #   version = "1.9.0"
    # }
  }

}

provider "aws" {
  region = "us-east-1"
}

# provider "mongodbatlas" {
#   public_key = var.mongodb_atlas_public_key
#   private_key = var.mongodb_atlas_private_key
# }