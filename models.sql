CREATE TABLE users (
  id serial PRIMARY KEY, 
  email text NOT NULL,
  displayname text NOT NULL,
  accessToken text NOT NULL,
  password text NOT NULL
);

CREATE TABLE polls (
  id serial PRIMARY KEY,
  created_by int REFERENCES "users"(id),
  "date" timestamp NOT NULL,
  question text NOT NULL
);

CREATE TABLE choices (
  id serial PRIMARY KEY,
  poll_id int REFERENCES "polls"(id),
  content text NOT NULL,
  votes int DEFAULT 0
);
