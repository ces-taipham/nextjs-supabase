-- Add auth_user_id column to employees table to link with Supabase auth

ALTER TABLE public.employees 
ADD COLUMN auth_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX idx_employees_auth_user_id ON public.employees(auth_user_id);

-- Make auth_user_id unique to ensure one employee per auth user
ALTER TABLE public.employees 
ADD CONSTRAINT employees_auth_user_id_unique UNIQUE (auth_user_id);