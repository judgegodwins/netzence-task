# Simple Items API (Serverless CRUD API)

## Overview

This project implements a **serverless REST API** for managing items using:

* **AWS Lambda** – handles business logic
* **API Gateway** – exposes HTTP endpoints
* **Amazon DynamoDB** – stores item data

The API supports full **CRUD operations**:

* Create an item
* Retrieve an item
* Update an item
* Delete an item

---

## Architecture

Client -> API Gateway -> Lambda Functions -> DynamoDB

Each endpoint is mapped to a dedicated Lambda function.

---

## Deployment

### 1. Prerequisites

* Node.js (v18+)
* AWS Account
* AWS CLI configured (`aws configure`)
* Serverless Framework installed:

Ensure AWS CLI is installed and configured with "AdministratorAccess" credentials (access key and secret key). View [installation guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).


#### Install serverless framework
```bash
npm install -g serverless
```

---

### 2. Install Dependencies
Change into the `02-simple-items-api` directory, if not already in it. Run:

```bash
npm install
```

---

### 3. Deploy to AWS

```bash
serverless deploy
```
Serverless might prompt you to login through the browser.

After deployment, you will see output like:

```
endpoints:
  POST - https://<api-id>.execute-api.us-east-1.amazonaws.com/dev/items
  GET  - https://<api-id>.execute-api.us-east-1.amazonaws.com/dev/items/{itemId}
  PUT  - https://<api-id>.execute-api.us-east-1.amazonaws.com/dev/items/{itemId}
  DELETE - https://<api-id>.execute-api.us-east-1.amazonaws.com/dev/items/{itemId}
```

---

## Testing the API

You can test using **curl**, Postman, or any HTTP client.

---

### Create Item

```bash
curl -X POST https://<api-url>/items \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Item","description":"Sample description"}'
```

---

### Get Item

```bash
curl https://<api-url>/items/{itemId}
```

---

### Update Item

```bash
curl -X PUT https://<api-url>/items/{itemId} \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Item","description":"Updated description"}'
```

---

### Delete Item

```bash
curl -X DELETE https://<api-url>/items/{itemId}
```

---


## Error Handling

The API handles common errors:

* **400 Bad Request** → Invalid input (missing fields)
* **404 Not Found** → Item does not exist
* **500 Internal Server Error** → Unexpected server error

---

## Assumptions

* `itemId` is generated using UUID.
* Only `name` and `description` are required fields.
* The application runs in a single AWS region (`us-east-1`).

---

## Project Structure

```
.
├── functions/
│   ├── createItem.js
│   ├── getItem.js
│   ├── updateItem.js
│   └── deleteItem.js
├── db.js
├── serverless.yaml
├── package.json
```
