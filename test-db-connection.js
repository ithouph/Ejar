import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Checking Supabase connection...\n');
console.log('URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
console.log('Anon Key:', supabaseAnonKey ? '✅ Set' : '❌ Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ Supabase credentials not found!');
  console.log('Please set these secrets in Replit:');
  console.log('- EXPO_PUBLIC_SUPABASE_URL');
  console.log('- EXPO_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('\n📊 Testing database connection...\n');

    // Test 1: Check if properties table exists
    console.log('1️⃣ Checking if properties table exists...');
    const { data: properties, error: propertiesError } = await supabase
      .from('properties')
      .select('*')
      .limit(1);

    if (propertiesError) {
      if (propertiesError.code === '42P01') {
        console.log('❌ Properties table does not exist');
        console.log('📝 You need to create tables in Supabase Dashboard');
        console.log('📄 Use the SQL from DATABASE_SCHEMA.md\n');
        return false;
      }
      throw propertiesError;
    }

    console.log('✅ Properties table exists');
    console.log(`   Found ${properties?.length || 0} existing properties\n`);

    // Test 2: Try to insert a test property
    console.log('2️⃣ Testing INSERT operation (adding test property)...');
    const testProperty = {
      title: 'Test Hotel - Ejar Connection Test',
      type: 'Hotel',
      location: 'Dubai, UAE',
      address: '123 Test Street, Downtown Dubai',
      description: 'This is a test property to verify database connection.',
      price_per_night: 299,
      rating: 4.5,
      total_reviews: 42,
      bedrooms: 2,
      bathrooms: 2,
      area_sqft: 850,
      agent_name: 'Test Agent',
    };

    const { data: insertedProperty, error: insertError } = await supabase
      .from('properties')
      .insert([testProperty])
      .select()
      .single();

    if (insertError) {
      console.log('❌ INSERT failed:', insertError.message);
      if (insertError.code === '42501') {
        console.log('📝 This might be a Row Level Security (RLS) policy issue');
        console.log('📄 Check DATABASE_RLS_POLICIES.md for setup\n');
      }
      return false;
    }

    console.log('✅ Test property added successfully!');
    console.log('   Property ID:', insertedProperty.id);
    console.log('   Title:', insertedProperty.title, '\n');

    // Test 3: Read back the inserted property
    console.log('3️⃣ Testing SELECT operation (reading back)...');
    const { data: readProperty, error: readError } = await supabase
      .from('properties')
      .select('*')
      .eq('id', insertedProperty.id)
      .single();

    if (readError) {
      console.log('❌ SELECT failed:', readError.message);
      return false;
    }

    console.log('✅ Property read successfully!');
    console.log('   Title:', readProperty.title);
    console.log('   Location:', readProperty.location);
    console.log('   Price:', readProperty.price_per_night, 'per night\n');

    // Test 4: Clean up - delete test property
    console.log('4️⃣ Testing DELETE operation (cleanup)...');
    const { error: deleteError } = await supabase
      .from('properties')
      .delete()
      .eq('id', insertedProperty.id);

    if (deleteError) {
      console.log('⚠️ DELETE failed:', deleteError.message);
      console.log('   Test property remains in database (ID: ' + insertedProperty.id + ')');
    } else {
      console.log('✅ Test property deleted successfully\n');
    }

    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Database connection test PASSED!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('✅ Supabase is connected and working');
    console.log('✅ INSERT operations work');
    console.log('✅ SELECT operations work');
    console.log(deleteError ? '⚠️ DELETE operations have issues' : '✅ DELETE operations work');
    console.log('\n📱 Your app can now use Supabase!\n');
    
    return true;

  } catch (error) {
    console.error('\n❌ Connection test failed:', error.message);
    console.error('Error details:', error);
    return false;
  }
}

testConnection();
