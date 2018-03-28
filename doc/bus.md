# Class Bus
It is intended with this class to provide the communication mechanism that allows entity/channel registration. This 
will be the glue, the common shared space that connects the same and the next layer in the stack (as shown in the image) 
of the main [README](https://github.com/impulsesjs/impulses/blob/dev/README.md) file.  

## Data Structures

```js
/**
 * @typedef {object} ChannelInfo
 *      @property {string} name Channel name
 *      @property {string} entity Responsible entity
 *      @property {object} require Required fields
 *      @property {ChannelClass} channel Channel reference
 *
 * @typedef {ChannelInfo[]} ChannelsInfo
 */
```


## Functionality
This class will be responsible to provide mechanisms like registration, fetch (for usage) and discovery of 
entity/channels.

### Registration

```js
let bus = new CommBus()
let name = bus.register(channelsConfiguration)
```

#### Get Information

```js
let channelObj = bus.get(entityName, channelName)
```

#### Discovery

```js
let status = bus.exists(entityName, channelName)
```


