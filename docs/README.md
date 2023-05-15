# The Block 
> A Virtual Neighborhood Bulletin Board

## Introduction
This is my The Block, a Virtual Neighborhood Bulletin Board.  
It allows people to post bulletins on boards, similarly to posts on subreddits.  
For example, say you want to find a babysitter, you can send a GET request to http://localhost:3000/b/babysitters and you will get a JSON response with all the babysitters in the neighborhood.  If you want your lawn mowed, you can send a GET request to http://localhost:3000/b/lawncare and see all the bulletins of people that want to mow lawns in your area.

Note:  It is not complete, and most of it is not working yet.  I ran out of time due to time managment/school-life balance issues.  I thought about connecting my tweet generator as an api, but I could not see how it could use all of CRUD. The idea is there in my head, I just need to figure out all the auth issues.
 
## Documentation

Get data in JSON format

| Method | Route                                        | Decription                  |
|--------|----------------------------------------------|-----------------------------|
| GET    | http://localhost:3000/bulletins              | Get all bulletins           |
| GET    | http://localhost:3000/bulletins/{bulletinId} | Get one bulletin by id      |
| POST   | http://localhost:3000/bulletins              | Add a new bulletin          |
| PUT    | http://localhost:3000/bulletins{bulletinId}  | Update an existing bulletin |
| DELETE | http://localhost:3000/bulletins{bulletinId}  | Delete a bulletin           |
| GET    | http://localhost:3000/b/:board               | Get board                   |
| GET    | http://localhost:3000/users                  | Get all users               |
| GET    | http://localhost:3000/users/{userId}         | Get one user by id          |
| POST   | http://localhost:3000/users                  | Add a new user (sign up)    |
| GET    | http://localhost:3000/login                  | Login a user (login)        |

