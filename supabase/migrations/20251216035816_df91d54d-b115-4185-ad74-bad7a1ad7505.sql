-- Function to generate referral code from first name
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  first_name_val TEXT;
  base_code TEXT;
  final_code TEXT;
  counter INT := 0;
BEGIN
  -- Only generate if full_name is being set and no code exists yet
  IF NEW.full_name IS NOT NULL AND NEW.full_name != '' THEN
    -- Check if user already has a referral code
    IF EXISTS (SELECT 1 FROM referral_codes WHERE code ILIKE (split_part(NEW.full_name, ' ', 1) || 'Tech')) THEN
      -- Check if it's this user's code by checking if they already have one
      IF EXISTS (SELECT 1 FROM referral_codes rc 
                 INNER JOIN profiles p ON rc.code ILIKE (split_part(p.full_name, ' ', 1) || 'Tech')
                 WHERE p.id = NEW.id) THEN
        RETURN NEW;
      END IF;
    END IF;
    
    -- Extract first name and create base code
    first_name_val := split_part(NEW.full_name, ' ', 1);
    base_code := first_name_val || 'Tech';
    final_code := base_code;
    
    -- Handle duplicates by adding numbers
    WHILE EXISTS (SELECT 1 FROM referral_codes WHERE code ILIKE final_code) LOOP
      counter := counter + 1;
      final_code := base_code || counter::TEXT;
    END LOOP;
    
    -- Insert the referral code
    INSERT INTO referral_codes (code, bonus_amount, is_active, usage_count)
    VALUES (final_code, 1.00, true, 0)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on profiles table
DROP TRIGGER IF EXISTS on_profile_updated_create_referral ON profiles;
CREATE TRIGGER on_profile_updated_create_referral
  AFTER INSERT OR UPDATE OF full_name ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.generate_referral_code();

-- Also create referral codes for existing users with full names
DO $$
DECLARE
  profile_record RECORD;
  first_name_val TEXT;
  base_code TEXT;
  final_code TEXT;
  counter INT;
BEGIN
  FOR profile_record IN SELECT id, full_name FROM profiles WHERE full_name IS NOT NULL AND full_name != '' LOOP
    first_name_val := split_part(profile_record.full_name, ' ', 1);
    base_code := first_name_val || 'Tech';
    final_code := base_code;
    counter := 0;
    
    -- Handle duplicates
    WHILE EXISTS (SELECT 1 FROM referral_codes WHERE code ILIKE final_code) LOOP
      counter := counter + 1;
      final_code := base_code || counter::TEXT;
    END LOOP;
    
    -- Insert if not exists
    INSERT INTO referral_codes (code, bonus_amount, is_active, usage_count)
    VALUES (final_code, 1.00, true, 0)
    ON CONFLICT DO NOTHING;
  END LOOP;
END;
$$;