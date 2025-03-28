-- Create a schema for our URL shortening service
CREATE TABLE IF NOT EXISTS shortcuts (
    shortcode TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    clicks INTEGER NOT NULL DEFAULT 0
);

-- Create an index on the shortcode column
CREATE INDEX IF NOT EXISTS shortcuts_shortcode_idx ON shortcuts (shortcode);

-- Create an audit log table to track all changes
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    action TEXT NOT NULL,
    shortcode TEXT NOT NULL,
    url TEXT,
    user_ip TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on the audit_log table
CREATE INDEX IF NOT EXISTS audit_log_shortcode_idx ON audit_log (shortcode);
CREATE INDEX IF NOT EXISTS audit_log_created_at_idx ON audit_log (created_at);

-- Create a function to log shortcut changes
CREATE OR REPLACE FUNCTION log_shortcut_change()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_log (action, shortcode, url)
        VALUES ('CREATE', NEW.shortcode, NEW.url);
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_log (action, shortcode, url)
        VALUES ('UPDATE', NEW.shortcode, NEW.url);
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_log (action, shortcode, url)
        VALUES ('DELETE', OLD.shortcode, OLD.url);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to log all changes
CREATE TRIGGER shortcut_insert_trigger
AFTER INSERT ON shortcuts
FOR EACH ROW
EXECUTE FUNCTION log_shortcut_change();

CREATE TRIGGER shortcut_update_trigger
AFTER UPDATE ON shortcuts
FOR EACH ROW
EXECUTE FUNCTION log_shortcut_change();

CREATE TRIGGER shortcut_delete_trigger
AFTER DELETE ON shortcuts
FOR EACH ROW
EXECUTE FUNCTION log_shortcut_change(); 