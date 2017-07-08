CREATE TABLE users (
    id serial PRIMARY KEY, 
    email text NOT NULL,
    displayname text NOT NULL,
    accessToken text NOT NULL,
    password text NOT NULL
);

CREATE TABLE polls (
  id serial PRIMARY KEY,
  "date" timestamp NOT NULL,
  question text NOT NULL,
  choices text[]
);
