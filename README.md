# Password Less authentication using AWS Cognito
Welcome to sample CDK TypeScript project.

This is a sample project for Password less authentication using CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

-----------------------

### Prerequisite ###
* **Node.js** - [Install Node.js](https://nodejs.org/en/), including the NPM package management tool.
* **TypeScript** - [Install Typescript](https://www.typescriptlang.org), TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
* **AWS CLI** - [Install AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html), Install & Configuring aws cli and account to access to manage resources
* **AWS CDK** - [Install AWS CDK](https://aws.amazon.com/cdk/), Define your cloud application resources using familiar programming languages.

## Initial configuration steps

### 1. Setup AWS profile
Configure AWS credential using [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) profile

Open up a terminal and set AWS configuration.

```bash
aws configure --profile your_profile_name
AWS Access Key ID [None]: XXXXXXXXXXXXXXXX
AWS Secret Access Key [None]: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Default region name [None]: us-east-1
Default output format [None]: text
```

### 2. Install latest cdk
You can use any node package manager(npm, yarn, pnpm) to install `aws cdk`, If you install node, so npm package manage comes along with.

Install CDK
```zsh
npm install -g aws-cdk@latest
```

### 3. Clone Repository or Download
Clone Repository from Github OR download it directly

```bash
git clone <github-repository-path>
```

### 4. Install project dependency
Go to path of project repository and install project dependency

```bash
cd repository-path
npm install
```

### 5. Project Environment setup

- Create `.env` environment file from `.env.template` tempalet file.
- `.env` file should contain environment variables for all environment like `dev`, `stg`, `prod` etc...
- In this sample application setup `dev` environment only, Follow below instruction to setup other environments.
- File `context/models/enums.ts` contain active environment enum values, if you would like to add another environment then add enum value, add environment values into config file at `context/components/configuration.ts`.

-----------------------

### Useful command
- 