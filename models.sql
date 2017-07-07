CREATE TABLE users (
    id serial PRIMARY KEY,
    email text NOT NULL,
    displayname text NOT NULL,
    password text NOT NULL
);

CREATE TABLE poll (
  id serial PRIMARY KEY,
  "date" timestamp NOT NULL,
  created_by integer REFERENCES users,
  question text NOT NULL,
  choices text[]
);
