-- Enable Row Level Security
--ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  timezone TEXT DEFAULT 'UTC',
  email_notifications BOOLEAN DEFAULT true,
  reminder_preferences JSONB DEFAULT '{"same_day": true, "day_before": true}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create holidays table
CREATE TABLE public.holidays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  local_name TEXT,
  date DATE NOT NULL,
  country_code TEXT NOT NULL,
  country_name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'public', 'religious', 'observance', 'national'
  description TEXT,
  is_global BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_holidays table (many-to-many relationship)
CREATE TABLE public.user_holidays (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  holiday_id UUID REFERENCES public.holidays(id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT false,
  reminder_enabled BOOLEAN DEFAULT true,
  custom_reminder_time INTERVAL DEFAULT '0 days',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, holiday_id)
);

-- Create email_reminders table
CREATE TABLE public.email_reminders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  holiday_id UUID REFERENCES public.holidays(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL, -- 'same_day', 'day_before', 'custom'
  scheduled_for TIMESTAMP WITH TIME ZONE NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_holidays_country_date ON public.holidays(country_code, date);
CREATE INDEX idx_user_holidays_user_id ON public.user_holidays(user_id);
CREATE INDEX idx_email_reminders_scheduled ON public.email_reminders(scheduled_for, status);
CREATE INDEX idx_email_reminders_user ON public.email_reminders(user_id);

-- Enable Row Level Security
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_reminders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can view holidays" ON public.holidays
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can view own user_holidays" ON public.user_holidays
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own reminders" ON public.email_reminders
  FOR ALL USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
