local json = require("json")
Fractopus = {}

-- Send({Target=ao.id,Action="Save",Tags={uri="www.baidu.com"}, Data="{'uri':'www.baidu.com'}"})
Handlers.add(
  "save",
  Handlers.utils.hasMatchingTag("Action", "Save"),
  function(msg)
    local src = msg.Tags.src;
    if src == nil then
      src = ""
    end

    Fractopus[msg.Tags.uri] = src
    local resp = {
      Target = msg.From,
      Action = "Fractopus-Save-Success",
      SourceAction = 'Save'
    }
    for tagName, tagValue in pairs(msg) do
      if string.sub(tagName, 1, 2) == "X-" then
        resp[tagName] = tagValue
      end
    end

    ao.send(resp)
  end
)

-- Send({Target=ao.id,Action="Get",Tags={uri="www.baidu.com"}})
Handlers.add(
  "get",
  Handlers.utils.hasMatchingTag("Action", "Get"),
  function(msg)
    ao.send({ Target = ao.id, Data = Fractopus[msg.Tags.uri] })
  end
)
