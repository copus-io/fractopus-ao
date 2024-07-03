local crypto = require(".crypto");
local json = require('json')



-- Send({Target=ao.id,Action= "addClient",Tags={email="1232@163.com"}})
Handlers.add("addClient",
  Handlers.utils.hasMatchingTag("Action", "addClient"),
  function(msg)
    assert(msg.From == ao.id, "You are not the admin")
    assert(string.len(msg.Tags.email) > 0, "email is empty")
    local email = msg.Tags.email
    local md5 = crypto.digest.md5(crypto.utils.stream.fromString(email)).asHex()
    Clients[md5] = { email = email }
    ao.send({
      Target = msg.From,
      Action = 'addClientResp',
      Data = json.encode(Clients),
    })
  end)


-- Send({Target=ao.id,Action= "getClient",Tags={email="1232@163.com"}})
Handlers.add("getClient",
  Handlers.utils.hasMatchingTag("Action", "getClient"),
  function(msg)
    assert(string.len(msg.Tags.email) > 0, "email is empty")
    local email = msg.Tags.email
    local temp = crypto.utils.stream.fromString(email)
    local md5 = crypto.digest.md5(temp).asHex()
    if Clients[md5] ~= nil then
      ao.send({
        Target = msg.From,
        Action = 'getClientResp',
        Data = Clients[md5],
      })
    else
      ao.send({
        Target = msg.From,
        Action = 'getClientResp-Error',
        Data = "not exist",
      })
    end
  end)
