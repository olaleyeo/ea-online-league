const { Pool } = require('pg');
try {
  new Pool({ connectionString: undefined });
  console.log('success');
} catch (e) {
  console.log('error:', e);
}
