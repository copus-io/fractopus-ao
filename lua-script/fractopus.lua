Handlers.add(
  "ping",
  Handlers.utils.hasMatchingData("ping"),
  Handlers.utils.reply("pong")
)

Handlers.add(
  "Info",
  Handlers.utils.hasMatchingTag("Action","Info"),
  function (msg)
    ao.send({
      Target =msg.From,
      Name = Name,
      Data = msg.Data
    })
  end)