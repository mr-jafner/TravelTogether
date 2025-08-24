const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

class Database {
  constructor() {
    this.db = null;
  }

  // Initialize database connection and create tables
  async initialize() {
    return new Promise((resolve, reject) => {
      // Create database directory if it doesn't exist
      const dbDir = path.join(__dirname);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }

      // Connect to SQLite database
      const dbPath = path.join(__dirname, 'traveltogether.db');
      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err);
          reject(err);
        } else {
          console.log('Connected to SQLite database at:', dbPath);
          this.createTables()
            .then(() => resolve())
            .catch(reject);
        }
      });
    });
  }

  // Create all tables from schema
  async createTables() {
    return new Promise((resolve, reject) => {
      const schemaPath = path.join(__dirname, 'schema.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      
      // Split the schema into individual statements
      const statements = schema.split(';').filter(statement => statement.trim().length > 0);
      
      let completed = 0;
      const total = statements.length;
      
      if (total === 0) {
        resolve();
        return;
      }

      // Execute statements sequentially to avoid dependency issues
      const executeStatement = (index) => {
        if (index >= statements.length) {
          console.log('Database schema created successfully');
          resolve();
          return;
        }
        
        const statement = statements[index].trim();
        if (!statement) {
          executeStatement(index + 1);
          return;
        }
        
        this.db.run(statement, (err) => {
          if (err) {
            console.error(`Error executing statement ${index + 1}:`, err);
            console.error('Statement:', statement);
            reject(err);
            return;
          }
          
          executeStatement(index + 1);
        });
      };
      
      executeStatement(0);
    });
  }

  // Get database instance
  getDb() {
    return this.db;
  }

  // Close database connection
  close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) {
            console.error('Error closing database:', err);
            reject(err);
          } else {
            console.log('Database connection closed');
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  // Helper method to run queries with promise interface
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  // Helper method to get a single row
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Helper method to get all rows
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

// Create and export database instance
const database = new Database();

module.exports = database;