-- ZillGO PostgreSQL Schema

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'traveler', -- traveler, guide, admin
    avatar VARCHAR(255),
    bio TEXT,
    location VARCHAR(255),
    verified BOOLEAN DEFAULT false,
    suspended BOOLEAN DEFAULT false,
    reward_points INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tours Table
CREATE TABLE tours (
    id SERIAL PRIMARY KEY,
    guide_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    location VARCHAR(255),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    category VARCHAR(100),
    cover_image VARCHAR(255),
    duration_minutes INTEGER,
    max_participants INTEGER,
    kid_friendly BOOLEAN DEFAULT false,
    rating DECIMAL(2, 1) DEFAULT 0.0,
    review_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings Table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    tour_id INTEGER REFERENCES tours(id),
    booking_date DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
    total_amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Shopping Orders
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    guide_id INTEGER REFERENCES users(id),
    item_name VARCHAR(255),
    price DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'processing', -- processing, shipped, delivered
    tracking_number VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Messages
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER REFERENCES users(id),
    receiver_id INTEGER REFERENCES users(id),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reviews
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    tour_id INTEGER REFERENCES tours(id),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Authentication Sessions & Tokens
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE email_verifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE password_resets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Login History (for admin)
CREATE TABLE login_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    ip_address VARCHAR(45),
    user_agent TEXT,
    success BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- FINTECH & PAYMENTS SYSTEM SCHEMA
-- ====================================================================

-- Wallets
CREATE TABLE wallets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(15, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    provider VARCHAR(50) NOT NULL, -- stripe, razorpay, paypal, wallet
    provider_id VARCHAR(255),
    amount DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'pending', -- pending, succeeded, failed, refunded
    payment_type VARCHAR(50), -- tour_booking, marketplace, subscription
    reference_id INTEGER, -- ties to bookings.id or orders.id
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    wallet_id INTEGER REFERENCES wallets(id),
    payment_id INTEGER REFERENCES payments(id),
    amount DECIMAL(15, 2) NOT NULL,
    type VARCHAR(50) NOT NULL, -- credit, debit
    status VARCHAR(50) DEFAULT 'completed',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refunds
CREATE TABLE refunds (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id),
    amount DECIMAL(15, 2) NOT NULL,
    reason VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- pending, processed, failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions
CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    plan_id VARCHAR(100) NOT NULL,
    provider VARCHAR(50),
    provider_sub_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active', -- active, canceled, past_due
    current_period_end TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Commissions
CREATE TABLE commissions (
    id SERIAL PRIMARY KEY,
    payment_id INTEGER REFERENCES payments(id),
    total_amount DECIMAL(15, 2) NOT NULL,
    platform_fee DECIMAL(15, 2) NOT NULL,
    guide_amount DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payouts
CREATE TABLE payouts (
    id SERIAL PRIMARY KEY,
    guide_id INTEGER REFERENCES users(id),
    amount DECIMAL(15, 2) NOT NULL,
    provider VARCHAR(50), -- stripe_connect, paypal_payouts, bank_transfer
    status VARCHAR(50) DEFAULT 'pending', -- pending, processed, failed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- BOOKING ENGINE SCHEMA
-- ====================================================================

-- Tour Images
CREATE TABLE tour_images (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tour Schedules (Calendar Management)
CREATE TABLE tour_schedules (
    id SERIAL PRIMARY KEY,
    tour_id INTEGER REFERENCES tours(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slot TIME NOT NULL,
    capacity INTEGER NOT NULL,
    booked_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'available', -- available, blocked, holiday
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Booking Guests
CREATE TABLE booking_guests (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    age_group VARCHAR(50) DEFAULT 'adult', -- adult, child, senior
    special_requests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Booking Payments (Mapping bookings to the FinTech system)
CREATE TABLE booking_payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    payment_id INTEGER REFERENCES payments(id) ON DELETE CASCADE,
    amount_allocated DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- TRUST & SAFETY SCHEMA (GUIDE VERIFICATION)
-- ====================================================================

CREATE TABLE guide_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    guide_level VARCHAR(50) DEFAULT 'bronze', -- bronze, silver, gold, expert
    trust_score DECIMAL(5, 2) DEFAULT 0.00,
    response_time_mins INTEGER DEFAULT 60,
    cancellation_rate DECIMAL(5, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guide_verification_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending', -- pending, ai_approved, human_review, rejected
    rejection_reason TEXT,
    ai_confidence_score DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE guide_documents (
    id SERIAL PRIMARY KEY,
    request_id INTEGER REFERENCES guide_verification_requests(id) ON DELETE CASCADE,
    document_type VARCHAR(50) NOT NULL, -- passport, national_id, selfie
    encrypted_file_url VARCHAR(255) NOT NULL,
    extracted_text TEXT, -- OCR data
    is_authentic BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE trust_scores (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    factor VARCHAR(100) NOT NULL, -- "5-star rating", "no-show", "fast response"
    weight_change DECIMAL(5, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- GLOBAL CULTURE OLYMPICS SCHEMA
-- ====================================================================

CREATE TABLE olympic_events (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL, -- food, music, dance, hidden_gem
    title VARCHAR(255) NOT NULL,
    description TEXT,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    is_live BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE olympic_entries (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES olympic_events(id) ON DELETE CASCADE,
    guide_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    country_code VARCHAR(3) NOT NULL, -- ISO code
    presentation_title VARCHAR(255) NOT NULL,
    live_stream_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE olympic_votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    entry_id INTEGER REFERENCES olympic_entries(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL, -- best_taste, best_storyteller
    points INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, entry_id, category) -- Prevent double voting
);

CREATE TABLE digital_passports (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    country_code VARCHAR(3) NOT NULL,
    stamp_name VARCHAR(100) NOT NULL,
    acquired_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, stamp_name)
);

-- ====================================================================
-- GLOBAL FRIEND MATCHING SCHEMA
-- ====================================================================

CREATE TABLE user_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    country_code VARCHAR(3) NOT NULL,
    city VARCHAR(100),
    age_group VARCHAR(20),
    occupation VARCHAR(100),
    travel_style VARCHAR(50), -- luxury, backpacker, cultural
    explorer_type VARCHAR(50), -- AI-generated: Food Explorer, Nature Explorer
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_languages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    proficiency VARCHAR(20) NOT NULL, -- native, fluent, learning
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, language_code)
);

CREATE TABLE user_interests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    interest VARCHAR(100) NOT NULL, -- food, tech, history, music
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, interest)
);

CREATE TABLE friendships (
    id SERIAL PRIMARY KEY,
    user_id_1 INTEGER REFERENCES users(id) ON DELETE CASCADE,
    user_id_2 INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending', -- pending, accepted, blocked
    compatibility_score INTEGER, -- AI generated score 0-100
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id_1, user_id_2)
);

CREATE TABLE communities (
    id SERIAL PRIMARY KEY,
    creator_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50), -- travel, language, food
    cover_image VARCHAR(255),
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE community_members (
    id SERIAL PRIMARY KEY,
    community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(20) DEFAULT 'member', -- admin, moderator, member
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(community_id, user_id)
);

CREATE TABLE user_achievements (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    achievement_name VARCHAR(100) NOT NULL,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_name)
);
