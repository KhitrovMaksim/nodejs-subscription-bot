# nodejs-subscription-bot.

## 3. Chat bots.

### 3.5 Subscription bot.

#### Task.

Create a telegram bot where users can subscribe to weather forecast notification. Every day at the chosen time at UTC timezone this bot should send what weather is expected today. Subscriptions should be stored at MongoDB. For learning purposes you should run cron and telegram bot in one process, which is bad practice, because it blocks the scaling application.
#### Bot.
```
name: KhitrovSubscriptionBot
link: http://t.me/KhitrovSubscriptionBot
```
#### How to run locally (dev)
```shell
npm run dev
```
#### How to run globally (prod)
> **Note**
> Before executing, make sure that you have:
> - aws account
> - aws user with AmazonECS_FullAccess and AmazonEC2ContainerRegistryFullAccess roles
> - aws ecsTaskExecutionRole role
1. Configure AWS CLI, AWS SSM and login to AWS ECR.
Add to AWS Systems Manager -> Parameter Store telegram bot token.
```shell
aws configure
aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 698445805226.dkr.ecr.us-east-2.amazonaws.com
```
2. Build image, create repository and push.
```shell
docker build -t nodejssubscriptionbot:1.0 .
aws ecr create-repository --repository-name nodejssubscriptionbot --image-scanning-configuration scanOnPush=true --region us-east-2
docker tag nodejssubscriptionbot:1.0 698445805226.dkr.ecr.us-east-2.amazonaws.com/nodejssubscriptionbot:1.0
docker push 698445805226.dkr.ecr.us-east-2.amazonaws.com/nodejssubscriptionbot:1.0
```
3. Create AWS ECS Fargate cluster and run service.
```shell
aws ecs create-cluster --cluster-name telegram-bots-cluster
aws ecs register-task-definition --cli-input-json  file://aws-ecs-fargate-task-definition.json
aws ecs create-service --cluster telegram-bots-cluster --service-name nodejs-subscription-bot-service --task-definition nodejs-subscription-bot-task:1 --desired-count 1 --launch-type "FARGATE" --network-configuration "awsvpcConfiguration={subnets=[subnet-91d56cdd],securityGroups=[sg-00f96819122999b45],assignPublicIp=ENABLED}"
```
4. Delete service, cluster and repository.
```shell
aws ecs delete-service --cluster telegram-bots-cluster --service nodejs-subscription-bot-service --force
aws ecs delete-cluster --cluster telegram-bots-cluster
aws ecr delete-repository --repository-name nodejssubscriptionbot --force
```
