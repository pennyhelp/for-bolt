import { supabase } from '../integrations/supabase/client';

export const setupInitialData = async () => {
  try {
    console.log('Setting up initial database data...');

    // Check if tables exist and have data
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);

    if (categoriesError) {
      console.error('Categories table error:', categoriesError);
      throw new Error(`Categories table error: ${categoriesError.message}`);
    }

    // If no categories exist, insert initial data
    if (!categoriesData || categoriesData.length === 0) {
      console.log('No categories found, inserting initial data...');
      
      const initialCategories = [
        {
          name: 'Pennyekart Free Registration',
          description: 'Totally free registration with free delivery between 2pm to 6pm. Basic level access to hybrid ecommerce platform.',
          actual_fee: 0,
          offer_fee: 0,
          is_active: true
        },
        {
          name: 'Pennyekart Paid Registration',
          description: 'Premium registration with any time delivery between 8am to 7pm. Full access to all platform features.',
          actual_fee: 500,
          offer_fee: 299,
          is_active: true
        },
        {
          name: 'Farmelife',
          description: 'Connected with dairy farm, poultry farm and agricultural businesses.',
          actual_fee: 750,
          offer_fee: 499,
          is_active: true
        },
        {
          name: 'Organelife',
          description: 'Connected with vegetable and house gardening, especially terrace vegetable farming.',
          actual_fee: 600,
          offer_fee: 399,
          is_active: true
        },
        {
          name: 'Foodlife',
          description: 'Connected with food processing business and culinary services.',
          actual_fee: 800,
          offer_fee: 599,
          is_active: true
        },
        {
          name: 'Entrelife',
          description: 'Connected with skilled projects like stitching, art works, various home services.',
          actual_fee: 700,
          offer_fee: 499,
          is_active: true
        },
        {
          name: 'Job Card',
          description: 'Special offer card with access to all categories, special discounts, and investment benefits. Best choice for comprehensive registration.',
          actual_fee: 2000,
          offer_fee: 999,
          is_active: true
        }
      ];

      const { error: insertCategoriesError } = await supabase
        .from('categories')
        .insert(initialCategories);

      if (insertCategoriesError) {
        console.error('Error inserting categories:', insertCategoriesError);
        throw insertCategoriesError;
      }

      console.log('Categories inserted successfully');
    }

    // Check and insert panchayaths
    const { data: panchayathsData, error: panchayathsError } = await supabase
      .from('panchayaths')
      .select('*')
      .limit(1);

    if (panchayathsError) {
      console.error('Panchayaths table error:', panchayathsError);
      throw new Error(`Panchayaths table error: ${panchayathsError.message}`);
    }

    if (!panchayathsData || panchayathsData.length === 0) {
      console.log('No panchayaths found, inserting initial data...');
      
      const initialPanchayaths = [
        {
          name: 'Amarambalam',
          district: 'Malappuram',
          is_active: true
        },
        {
          name: 'Kondotty',
          district: 'Malappuram',
          is_active: true
        },
        {
          name: 'Perinthalmanna',
          district: 'Malappuram',
          is_active: true
        }
      ];

      const { error: insertPanchayathsError } = await supabase
        .from('panchayaths')
        .insert(initialPanchayaths);

      if (insertPanchayathsError) {
        console.error('Error inserting panchayaths:', insertPanchayathsError);
        throw insertPanchayathsError;
      }

      console.log('Panchayaths inserted successfully');
    }

    // Check and insert admins
    const { data: adminsData, error: adminsError } = await supabase
      .from('admins')
      .select('*')
      .limit(1);

    if (adminsError) {
      console.error('Admins table error:', adminsError);
      throw new Error(`Admins table error: ${adminsError.message}`);
    }

    if (!adminsData || adminsData.length === 0) {
      console.log('No admins found, inserting initial data...');
      
      const initialAdmins = [
        {
          username: 'evaadmin',
          password: 'eva919123',
          role: 'super',
          is_active: true
        },
        {
          username: 'admin1',
          password: 'elife9094',
          role: 'local',
          is_active: true
        },
        {
          username: 'admin2',
          password: 'penny9094',
          role: 'user',
          is_active: true
        }
      ];

      const { error: insertAdminsError } = await supabase
        .from('admins')
        .insert(initialAdmins);

      if (insertAdminsError) {
        console.error('Error inserting admins:', insertAdminsError);
        throw insertAdminsError;
      }

      console.log('Admins inserted successfully');
    }

    // Check and insert announcements
    const { data: announcementsData, error: announcementsError } = await supabase
      .from('announcements')
      .select('*')
      .limit(1);

    if (announcementsError) {
      console.error('Announcements table error:', announcementsError);
      // Don't throw error for announcements as it's not critical
    } else if (!announcementsData || announcementsData.length === 0) {
      console.log('No announcements found, inserting initial data...');
      
      const initialAnnouncements = [
        {
          title: 'Welcome to E-LIFE SOCIETY',
          content: 'Join our hybrid ecommerce platform and start your self-employment journey today!',
          is_active: true
        },
        {
          title: 'Special Offer on Job Card',
          content: 'Get access to all categories with our special Job Card registration. Limited time offer!',
          is_active: true
        }
      ];

      const { error: insertAnnouncementsError } = await supabase
        .from('announcements')
        .insert(initialAnnouncements);

      if (insertAnnouncementsError) {
        console.error('Error inserting announcements:', insertAnnouncementsError);
        // Don't throw error for announcements
      } else {
        console.log('Announcements inserted successfully');
      }
    }

    console.log('Database setup completed successfully!');
    return { success: true, message: 'Database setup completed successfully!' };

  } catch (error) {
    console.error('Database setup failed:', error);
    return { success: false, message: error.message };
  }
};

export const checkDatabaseTables = async () => {
  try {
    console.log('Checking database tables...');
    
    const tables = ['categories', 'panchayaths', 'admins', 'registrations', 'announcements'];
    const results = {};
    
    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          results[table] = { exists: false, error: error.message };
        } else {
          results[table] = { exists: true, count: count || 0 };
        }
      } catch (err) {
        results[table] = { exists: false, error: err.message };
      }
    }
    
    console.log('Database table check results:', results);
    return results;
  } catch (error) {
    console.error('Error checking database tables:', error);
    return { error: error.message };
  }
};