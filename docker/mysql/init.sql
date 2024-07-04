CREATE TABLE todos (
    id VARCHAR(255) NOT NULL,
    todo TEXT NOT NULL,
    isCompleted BOOLEAN NOT NULL DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    INDEX idx_isCompleted (isCompleted),
    INDEX idx_createdAt (createdAt)
);