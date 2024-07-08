local sqlite3 = require("lsqlite3")

DB = DB or sqlite3.open_memory()

-- 不能用 AUTO_INCREMENT

-- 删除表 Drop TABLE users;
DB:exec [[
  Drop TABLE users;
  CREATE TABLE users ( id INTEGER PRIMARY KEY, email VARCHAR(20), address VARCHAR(60));
  INSERT INTO users VALUES (NULL, 'Hello Lua1',10);
  INSERT INTO users VALUES (NULL, 'Hello Lua2',101);
  INSERT INTO users VALUES (NULL, 'Hello Lua3',102);
  INSERT INTO users VALUES (NULL, 'Hello Lua4',103);
]]


DB:exec[[
  CREATE TABLE test (id INTEGER PRIMARY KEY, content);
  INSERT INTO test VALUES (NULL, 'Hello Lua');
  INSERT INTO test VALUES (NULL, 'Hello Sqlite3');
  INSERT INTO test VALUES (NULL, 'Hello ao!!!');
  INSERT INTO test VALUES (NULL, 'Hello ao2!!!');
]]