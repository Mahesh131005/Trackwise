const cron = require('node-cron');
const supabase = require('./db');

const processRecurringExpenses = async () => {
    console.log('🔄 Checking for recurring expenses...');
    const today = new Date().toISOString().split('T')[0];

    try {
        // Fetch recurring expenses due today or before
        const { data: recurring, error } = await supabase
            .from('recurring_expenses')
            .select('*')
            .lte('next_due_date', today);

        if (error) throw error;

        for (const item of recurring) {
            // Add to expenses table
            const { error: insertError } = await supabase
                .from('expenses')
                .insert([
                    {
                        user_id: item.user_id,
                        category: item.category,
                        amount: item.amount,
                        description: item.description || `Recurring: ${item.category}`,
                        created_at: new Date().toISOString(),
                    },
                ]);

            if (insertError) {
                console.error(`❌ Failed to add recurring expense for ${item.id}:`, insertError);
                continue;
            }

            // Calculate next due date
            let nextDate = new Date(item.next_due_date);
            if (item.frequency === 'monthly') {
                nextDate.setMonth(nextDate.getMonth() + 1);
            } else if (item.frequency === 'weekly') {
                nextDate.setDate(nextDate.getDate() + 7);
            } else if (item.frequency === 'yearly') {
                nextDate.setFullYear(nextDate.getFullYear() + 1);
            }

            // Update next_due_date
            const { error: updateError } = await supabase
                .from('recurring_expenses')
                .update({ next_due_date: nextDate.toISOString().split('T')[0] })
                .eq('id', item.id);

            if (updateError) {
                console.error(`❌ Failed to update next due date for ${item.id}:`, updateError);
            } else {
                console.log(`✅ Processed recurring expense: ${item.category} for user ${item.user_id}`);
            }
        }
    } catch (err) {
        console.error('❌ Error processing recurring expenses:', err);
    }
};

// Run every day at midnight
const startScheduler = () => {
    cron.schedule('0 0 * * *', processRecurringExpenses);
    console.log('⏰ Scheduler started: Checking recurring expenses daily at midnight.');
};

module.exports = { startScheduler };
