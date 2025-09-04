const database = require('../init.js');

async function applyMigration() {
  try {
    console.log('Applying permission system migration...');
    
    // Initialize database first
    await database.initialize();
    
    // Check if columns exist before adding them
    const checkCreatedBy = await database.all("PRAGMA table_info(trips)");
    const hasCreatedBy = checkCreatedBy.some(col => col.name === 'created_by');
    
    const checkRole = await database.all("PRAGMA table_info(participants)");  
    const hasRole = checkRole.some(col => col.name === 'role');
    
    // Add created_by column if it doesn't exist
    if (!hasCreatedBy) {
      console.log('Adding created_by column to trips table...');
      await database.run('ALTER TABLE trips ADD COLUMN created_by TEXT');
      console.log('✓ created_by column added');
    } else {
      console.log('✓ created_by column already exists');
    }
    
    // Add role column if it doesn't exist
    if (!hasRole) {
      console.log('Adding role column to participants table...');
      await database.run("ALTER TABLE participants ADD COLUMN role TEXT DEFAULT 'participant'");
      console.log('✓ role column added');
    } else {
      console.log('✓ role column already exists');
    }
    
    // Set up creator roles for existing trips
    console.log('Setting up creator roles for existing trips...');
    const tripsWithoutCreators = await database.all("SELECT id FROM trips WHERE created_by IS NULL");
    
    for (const trip of tripsWithoutCreators) {
      // Get first participant for this trip
      const firstParticipant = await database.get(
        "SELECT name FROM participants WHERE trip_id = ? ORDER BY joined_at ASC LIMIT 1",
        [trip.id]
      );
      
      if (firstParticipant) {
        // Set this participant as creator
        await database.run(
          "UPDATE participants SET role = 'creator' WHERE trip_id = ? AND name = ?",
          [trip.id, firstParticipant.name]
        );
        
        // Set created_by in trips table
        await database.run(
          "UPDATE trips SET created_by = ? WHERE id = ?",
          [firstParticipant.name, trip.id]
        );
        
        console.log(`✓ Set ${firstParticipant.name} as creator of trip ${trip.id}`);
      }
    }
    
    // Create indexes if they don't exist
    try {
      await database.run("CREATE INDEX IF NOT EXISTS idx_participants_role ON participants (trip_id, role)");
      await database.run("CREATE INDEX IF NOT EXISTS idx_trips_created_by ON trips (created_by)");
      console.log('✓ Indexes created');
    } catch (error) {
      console.log('✓ Indexes may already exist');
    }
    
    console.log('Migration completed successfully!');
    
    // Verify the migration worked - check if columns exist first
    try {
      const trips = await database.all('SELECT id, name, created_by FROM trips LIMIT 3');
      console.log('\nVerification - Recent trips:');
      console.table(trips);
    } catch (error) {
      console.log('created_by column may not have been added yet');
    }
    
    try {
      const participants = await database.all('SELECT id, name, role FROM participants LIMIT 3');
      console.log('\nVerification - Recent participants:');
      console.table(participants);
    } catch (error) {
      console.log('role column may not have been added yet');
    }
    
    console.log('\nVerification - Recent trips:');
    console.table(trips);
    console.log('\nVerification - Recent participants:');
    console.table(participants);
    
    process.exit(0);
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

applyMigration();