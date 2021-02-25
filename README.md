# Terrastrator - The Terraform CLI Orchestrator
 
This is Terrastrator, it’s a CLI that was created in order to help people in executing Terraform modules and scripts with less effort, making the Terraform processes of init, apply, configuring credentials and backend in an automated way. For example, you are working together with your team in a Terraform module, before effectively running that, you need to make sure that some constraints are defined, and set properly, for example:

* Set AWS access key and secret key as environment variables
* Init the terraform script
* Configure the backend with the proper state bucket 
* Apply Terraform script 

All those settings usually are done in a manually way for each of the developers of the Terraform script, and there might be the risk of doing something wrong, and also pointing the backend to a wrong location. Additionally, another problem that may happen it’s when you have multiple terraform modules and scripts. In this part specifically, the orchestrator helps also in organizing each of the modules, and execute them.

It's designed to execute Terraform modules in a simple way,
specially for users that are not used to the Terraform, the user only needs to install it, select the service to be deployed,
change the variables, and execute it. Why? Because in order to execute Terraform, mainly for users that are new to that tool,
there are a lot of things that are needed to set up, this orchestrator helps in abstracting this part.

So, an abstraction of the Terraform modules and scripts were created, where a shell script controls everything that is being executed, 
where the user just have to change the desired variables for the current project's running environment, and run the
shell script passing the environment that he wants, the current project(vendor), and the Terraform component(application of the modules and layers).

Another reason that this orchestrator was built, it's because Terraform has a very good way of versioning and saving the state
of the resources that has been built, using the state files. They can be saved locally, and in s3, or another kind of storage.
Ideally, in a project with more than 1 developer, they should share a single state file, and saving it on S3 it's the correspondent 
good practice for that, but we have found that sometimes developers make mistake in setting this bucket, so the orchestrator also
comes to help in centralizing the creation of the resources in a single bucket, and developers don't need to worry
to set up that.

# Tools Needed For Running this CLI

- NPM installed on the machine 
- Terraform cli installed 

# How to Install it 

The Terrastrator CLI is a NPM package, so you just need to run the following command:
```bash
npm install -g @felipemeriga/terrastrator
```

After installing it, you would be able to run it.

# How To Run it
You just need to simply run the command:
```bash
terrastrator
```

# What Happens When I First Run Terrastrator

This tool works over the concept of projects, this means that  when you run that CLI, the Terrastrator will 
check if you are already inside a Terrastrator project, if you are inside a valid project folder, Terrastrator will
run normally and execute the modules that the user wants, in the case the current directory is not a Terrastrator project,
it will ask the user to create a new project, and will create a new folder for that. 

The Terrastrator Project Structure is compounded by:
- terrastrator.yaml: Here is where some configurations like name, region state-bucket of your project is saved.
- layers: A folder for each of the Terraform layers(modules).
- environments: A folder for each of the Environments, where there will be the variables that will be applied to the Terraform modules for each of the environments(stages).

Terrastrator already comes with some embedded layers within that, but you can also add your own ones.

## How is it Structured?

The Terrastrator is based on two existing folders, the layers and environments.
The layers represents which kind of resources you want to create, and environments the 
variables and scripts that are going to be used by the terraform process.
 
 
For example, inside the layers folder, you will find a folder for the all respective AWS modules 
that we have available, you might find a folder called RDS, the layer rds will build the RDS service
when executed, inside the RDS layer folder, there are some terraform files pointing to our module. Then,
imagine that you want to use this RDS layer, inside the environments folder, both in dev/prod/tst folder there will be
a file called rds.tf, where all the variables that are going to be used on the RDS layer creation are located, 
you just need to modify it. 
 
 So, summarizing, if you want to create a RDS layer, for the environment dev, just go to
 environments -> dev -> rds.tf and modify the values that follows your requirements.
 
## Create a New Project

Just run the terrastrator command under a directory that does not contain a Terrastrator project, and then some questions
will be asked, like the name of the project, the state bucket, and region.

The state bucket, is the bucket where the Terraform state files are going to be saved, it has to be a valid bucket
within your account.

## After Creating A New Project

Inside a Terrastrator project, just run the terrastrator command, that the cli will automatically fetch the information
from terrastrator.yaml, and will initialize the CLI, first some validations will be done, like checking the AWS Access key and
secret key, checking if the bucket exists, and another ones.

Do not worry, since this is an automated process, in the case something goes wrong, like your AWS access key and secret keys are invalid,
we also automatically help you in configuring this, so you don't waste time configuring another time.

After all validations passed, then Terrastrator will automatically fetch the available layers inside layers folder, and will
ask you which one you want to run.

Further, Terrastrator will fetch automatically the available environemnts, and ask you which one you want to run.

Finally it will be asked which Terraform action do you want to execute, and then Terraform gets executed.

## What Does the Environments Has to do With Layers, and How I Interact With Them

The layers are effectively the Terraform modules, like a Terraform script for vpc, rds or ec2. They are organized per folders,
there are several layers that comes by default with that orchestrator. Here it's the structure:
- layers
    - vpc
        - main.tf
        - variables.tf
        - outputs.tf
    - s3 
        - main.tf
        - variables.tf
        - outputs.tf
    - ec2
        - main.tf
        - variables.tf
        - outputs.tf
        
This means that we currently have 3 layers, vpc, ec2 and s3, inside each folder you can have as many terraform scripts you want,
and you can modify everything, just the backend configuration that you have to leave as:
```hcl-terraform
terraform {
  backend "s3" {
  }
}
```

The environments it's the variables that are going to be injected under the layers, they are structure like this:
- environments
    - dev
        - vpc.tf
        - s3.tf
        - ec2.tf
    - prod
        - vpc.tf
        - s3.tf
        - ec2.tf
        
So if you want to edit the variables for VPC layer and dev environment, just edit the vpc.tf file under environments/dev/.

Basically when you run Terrastrator, it will ask you which Layer and Environment, the CLI automatically fetches all the folders
all ask you which one you want to run. So if you select VPC and dev environment, Terrastrator, will go 
into VPC layer directory, build the backend with Terraform init, and them will inject the variables defined in environments/dev/vpc.tf.

Bear in mind that the name of the file inside the environment folder needs to be the same name as the layer, for example
you can add new layers, if you add a new folder inside layers for ECS service, you will need to create the files in this following way:
- layers
    - ecs
        - ...terraform files
- environments
    - dev
        - ecs.tf
    - prod
        - ecs.tf
        
You can also create as many environments you want, and override the default ones, just remember that the variable file inside
the environment, needs to have the same name of the layer.

## Command Line Arguments

It's not required to pass command line arguments, Terraform will ask you all the questions to ensure that 
you are going to run the proper terraform code. But in the case you want to skip those questions, and run it straightaway.

-     --action --> plan, push, apply, destroy
-     --environment --> dev, prod, test
-     --layer --> vpc, vpn, rds, ec2
-     -x --> extra options: terraform args (optional)
        
## How are the State Files Organized in the S3 Bucket?

The state files are saved in a very organized way in S3, the orchestrator organizes the state files based on the
following parameters:
- layer: The layer that is going to be ran (rds, vpc, vpn).
- Environment: The stage of the infrastructure (Development, QA, Production).

The key for saving the state files, which means, the path where the state files will be saved, will have this following
structure:
```
{PROJECT_NAME}/{ENVIRONMENT}/{LAYER}/{.tfstate}
```

So imagine that we are running the layer vpc, in development stage, for project test, the key will be:
```
test/dev/vpc/.tfstate
```

This structure is good, because in the same infrastructure bucket, you can have all the projects, with all infrastructure inside
that.
