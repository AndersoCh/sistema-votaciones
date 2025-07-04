const sql = require('mssql/msnodesqlv8');

const config = {
  server: 'localhost\\SQLEXPRESS',
  database: 'TuBaseDeDatos',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};

sql.connect(config)
  .then(pool => {
    return pool.request().query('SELECT GETDATE() AS now');
  })
  .then(result => {
    console.log('✅ Conectado:', result.recordset);
    sql.close();
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err);
    sql.close();
  });
