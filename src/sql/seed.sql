BEGIN;

-- Seed data needs an owner for the required cases.created_by foreign key.
INSERT INTO users (username, email, password_hash, role)
VALUES ('Agency Admin', 'admin@detective-agency.local', 'seed-user-no-login', 'admin')
ON CONFLICT (email) DO NOTHING;

-- seed a case
INSERT INTO cases (
    title,
    description,
    difficulty,
    status,
    created_by
)
VALUES (
    'The Clockmaker''s Secret',
    'At midnight, renowned clockmaker Elias Thorne is found dead in his workshop. His prized silver pocket watch has vanished.',
    'medium',
    'published',
    (SELECT id FROM users WHERE email = 'admin@detective-agency.local')
);

-- seed the suspects
INSERT INTO suspects (
    case_id,
    name,
    description,
    alibi,
    motive
)
VALUES 
(
    (
        SELECT id FROM cases
        WHERE title = 'The Clockmaker''s Secret'
    ),
    'Clara Thorne',
    'The estranged daughter of Elias Thorne.',
    'Claims she was home all evening.',
    'A dispute over her inheritance.'
),
(
    (
        SELECT id FROM cases
        WHERE title = 'The Clockmaker''s Secret'
    ),
    'Oliver Finch',
    'The apprentice of Elias Thorne.',
    'Claims he was at the tavern.',
    'Recently dismissed from the workshop after being accused of stealing.'
),
(
    (
        SELECT id FROM cases
        WHERE title = 'The Clockmaker''s Secret'
    ),
    'Victor Blackwood',
    'The competition',
    'Claims he was attending a private dinner.',
    'He wanted the clock mechanism that Elias recently patented.'
);

-- seed the evidence
INSERT INTO evidence (
    case_id,
    title,
    description,
    evidence_type
)
VALUES 
(
    (
        SELECT id FROM cases
        WHERE title = 'The Clockmaker''s Secret'
    ),
    'Broken Pocket Watch',
    'A damaged pocket watch found near the victim, stopped at 11:47 PM. A small piece of dark green, expensive fabric is caught in its clasp.',
    'physical'
),
(
    (
        SELECT id FROM cases
        WHERE title = 'The Clockmaker''s Secret'
    ),
    'Torn Letter',
    'A threatening letter addressed to Elias. It has no signature.',
    'document'
),
(
    (
        SELECT id FROM cases
        WHERE title = 'The Clockmaker''s Secret'
    ),
    'Muddy Footprints',
    'Footprints found near the back entrance of the workshop. You cannot quite pinpoint if they are male or female.',
    'physical'
),
(
    (
        SELECT id FROM cases
        WHERE title = 'The Clockmaker''s Secret'
    ),
    'Tavern Receipt',
    'A receipt for the tavern nearby. The initials that have been signed almost look like OF',
    'document'
),
(
    (
        SELECT id FROM cases
        WHERE title = 'The Clockmaker''s Secret'
    ),
    'Missing Blueprint',
    'The plans for the patented mechanism have disappeared. The only people with the safe code were Elias and his immediate family.',
    'physical'
);

-- seed the solution
INSERT INTO case_solutions (
    case_id,
    correct_suspect_id,
    explanation
)
VALUES (
    (
        SELECT id FROM cases
        WHERE title = 'The Clockmaker''s Secret'
    ),
    (
        SELECT id FROM suspects
        WHERE name = 'Clara Thorne'
        AND case_id = (
            SELECT id FROM cases
            WHERE title = 'The Clockmaker''s Secret'
        )
    ),
    'Clara stole the blueprints, but Elias came into the office and caught her. She didn''t mean to kill him, but it all happened so fast. He had officially cut her off just hours before.'
);

COMMIT;
