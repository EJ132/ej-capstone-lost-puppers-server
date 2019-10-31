Lost Puppers

https://lostpuppers.netlify.com/

API Documentation: 

POST Features:
    - '/auth/login' is made for users to login
    - '/pups' is made for users to post a new pup
    - '/users' allows user registration
    - '/comments' is the endpoint where comments are sent

GET Features:
    - '/profile/:user_name' accesses the specific logged in users profile
    - '/pups' displays all the lost puppers
    - '/pups/:id' shows a personal page of the specific pup
    - '/pups/:id/comments' shows the comments that go with the pup page ^^^

DELETE Feauture: 
    - '/pups/:id' deletes a certain pup listing

PATCH Feature:
    - '/pups/:id' allows updates to the pup name and description


For further information feel free to visit this repository: https://github.com/EJ132/ej-capstone-lost-puppers