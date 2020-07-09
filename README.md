## Authentication

* [x] Create Server
* [x] Add auth router
* [x] Create user with POST /auth/signup
    * [x] validate required fields
    * [x] Check if username is unique
    * [x] hash password with bcrypt
    * [x] insert into db
* [ ] Login user with POST /auth/login
    * [ ] check if username in db
        * [ ] compare password with hashed password in db
        * [ ] Create and sign a JWT
            * [ ] Respond with JWT