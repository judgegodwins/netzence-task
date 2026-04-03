# Lambda Scheduled Data Archiving (Serverless Framework)

## Overview

This project implements a scheduled AWS Lambda function that archives items older than 30 days from a DynamoDB table into an S3 bucket in JSON format.

The system is built using the Serverless Framework and provisions all required infrastructure automatically.

---

## Architecture

* AWS Lambda — Executes archiving logic
* Amazon DynamoDB — Stores application data
* Amazon S3 — Stores archived JSON files
* Amazon EventBridge (Cloudwatch Events) — Schedules daily execution

---

## Features

* Scans DynamoDB table for items older than 30 days
* Archives old items to S3 in JSON format
* Deletes archived items from DynamoDB
* Scheduled to run automatically once per day
* Includes a seed function for inserting test data

---

## Project Structure

```
archive-service/
├── functions
├   ├──archive.js
├   ├──seed.js
├── serverless.yaml
├── package.json
```

---

## Deployment

Prerequisites include:

* Node.js (v18+)
* AWS Account
* AWS CLI configured (`aws configure`)
* Serverless Framework installed

Ensure AWS CLI is installed and configured with "AdministratorAccess" credentials (access key and secret key). View [installation guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

### 1. Install dependencies
Change into the `03-archive-service` directory, if not already in it. Then run:

```bash
npm install
```

### 2. Install serverless

```bash
npm install -g serverless
```
### 3. Deploy
```bash
serverless deploy
```
Serverless might prompt you to login if you haven't. Follow the redirection to the browser to login

---

## Configuration

### Environment Variables

`TABLE_NAME` - DynamoDB table to use (optional)

`FALLBACK_TABLE_NAME` - Default table created by Serverless

`BUCKET_NAME` - S3 bucket for archived data

The serverless.yaml file includes configuration for creating the default dynamodb table and s3 bucket to be used.

You can override the table or bucket to an existing one during deployment:

```bash
serverless deploy --tableName=my-existing-table --bucketName=my-bucket
```

---

## Testing

### 1. Seed Test Data

Insert sample data into DynamoDB:

```bash
serverless invoke -f seed
```

This creates:

* Items older than 30 days (to be archived)
* Recent items (to remain in the table)

---

### 2. Run Archiving Function

```bash
npx serverless invoke -f archive
```

---

### 3. Verify Results

#### DynamoDB

* Old items should be deleted
* New items should remain

#### S3

* Check the bucket for a file:

```
archives/archive-<timestamp>.json
```

* File should contain archived items

---

### 4. View Logs

```bash
serverless logs -f archive -t
```

---

## Scheduling

The archive function is triggered automatically using EventBridge:

```yaml
rate: rate(1 day)
```

---


## Assumptions

* Each item contains a `createdAt` field
* `createdAt` is stored as an ISO date string
* Primary key is `id`

---

## How It Works (Flow)

1. EventBridge (formerly called Cloudwatch Events) triggers Lambda daily
2. Lambda scans DynamoDB table
3. Filters items older than 30 days
4. Writes them to S3 as a JSON file
5. Deletes archived items from DynamoDB

---


## Notes

* S3 bucket names are globally unique; deployment appends AWS account ID
* DynamoDB is schemaless; `createdAt` is enforced at application level
* Lambda uses AWS SDK v3 for better performance and modular imports

---
