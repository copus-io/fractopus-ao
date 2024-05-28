local json = require("json")
FractOpus = {}

-- Send({Target=ao.id,Action="save",Tags={uri="www.baidu.com"}, Data="{'uri':'www.baidu.com'}"})
Handlers.add(
  "save",
  Handlers.utils.hasMatchingTag("Action","save"),
  function (message)
    print(message.Data)
    FractOpus[message.Tags.uri]=message.Data
  end
)
