# Node.js App on AWS (EC2 + S3 + ALB)

This is a small project I built while learning AWS — deploying a Node.js app on EC2, connecting it to S3 through an IAM role (no hardcoded keys), and putting it behind an Application Load Balancer.

## Architecture

![Architecture Diagram](architecture-diagram.svg)

Traffic comes in through the ALB, gets routed to the EC2 instance running the Node.js app, and the app reads from S3 using permissions granted by an IAM role attached to the instance. CloudWatch keeps an eye on the instance.

## Stack

- EC2 (Amazon Linux 2023, t2.micro)
- Node.js + Express
- S3
- Application Load Balancer
- IAM Role (least-privilege, no access keys in code)
- CloudWatch
- PM2 to keep the app running

## What's in here

- Launched an EC2 instance with a custom security group and a user-data script that installs Node.js on boot
- Created an IAM role and attached it to the instance so it can talk to S3 without any credentials stored in the app
- Wrote a small Express app with a `/list-files` route that fetches objects from an S3 bucket
- Ran the app with PM2 so it survives SSH disconnects and reboots
- Set up a target group + ALB in front of the instance and confirmed it routes traffic correctly
- Installed the CloudWatch agent to ship logs

## Why the resources aren't live

I tore down the EC2 instance, ALB, and target group after testing everything end-to-end — mainly to avoid running up a bill for a learning project. Everything here was actually deployed and verified before being deleted: I hit the app through both the EC2 public IP and the ALB DNS name, and confirmed `/list-files` returned real objects from the bucket via the IAM role.

The code and setup steps below are exactly what was used, so it's reproducible if you want to spin it up yourself.

## Setup

1. Create an IAM role with `AmazonS3FullAccess` and `CloudWatchAgentServerPolicy`, and note it down.
2. Launch a `t2.micro` EC2 instance, attach the role, open ports 22/80/3000 in the security group, and use a user-data script to install Node.js and git.
3. Create an S3 bucket in the same region.
4. SSH in, clone this repo, `npm install`, update the bucket name in `app.js`, and run it with PM2.
5. Create a target group (port 3000) and an ALB pointing to it.
6. Install the CloudWatch agent on the instance and point it at your logs.

## Things I'd do differently next time

- Automate this with Terraform instead of clicking through the console
- Add a GitHub Actions workflow to deploy on push
- Move off the AWS SDK v2 (it's deprecated) to v3

---
Author: Arslan Project Type: Personal DevOps learning project
