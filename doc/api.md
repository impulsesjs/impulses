# Class Bus
It is intended with this class to provide a mechanism that allows a way to prepare and map an API internally to the entity.  

## Functionality
This class will be responsible to provide methods as registration, send messages and reply to messages.

### Configurations

### Registration
It is possible to prepare the new instance by configuration or interactively

#### By Configuration
```js
let api = new Api(varConfiguration, varPublicBus, varPrivateBus)
```

#### Interactive
```js
let api = new Api()

// Sets the public bus
api.setPublicBus(varPublicBus)

// Sets the private bus
api.setPrivateBus(varPrivateBus)

// Register public channels
api.registerPublic(publicChannelsConfiguration)

// Register private channels
api.registerPrivate(privateChannelsConfiguration)
```

#### Get identification
```js
cost apiId = api.getId()
```

#### Verification
```js
// Check if public bus is set
api.hasPublic()

// Check if private bus is set
api.hasPrivate()
```

#### Send messages
```js
// send a message to a public channel
let firstMessageId = api.sendPublic(entity, channel, message)

// send a message to a private channel
let secondMessageId = api.sendPrivate(entity, channel, message)
```

#### Discovery
```js
// Check if the channel exists (in both private and public)
let status = bus.exists(entityName, channelName)

// Check if the channel exists as public
let statusPublic = bus.existsInPublic(entityName, channelName)

// Check if the channel exists as private
let statusPrivate = bus.existsInPrivate(entityName, channelName)
```
