CREATE TABLE users
(
    user_id      UUID         NOT NULL DEFAULT gen_random_uuid(),
    username     VARCHAR(128) NOT NULL,
    email        VARCHAR(128) NOT NULL,
    first_name   VARCHAR(128),
    last_name    VARCHAR(128),
    user_version INTEGER      NOT NULL,
    created_at   TIMESTAMP    NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, user_version)
);

CREATE TABLE users_passwords
(
    password_id      UUID         NOT NULL DEFAULT gen_random_uuid(),
    password_value   VARCHAR(256) NOT NULL,
    user_id          UUID         NOT NULL,
    password_version INTEGER      NOT NULL,
    created_at       TIMESTAMP    NOT NULL DEFAULT NOW(),
    UNIQUE (password_id, password_value),
    UNIQUE (password_id, password_version)
);

CREATE TABLE users_session
(
    session_token VARCHAR(128) NOT NULL,
    user_id       UUID         NOT NULL,
    expires_at    TIMESTAMP    NOT NULL,
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE users_roles
(
    user_id UUID        NOT NULL,
    role    varchar(64) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    users_roles_version INTEGER NOT NULL
)