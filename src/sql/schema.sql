BEGIN;

-- Drop existing tables (in reverse dependency order)
DROP TABLE IF EXISTS case_solutions;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS status_history;
DROP TABLE IF EXISTS submissions;
DROP TABLE IF EXISTS investigations;
DROP TABLE IF EXISTS evidence;
DROP TABLE IF EXISTS suspects;
DROP TABLE IF EXISTS cases;
DROP TABLE IF EXISTS users;

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'rookie'
        CHECK (role IN ('rookie', 'senior', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create cases table
CREATE TABLE cases (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    difficulty VARCHAR(20),
    status VARCHAR(20) DEFAULT 'draft'
        CHECK (status IN ('draft', 'published', 'archived')),
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create suspects table
CREATE TABLE suspects (
    id SERIAL PRIMARY KEY,
    case_id INTEGER NOT NULL REFERENCES cases(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    alibi TEXT NOT NULL,
    motive TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create evidence table
CREATE TABLE evidence (
    id SERIAL PRIMARY KEY,
    case_id INTEGER NOT NULL REFERENCES cases(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    evidence_type VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create investigations table
CREATE TABLE investigations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    case_id INTEGER NOT NULL REFERENCES cases(id),
    status VARCHAR(30) DEFAULT 'investigating'
        CHECK (status IN ('investigating', 'under_review', 'revision_needed', 'solved')),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    UNIQUE (user_id, case_id)
);

-- Create submission table
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    investigation_id INTEGER NOT NULL REFERENCES investigations(id),
    suspect_id INTEGER NOT NULL REFERENCES suspects(id),
    theory TEXT NOT NULL,
    reasoning TEXT NOT NULL,
    review_status VARCHAR(20) DEFAULT 'pending',
    reviewer_id INTEGER NOT NULL REFERENCES users(id),
    feedback TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- Create status table
CREATE TABLE status_history (
    id SERIAL PRIMARY KEY,
    investigation_id INTEGER NOT NULL REFERENCES investigations(id),
    from_status VARCHAR(30),
    to_status VARCHAR(30) NOT NULL,
    changed_by INTEGER NOT NULL REFERENCES users(id),
    changed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    case_id INTEGER NOT NULL REFERENCES cases(id),
    user_id INTEGER NOT NULL REFERENCES users(id),
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create case solutions table
CREATE TABLE case_solutions (
    id SERIAL PRIMARY KEY,
    case_id INTEGER NOT NULL REFERENCES cases(id),
    correct_suspect_id INTEGER NOT NULL REFERENCES suspects(id),
    explanation TEXT NOT NULL
);

COMMIT;