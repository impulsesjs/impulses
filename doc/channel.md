# Class Channel
This class exists to manage and discovery of all the channel process functionality of a specific entity. 
It allows the search and validation of messages as well as the installation of listeners and hooks as well as the flow 
control (channel status & activity).  

## Functionality
This class is responsible for flow control operations as well as the creation, destruction and discovery of channels. It
also allows the messaging sending, cancellation and information request.  

### Information / Name

```js
let chan = new Channel('CHANNEL.TEST')
let name = chan.getName() // CHANNEL.TEST
```

### Flow Control 
#### Status
By default every channel is on open state

```js
let status = chan.getStatus() // == chan.OPEN_STATUS == 1
```

#### Hold
By placing a channel on hold, means that all communications will be queued and resolved once the flow has resumed.

```js
chan.hold()
let status = chan.getStatus() // == chan.ON_HOLD_STATUS == 2
```

#### Resume
By resuming when on hold, the channel will continue the message operation from where it has been paused. 

```js
chan.resume()
let status = chan.getStatus() // == chan.OPEN_STATUS == 1
```

#### Close
This will stop the operation and it will reject any new request. So all new requests will bot be placed in the queue.

```js
chan.close()
let status = chan.getStatus() // == chan.CLOSED_STATUS == 0
```

#### Open
Opens the channel for normal flow operation.

```js
chan.open()
let status = chan.getStatus() // == chan.OPEN_STATUS == 1
```

### Hooks / Listeners
#### Add Listener
Add a hook to the channel so it gets every message sent to the channel (Depending on the configuration).
```js
let listenerId = chan.addListener(listenerInformationObj)
```

#### Remove Listener
Remove a listener hooked on this channel with the specified id.

```js
chan.removeListener(listenerId)
```

#### Listener Information
Gets the information about a listener hooked on this channel with the specified id.

```js
chan.listenerInfo(listenerId)
```

### Message
#### Send
Sends a message

```js
let messageId = chan.send(messageObj)
```

#### Send And Listen
Send a message and set up a listener so it will get the reply. The idea here is to hook a listener to get the reply 
and then be automatically removed. The listener information will be pre-defined to have this behaviour if nothing is set.

```js
let messageId = chan.sendAndListen(messageObj, listenerInformationObj)
```

#### Information
Gets the information on a listener installed in this channel by its id.

```js
chan.messageInfo(messageId)
```

