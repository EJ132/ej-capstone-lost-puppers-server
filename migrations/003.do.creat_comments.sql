CREATE TABLE pup_comments (
    id SERIAL PRIMARY KEY,
    comment TEXT NOT NULL,
    date_created TIMESTAMP DEFAULT now() NOT NULL,
    pup_id INTEGER
        REFERENCES pups(id) ON DELETE CASCADE NOT NULL,
    user_id INTEGER
        REFERENCES users(id) ON DELETE CASCADE NOT NULL
);
