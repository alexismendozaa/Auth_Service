const fs = require('fs');
const path = require('path');

describe('Verificación de app.js en microservicio', () => {
  it('Debería existir el archivo app.js', () => {
    const filePath = path.join(__dirname, '../app.js');
    expect(fs.existsSync(filePath)).toBe(true);
  });
});
