# Abhiman
# Poll Application API

This is a RESTful API for a poll application built using Node.js with Express and MySQL as the database.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Postman Collection](#postman-collection)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

- Node.js
- MySQL

### Installation

1. Clone the repository:

   ```bash
   git clone (https://github.com/prabhatgupta11/Abhiman.git)https://github.com/prabhatgupta11/Abhiman.git

### Install dependencies:

npm install


### Set up the database:

Create a MySQL database and configure the connection in config/config.json.

### Run database 



```bash

npx sequelize-cli mysql2




### Start the server:
make sure you have a .env file and PORT inside it.

```bash
 npm start






### Database Schema

1 Poll
2 QuestionSet
3 PollAnalytics
4 User




### API Endpoints



1. **Create User:**

   - Endpoint: `POST userApi/createUser`
   - Description: Create a new user.
   - Request body: 
     ```json
     {
       "name": "John Doe"
     }
     ```
     Response:
     ```json
     {
       "message": "User created successfully"
     }
     ```

2. **Create Poll:**

   - Endpoint: `POST /api/createPolls/:userID`
   - Description: Create a new poll with question sets.
   - Request body: 
     ```json
     {
       "title": "Favorite Color Poll",
       "category": "Colors",
       "startDate": "2023-01-01",
       "endDate": "2023-01-31",
       "minReward": 10,
       "maxReward": 50,
       "questionSets": [
         {
           "questionType": "single",
           "questionText": "What is your favorite color?",
           "options": ["Red", "Blue", "Green"]
         },
         // Add more question sets if needed
       ]
     }
     ```
     Response:
     ```json
     {
       "message": "Poll created successfully"
     }
     ```

3. **Get All Polls with Analytics:**

   - Endpoint: `GET /api/getAllPolls`
   - Description: Fetch all polls along with analytics.
     Response:
     ```json
     {
       "polls": [...]
     }
     ```

4. **Update a Poll:**

   - Endpoint: `PUT /api/updatePolls/:pollId`
   - Description: Update details of a particular poll.
   - Request body: 
     ```json
     {
       "title": "New Poll Title",
       "category": "Updated Category",
       // Include other fields to update
     }
     ```
     Response:
     ```json
     {
       "message": "Poll updated successfully",
       "poll": {...}
     }
     ```

5. **Get User's Polls with Questions:**

   - Endpoint: `GET /api/polls/user/:userId`
   - Description: Fetch polls and associated questions for a specific user.
     Response:
     ```json
     {
       "questions": [...]
     }
     ```

6. **Submit a Poll:**

   - Endpoint: `POST /api/polls/submit/:userId`
   - Description: Submit a poll response for a user.
   - Request body: 
     ```json
     {
       "id": "pollId",
       "questionSetId": "questionSetId",
       "selectedOptionValue": "selectedOptionValue"
     }
     ```
     Response:
     ```json
     {
       "message": "Poll submitted successfully",
       "reward": 20
     }
     ```

7. **Get Poll Analytics for a Poll:**

   - Endpoint: `GET /api/polls/:pollId/analytics`
   - Description: Fetch analytics for a particular poll.
     Response:
     ```json
     {
       "pollAnalytics": {...}
     }
     ```

8. **Get Overall Poll Analytics:**

   - Endpoint: `GET /api/polls/analytics`
   - Description: Fetch aggregated statistics for all polls.
     Response:
     ```json
     {
       "overallAnalytics": [...]
     }
     ```




