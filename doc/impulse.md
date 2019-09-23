# Class Impulse
It is intended with this class to provide a mechanism that allows a way to handle an impulse (message).  

## Functionality
This class is responsible to manage the message to be sent.
It is supposed to enable:
- Head Information management
    - Sender
    - Recipients (Channels)
    - Encryption (future)
    - Extra information for tracing and debugging
- Impulse content management

#### Impulse structure

```js
{
    info: {
        id: <message_id> // format: m.XXXXX
        from: <hash>
        to: {
            entity: <name>
            channel: <name>
        }
        replyTo: <message_id>
        options: {
            trace: <boolean> // Get the impulse trace from start to end
            debug: <boolean> // Get the specific entities that handle the impulse (name, instance, version, ip...)
        }
        encryption: <tbd>
    }
    content: {
        ...
    }
    debug: {
        trace: [
            {time: <datetime>, head: ..., message: ...},
            ...
        ]
        entities: [
            {hash: <string>, name: <string>, instance: <string>, version: <string>, ip: <string>...}
        ]
    }
}
```

### Creation
An impulse object will be available by instatiation, with no information, or providing a single or a list of channels send it.
> **NOTE**: for encryption, the impulse generation must be requested to the API (the one that should have the secrets configured) on the send moment.

#### By Definition
*Example 1*
```js
let impulse = new Impulse(emitterId, entityName, channelName)
```
*Example 2*
```js
let impulse = new Impulse(emitterId, {entity: entityName, channel: channelName})
```
*Example 3*
```js
let impulse = new Impulse(emitterId, [
    {entity: entityNameA, channel: channelNameA_A}
    {entity: entityNameA, channel: channelNameA_B}
    {entity: entityNameB, channel: channelNameB_A}
])
```
*Example 4*
```js
let impulse = new Impulse(emitterId, [
    {entity: entityNameA, channels: [channelNameA_A, channelNameA_B]}
    {entity: entityNameB, channel: channelNameB_A}
])
```

#### Interactively

*Example 1*
```js
let impulse = new Impulse()
// Sets the Emitter ID
impulse.setEmitterId(emitterId)
// Adds a channel to send the impulse
impulse.addChannel(entityName, channelName)
```
*Example 2*
```js
let impulse = new Impulse(emitterId)
// Adds a channel to send the impulse
impulse.addChannel(entityName, channelName)
```

#### Add channel to send impulse
```js
impulse.addChannel(entityName, channelName)
```

### Content Management

#### Add/Set content
```js
impulse.setContent(partName, partContent)
```

#### Get content
```js
let contentPart = impulse.getContent(partName)
let allContent = impulse.getContent()
```

#### Remove content
```js
impulse.removeContent(partName)
```

### Traceability management

#### Traceability set & unset
```js
// Keep trace information
impulse.doTrace()
// Do not keep trace information (default)
impulse.noTrace()

// Remote Trace information
impulse.doRemoteTrace()
// No remote Trace information (default)
impulse.noRemoteTrace()
```

### Debug management

#### Debug set & unset
```js
// Keep trace information
impulse.doDebug()
// Do not keep trace information (default)
impulse.noDebug()

// Remote Trace information
impulse.doRemoteDebug()
// No remote Trace information (default)
impulse.noRemoteDebug()
```

#### Emit
When emitting the impulse it will be sent to all the entity channels and if there was any trace and debug set it will also set it before.

```js
impulse.emit()
```