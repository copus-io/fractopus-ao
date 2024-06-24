-- https://github.com/permaweb/ao/blob/main/lua-examples/ao-standard-token/token.lua

local bint = require('.bint')(256)
local ao = require('ao')
local json = require('json')

if not Balances then Balances = { [ao.id] = tostring(bint(80000 * 1e12)) } end

if Name ~= 'Drip Coin' then Name = 'Drip Coin' end

if Ticker ~= 'Drip' then Ticker = 'Drip' end

if Denomination ~= 12 then Denomination = 12 end

if not Logo then Logo = 'SBCCXwwecBlDqRLUjb8dYABExTJXLieawf7m2aBJ-KY' end

Handlers.add('info', Handlers.utils.hasMatchingTag('Action', 'Info'), function(msg)
  ao.send({
    Target = msg.From,
    Name = Name,
    Ticker = Ticker,
    Logo = Logo,
    Denomination = tostring(Denomination)
  })
end)

--[[
     Balance
   ]]
--
Handlers.add('balance', Handlers.utils.hasMatchingTag('Action', 'Balance'), function(msg)
  local bal = '0'

  -- If not Target is provided, then return the Senders balance
  if (msg.Tags.Target and Balances[msg.Tags.Target]) then
    bal = Balances[msg.Tags.Target]
  elseif Balances[msg.From] then
    bal = Balances[msg.From]
  end

  ao.send({
    Target = msg.From,
    Balance = bal,
    Ticker = Ticker,
    Account = msg.Tags.Target or msg.From,
    Data = bal
  })
end)

--[[
     Balances
   ]]
--
Handlers.add('balances', Handlers.utils.hasMatchingTag('Action', 'Balances'),
  function(msg) ao.send({ Target = msg.From, Data = json.encode(Balances) }) end)

--[[
     Transfer
   ]]
--
Handlers.add('transfer', Handlers.utils.hasMatchingTag('Action', 'Transfer'), function(msg)
  assert(type(msg.Recipient) == 'string', 'Recipient is required!')
  assert(type(msg.Quantity) == 'string', 'Quantity is required!')
  assert(bint.__lt(0, bint(msg.Quantity)), 'Quantity must be greater than 0')

  if not Balances[msg.From] then Balances[msg.From] = "0" end
  if not Balances[msg.Recipient] then Balances[msg.Recipient] = "0" end

  local qty = bint(msg.Quantity)
  local balance = bint(Balances[msg.From])
  if bint.__le(qty, balance) then
    Balances[msg.From] = tostring(bint.__sub(balance, qty))
    Balances[msg.Recipient] = tostring(bint.__add(Balances[msg.Recipient], qty))

    --[[
         Only send the notifications to the Sender and Recipient
         if the Cast tag is not set on the Transfer message
       ]]
    --
    if not msg.Cast then
      -- Send Debit-Notice to the Sender
      ao.send({
        Target = msg.From,
        Action = 'Debit-Notice',
        Recipient = msg.Recipient,
        Quantity = tostring(qty),
        Data = Colors.gray .. "You transferred " .. Colors.blue .. msg.Quantity .. Colors.gray .. " to " .. Colors.green .. msg.Recipient .. Colors.reset
      })
      -- Send Credit-Notice to the Recipient
      ao.send({
        Target = msg.Recipient,
        Action = 'Credit-Notice',
        Sender = msg.From,
        Quantity = tostring(qty),
        Data = Colors.gray .. "You received " .. Colors.blue .. msg.Quantity .. Colors.gray .. " from " .. Colors.green .. msg.Recipient .. Colors.reset
      })
    end
  else
    ao.send({
      Target = msg.From,
      Action = 'Transfer-Error',
      ['Message-Id'] = msg.Id,
      Error = 'Insufficient Balance!'
    })
  end
end)

--[[
    Mint
   ]]
--
Handlers.add('mint', Handlers.utils.hasMatchingTag('Action', 'Mint'), function (msg)
  assert(type(msg.Quantity) == 'string', 'Quantity is required!')
  assert(bint.__lt(0, msg.Quantity), 'Quantity must be greater than zero!')

  if not Balances[ao.id] then Balances[ao.id] = "0" end

  if msg.From == ao.id then
    -- Add tokens to the token pool, according to Quantity
    Balances[msg.From] = tostring(bint.__add(Balances[Owner], msg.Quantity))
    ao.send({
      Target = msg.From,
      Data = Colors.gray .. "Successfully minted " .. Colors.blue .. msg.Quantity .. Colors.reset
    })
  else
    ao.send({
      Target = msg.From,
      Action = 'Mint-Error',
      ['Message-Id'] = msg.Id,
      Error = 'Only the Process Owner can mint new ' .. Ticker .. ' tokens!'
    })
  end
end)