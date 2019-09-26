# Class Api
It is intended with this class to provide a mechanism that allows a way to prepare and map an API internally to the entity.  

## Functionality
This class will be responsible to provide methods as registration, send messages and reply to messages.

### Configurations

### Signals/Message Structure

#### Currently 
Currently the message structure is very simple and it is just composed by the message itself. The channel and entity are requested through the method arguments.

```js
{message: ...}
```

#### Near Future
It is our intention to make the message a little more structured and allowing other capabilities like traceability and encryption.

For this we will need to have ready the message class that will be responsible for the message structure and capabilities.

```js
{
    head: {
        id: <*>
        from: <hash>
        to: {
            entity: <name>
            channel: <name>
        }
        encryption: <tbd>
    }
    message: {
        ...
    }
    debug: {
        trace: [
            {time: <datetime>, head: ..., message: ...},
            ...
        ]
    }
}
```

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
