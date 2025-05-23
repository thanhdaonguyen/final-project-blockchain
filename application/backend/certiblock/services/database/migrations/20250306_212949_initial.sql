CREATE TABLE IF NOT EXISTS countries (
    id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL
);


CREATE TABLE IF NOT EXISTS students (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nin TEXT NOT NULL,
    country_id INT NOT NULL,
    date_of_birth TEXT NOT NULL,
    full_name TEXT NOT NULL,
    password TEXT NOT NULL,
    private_key TEXT NOT NULL,
    public_key TEXT NOT NULL,

    KEY idx_student_pubkey (public_key(16))
);

CREATE TABLE IF NOT EXISTS universities(
    id INT PRIMARY KEY AUTO_INCREMENT,
    name_university TEXT NOT NULL,
    public_key LONGTEXT NOT NULL,
    private_key LONGTEXT NOT NULL,
    location_university LONGTEXT NOT NULL,
    description_university LONGTEXT NOT NULL,

    KEY idx_university_pubkey (public_key(16))

);

CREATE TABLE IF NOT EXISTS certificates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid TEXT NOT NULL,
    university_encrypted_ks_1 LONGTEXT NOT NULL,
    university_encrypted_ks_2 LONGTEXT NOT NULL,
    student_encrypted_ks_1 LONGTEXT NOT NULL,
    student_encrypted_ks_2 LONGTEXT NOT NULL,
    ks_encrypted_file LONGTEXT NOT NULL,

    KEY idx_cert_uuid (uuid(16))
);

CREATE TABLE IF NOT EXISTS certificates2 (
    id INT PRIMARY KEY AUTO_INCREMENT,
    uuid TEXT NOT NULL,
    university_encrypted_ks_1 LONGTEXT NOT NULL,
    university_encrypted_ks_2 LONGTEXT NOT NULL,
    student_encrypted_ks_1 LONGTEXT NOT NULL,
    student_encrypted_ks_2 LONGTEXT NOT NULL,
    ks_encrypted_file LONGTEXT NOT NULL,
    is_On_Chain BOOLEAN NOT NULL DEFAULT FALSE, 

    KEY idx_cert_uuid (uuid(16))
);

CREATE TABLE IF NOT EXISTS qrs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    cert_uuid TEXT NOT NULL,
    qr_encrypted_ks_1 LONGTEXT NOT NULL,
    qr_encrypted_ks_2 LONGTEXT NOT NULL
);
