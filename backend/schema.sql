-- Create budgets table
CREATE TABLE IF NOT EXISTS budgets (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category VARCHAR(255) NOT NULL,
    amount NUMERIC NOT NULL,
    month VARCHAR(7) NOT NULL, -- Format: 'YYYY-MM'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, category, month)
);

-- Create recurring_expenses table
CREATE TABLE IF NOT EXISTS recurring_expenses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    category VARCHAR(255) NOT NULL,
    amount NUMERIC NOT NULL,
    description TEXT,
    frequency VARCHAR(50) DEFAULT 'monthly',
    next_due_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS (Row Level Security) if not already enabled
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE recurring_expenses ENABLE ROW LEVEL SECURITY;

-- Create policies for budgets
CREATE POLICY "Users can view their own budgets" ON budgets
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budgets" ON budgets
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets" ON budgets
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets" ON budgets
    FOR DELETE USING (auth.uid() = user_id);

-- Create policies for recurring_expenses
CREATE POLICY "Users can view their own recurring expenses" ON recurring_expenses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recurring expenses" ON recurring_expenses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recurring expenses" ON recurring_expenses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recurring expenses" ON recurring_expenses
    FOR DELETE USING (auth.uid() = user_id);
