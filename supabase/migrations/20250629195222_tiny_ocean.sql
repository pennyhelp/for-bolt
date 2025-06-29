-- ✅ CLEAN DATABASE SETUP - Run these commands in Supabase SQL Editor
-- This will work even if you already have some data

-- 1. First, let's check what exists and clean up if needed
DO $$
BEGIN
    -- Only create enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_role') THEN
        CREATE TYPE admin_role AS ENUM ('super', 'local', 'user');
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'registration_status') THEN
        CREATE TYPE registration_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END $$;

-- 2. Create tables (will skip if they exist)
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  actual_fee integer DEFAULT 0,
  offer_fee integer DEFAULT 0,
  image_url text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS panchayaths (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  district text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text UNIQUE NOT NULL,
  password text NOT NULL,
  role admin_role DEFAULT 'user',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id text UNIQUE NOT NULL,
  category_id uuid NOT NULL REFERENCES categories(id),
  category_name text NOT NULL,
  name text NOT NULL,
  address text NOT NULL,
  mobile_number text UNIQUE NOT NULL,
  panchayath_id uuid NOT NULL REFERENCES panchayaths(id),
  panchayath_name text NOT NULL,
  ward text NOT NULL,
  agent_pro text NOT NULL,
  status registration_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 3. Insert data only if it doesn't exist
DO $$
BEGIN
    -- Insert admin users (skip if username exists)
    INSERT INTO admins (username, password, role, is_active) 
    SELECT 'evaadmin', 'eva919123', 'super', true
    WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = 'evaadmin');
    
    INSERT INTO admins (username, password, role, is_active) 
    SELECT 'admin1', 'elife9094', 'local', true
    WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin1');
    
    INSERT INTO admins (username, password, role, is_active) 
    SELECT 'admin2', 'penny9094', 'user', true
    WHERE NOT EXISTS (SELECT 1 FROM admins WHERE username = 'admin2');
END $$;

-- 4. Insert categories (only if table is empty)
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM categories) = 0 THEN
        INSERT INTO categories (name, description, actual_fee, offer_fee, is_active) VALUES
        ('Pennyekart Free Registration', 'Totally free registration with free delivery between 2pm to 6pm. Basic level access to hybrid ecommerce platform.', 0, 0, true),
        ('Pennyekart Paid Registration', 'Premium registration with any time delivery between 8am to 7pm. Full access to all platform features.', 500, 299, true),
        ('Farmelife', 'Connected with dairy farm, poultry farm and agricultural businesses.', 750, 499, true),
        ('Organelife', 'Connected with vegetable and house gardening, especially terrace vegetable farming.', 600, 399, true),
        ('Foodlife', 'Connected with food processing business and culinary services.', 800, 599, true),
        ('Entrelife', 'Connected with skilled projects like stitching, art works, various home services.', 700, 499, true),
        ('Job Card', 'Special offer card with access to all categories, special discounts, and investment benefits.', 2000, 999, true);
    END IF;
END $$;

-- 5. Insert panchayaths (only if table is empty)
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM panchayaths) = 0 THEN
        INSERT INTO panchayaths (name, district, is_active) VALUES
        ('Amarambalam', 'Malappuram', true),
        ('Kondotty', 'Malappuram', true),
        ('Perinthalmanna', 'Malappuram', true);
    END IF;
END $$;

-- 6. Insert announcements (only if table is empty)
DO $$
BEGIN
    IF (SELECT COUNT(*) FROM announcements) = 0 THEN
        INSERT INTO announcements (title, content, is_active) VALUES
        ('Welcome to E-LIFE SOCIETY', 'Join our hybrid ecommerce platform and start your self-employment journey today!', true),
        ('Special Offer on Job Card', 'Get access to all categories with our special Job Card registration. Limited time offer!', true);
    END IF;
END $$;

-- 7. Enable RLS and create policies (skip if they exist)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE panchayaths ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DO $$
BEGIN
    -- Categories policies
    DROP POLICY IF EXISTS "Allow public read access to categories" ON categories;
    DROP POLICY IF EXISTS "Allow admin operations on categories" ON categories;
    CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT TO public USING (true);
    CREATE POLICY "Allow admin operations on categories" ON categories FOR ALL TO public USING (true);
    
    -- Panchayaths policies
    DROP POLICY IF EXISTS "Allow public read access to panchayaths" ON panchayaths;
    DROP POLICY IF EXISTS "Allow admin operations on panchayaths" ON panchayaths;
    CREATE POLICY "Allow public read access to panchayaths" ON panchayaths FOR SELECT TO public USING (true);
    CREATE POLICY "Allow admin operations on panchayaths" ON panchayaths FOR ALL TO public USING (true);
    
    -- Registrations policies
    DROP POLICY IF EXISTS "Allow public read access to registrations" ON registrations;
    DROP POLICY IF EXISTS "Allow public insert to registrations" ON registrations;
    DROP POLICY IF EXISTS "Allow admin operations on registrations" ON registrations;
    CREATE POLICY "Allow public read access to registrations" ON registrations FOR SELECT TO public USING (true);
    CREATE POLICY "Allow public insert to registrations" ON registrations FOR INSERT TO public WITH CHECK (true);
    CREATE POLICY "Allow admin operations on registrations" ON registrations FOR ALL TO public USING (true);
    
    -- Announcements policies
    DROP POLICY IF EXISTS "Allow public read access to announcements" ON announcements;
    DROP POLICY IF EXISTS "Allow admin operations on announcements" ON announcements;
    CREATE POLICY "Allow public read access to announcements" ON announcements FOR SELECT TO public USING (true);
    CREATE POLICY "Allow admin operations on announcements" ON announcements FOR ALL TO public USING (true);
    
    -- Admins policies
    DROP POLICY IF EXISTS "Allow public read access to admins" ON admins;
    DROP POLICY IF EXISTS "Allow admin operations on admins" ON admins;
    CREATE POLICY "Allow public read access to admins" ON admins FOR SELECT TO public USING (true);
    CREATE POLICY "Allow admin operations on admins" ON admins FOR ALL TO public USING (true);
END $$;

-- 8. Final verification query
SELECT 
    'categories' as table_name, COUNT(*) as record_count FROM categories
UNION ALL
SELECT 
    'panchayaths' as table_name, COUNT(*) as record_count FROM panchayaths
UNION ALL
SELECT 
    'admins' as table_name, COUNT(*) as record_count FROM admins
UNION ALL
SELECT 
    'registrations' as table_name, COUNT(*) as record_count FROM registrations
UNION ALL
SELECT 
    'announcements' as table_name, COUNT(*) as record_count FROM announcements;