Handlers.add("saveClient", Handlers.utils.hasMatchingTag("Action", "saveClient"), function(msg)
  print(msg.Tags)

  local stmt, err = DB:prepare [[
    REPLACE INTO users (id, email)
    VALUES (:id, :email);
  ]]

  if not stmt then
    error("Failed to prepare SQL statement: " .. DB:errmsg())
  end

  stmt:reset()
  stmt:bind_names({
    id = msg.Tags.id,
    email = msg.Tags.email
  })
  stmt:step()
end)


Handlers.add("getUserByEmail", Handlers.utils.hasMatchingTag("Action", "getUserByEmail"), function(msg)
  print(msg.Tags)
  local t = {}
  for row in DB:nrows("SELECT * FROM users WHERE email = ?", msg.Tags.email) do
    table.insert(t, string.format("%s: %s", row.id, row.email))
  end
  print(table.concat(t, "\n"))
end)

Handlers.add("getTest", Handlers.utils.hasMatchingTag("Action", "getTest"), function(msg)
  local t = {}
  for row in DB:nrows("SELECT * FROM test") do
    table.insert(t, string.format("%s: %s", row.id, row.content))
  end
  print(table.concat(t, "\n"))
end)


Handlers.add("allUser", Handlers.utils.hasMatchingTag("Action", "allUser"), function(msg)
  local t = {}
  for row in DB:nrows("SELECT * FROM users") do
    table.insert(t, string.format("%s: %s %s", row.id, row.email,row.address))
  end
  print(table.concat(t, "\n"))
end)
