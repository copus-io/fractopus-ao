local bint = require('.bint')(256)
local ao = require('.ao')
local json = require('json')

local utils = {
  add = function(a, b)
    return tostring(bint(a) + bint(b))
  end,
  subtract = function(a, b)
    return tostring(bint(a) - bint(b))
  end,
  toBalanceValue = function(a)
    return tostring(bint(a))
  end,
  toNumber = function(a)
    return tonumber(a)
  end
}

Variant = "0.0.3"

Denomination = Denomination or 6

Balances = Balances or { [ao.id] = utils.toBalanceValue(0 * 10 ^ Denomination) }

TotalSupply = TotalSupply or utils.toBalanceValue(0 * 10 ^ Denomination)

Name = Name or 'Drip Coin'

Ticker = Ticker or 'Drip'

Logo = Logo or 'MV109m2lXmcBwski_vnKVCfqxhjui4SifDBXicq3iwM'

-- Send({Target=ao.id,Action="setInfo",Tags={Name="Drips1",Logo="SBCCXwwecBlDqRLUjb8dYABExTJXLieawf7m2aBJ"}})
Handlers.add('setInfo', Handlers.utils.hasMatchingTag('Action', 'setInfo'), function(msg)
  assert(msg.From == ao.id, 'You are not the admin!')
  if string.len(msg.Tags.Name) > 0 then
    Name = msg.Tags.Name;
  end
  if string.len(msg.Tags.Logo) > 0 then
    Logo = msg.Tags.Logo;
  end

  local info = { name = Name, logo = Logo, denomination = tostring(Denomination) }
  ao.send({
    Target = ao.id,
    Name = Name,
    Ticker = Ticker,
    Logo = Logo,
    Denomination = tostring(Denomination),
    Data = json.encode(info)
  })
end)



Handlers.add('info', Handlers.utils.hasMatchingTag('Action', 'Info'), function(msg)
  ao.send({
    Target = ao.id,
    Name = Name,
    Ticker = Ticker,
    Logo = Logo,
    Denomination = tostring(Denomination)
  })
end)

Handlers.add('balance', Handlers.utils.hasMatchingTag('Action', 'Balance'), function(msg)
  local bal = '0'
  if (msg.Tags.Recipient) then
    if (Balances[msg.Tags.Recipient]) then
      bal = Balances[msg.Tags.Recipient]
    end
  elseif msg.Tags.Target and Balances[msg.Tags.Target] then
    bal = Balances[msg.Tags.Target]
  elseif Balances[msg.From] then
    bal = Balances[msg.From]
  end

  ao.send({
    Target = ao.id,
    Balance = bal,
    Ticker = Ticker,
    Account = msg.Tags.Recipient or msg.From,
    Data = bal
  })
end)

Handlers.add('balances', Handlers.utils.hasMatchingTag('Action', 'Balances'),
  function(msg) ao.send({ Target = ao.id, Data = json.encode(Balances) }) end)

Handlers.add('transfer', Handlers.utils.hasMatchingTag('Action', 'Transfer'), function(msg)
  assert(type(msg.Tags.Sender) == 'string', 'Sender is required!')
  assert(type(msg.Tags.Recipient) == 'string', 'Recipient is required!')
  assert(type(msg.Tags.Quantity) == 'string', 'Quantity is required!')
  assert(bint.__lt(0, bint(msg.Tags.Quantity)), 'Quantity must be greater than 0')
  assert(msg.From == ao.id or msg.From == Owner, 'You are not the admin!')

  if not Balances[msg.Tags.Sender] then Balances[msg.Tags.Sender] = "0" end
  if not Balances[msg.Tags.Recipient] then Balances[msg.Tags.Recipient] = "0" end

  if bint(msg.Tags.Quantity) <= bint(Balances[msg.Tags.Sender]) then
    Balances[msg.Tags.Sender] = utils.subtract(Balances[msg.Tags.Sender], msg.Tags.Quantity)
    Balances[msg.Tags.Recipient] = utils.add(Balances[msg.Tags.Recipient], msg.Tags.Quantity)

    if not msg.Cast then
      local debitNotice = {
        Target = msg.Tags.Sender,
        Action = 'Debit-Notice',
        Sender = msg.Tags.Sender,
        SourceAction = 'Transfer',
        Quantity = msg.Tags.Quantity,
        Recipient = msg.Tags.Recipient,
        Data = "You transferred " .. msg.Tags.Quantity .. " to " ..  msg.Tags.Recipient 
      }

      local creditNotice = {
        Target = msg.Tags.Recipient,
        Action = 'Credit-Notice',
        Sender = msg.Tags.Sender,
        SourceAction = 'Transfer',
        Quantity =  msg.Tags.Quantity,
        Recipient = msg.Tags.Recipient,
        Data = "You received " ..  msg.Tags.Quantity .. " from " .. msg.Tags.Sender 
      }

      for tagName, tagValue in pairs(msg) do
        if string.sub(tagName, 1, 2) == "X-" then
          debitNotice[tagName] = tagValue
          creditNotice[tagName] = tagValue
        end
      end
      ao.send(debitNotice)
      ao.send(creditNotice)
    end
  else
    ao.send({
      Target = ao.id,
      Action = 'Transfer-Error',
      ['Message-Id'] = msg.Id,
      Error = 'Insufficient Balance!'
    })
  end
end)

Handlers.add('mint', Handlers.utils.hasMatchingTag('Action', 'Mint'), function(msg)
  assert(type(msg.Tags.Quantity) == 'string', 'Quantity is required!')
  assert(bint(0) < bint(msg.Tags.Quantity), 'Quantity must be greater than zero!')

  if msg.From == ao.id or msg.From == Owner then
    if not Balances[msg.Tags.Recipient] then Balances[msg.Tags.Recipient] = "0" end
    Balances[msg.Tags.Recipient] = utils.add(Balances[msg.Tags.Recipient], msg.Tags.Quantity)
    TotalSupply = utils.add(TotalSupply, msg.Tags.Quantity)

    local creditNotice = {
      Target = msg.Tags.Recipient,
      Action = 'Credit-Notice',
      SourceAction = 'Mint',
      Quantity =  msg.Tags.Quantity,
      Data = "Minted " .. msg.Tags.Quantity .. ' to you'
    }
    for tagName, tagValue in pairs(msg) do
      if string.sub(tagName, 1, 2) == "X-" then
        creditNotice[tagName] = tagValue
      end
    end
    ao.send(creditNotice)
  else
    ao.send({
      Target = ao.id,
      Action = 'Mint-Error',
      ['Message-Id'] = msg.Id,
      Error = 'Only the Process Id can mint new ' .. Ticker .. ' tokens!'
    })
  end
end)

Handlers.add('totalSupply', Handlers.utils.hasMatchingTag('Action', 'TotalSupply'), function(msg)
  assert(msg.From ~= ao.id, 'Cannot call Total-Supply from the same process!')
  ao.send({
    Target = ao.id,
    Action = 'TotalSupplyResp',
    Data = TotalSupply,
    Ticker = Ticker
  })
end)

Handlers.add('burn', Handlers.utils.hasMatchingTag('Action', 'Burn'), function(msg)
  assert(msg.From == ao.id or msg.From == Owner, 'You are not the admin!')
  assert(type(msg.Tags.Quantity) == 'string', 'Quantity is required!')
  assert(bint(msg.Tags.Quantity) <= bint(Balances[msg.Tags.TargetUser]),
    'Quantity must be less than or equal to the current balance!')

  Balances[msg.Tags.TargetUser] = utils.subtract(Balances[msg.Tags.TargetUser], msg.Tags.Quantity)
  TotalSupply = utils.subtract(TotalSupply, msg.Tags.Quantity)

  local debitNotice = {
    Target = msg.Tags.TargetUser,
    Action = 'Debit-Notice',
    SourceAction = 'Burn',
    Quantity = msg.Tags.Quantity,
    Data = "You burned " .. msg.Tags.Quantity
  }
  for tagName, tagValue in pairs(msg) do
    if string.sub(tagName, 1, 2) == "X-" then
      debitNotice[tagName] = tagValue
    end
  end
  ao.send(debitNotice)
end)
