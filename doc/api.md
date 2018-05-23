# Class Bus
It is intended with this class to provide a mechanism that allows a way to prepare and map an API internally to the entity.  

## Functionality
This class will be responsible to provide methods as registration, send messages and reply to messages.

### Registration

```js
let api = new Api()
api.setPublicBus(varPublicBus)
api.registerPublic(channelsConfiguration)
```

#### Send messages

```js
api.sendPublic(message)
```

#### Discovery

```js
let status = bus.exists(entityName, channelName)
```
