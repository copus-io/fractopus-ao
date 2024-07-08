local sqlite3 = require("lsqlite3")

DB = DB or sqlite3.open_memory()

-- 不能用 AUTO_INCREMENT
DB:exec [[
  CREATE TABLE users ( id INTEGER PRIMARY KEY, email);
  INSERT INTO users VALUES (NULL, 'Hello Lua');
]]


DB:exec[[
  CREATE TABLE test (id INTEGER PRIMARY KEY, content);
  INSERT INTO test VALUES (NULL, 'Hello Lua');
  INSERT INTO test VALUES (NULL, 'Hello Sqlite3');
  INSERT INTO test VALUES (NULL, 'Hello ao!!!');
  INSERT INTO test VALUES (NULL, 'Hello ao2!!!');
]]