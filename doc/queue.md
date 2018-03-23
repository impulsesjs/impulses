# Class Queue

This class implements the functionality of a queue it will allow to retain all requests into an in memory queue so:

- it is possible to change the message flow status between open / pause / close
- it allows to prevent loss of messages and registrations when the flow is paused
- it allows the requesting party to be released as soon the message arrives
- it allows to prevent loos of messages if the throughput is to high

## Functionality
This class is responsible for holding the arriving message and queue it so we can keep the order of delivery while we 
can pause the system for any reason. Every queued message will be associated with an id that will live with the 
message until it dies.

### Adding a message
This class allows the addition (queue) of a message by using the method `add`.
 
``` js
let q = new Queue()
let messageId = q.add({...})
```

### Getting a message
In order to get the message and its information we must request by the queued message id.

``` js
let messageFromQueue = q.get(messageId)
```

### Cancelling
This class also allows the cancellation of a message by providing the message Id.

``` js
let q.cancel(messageId)
```

### Next message
One of the main purpose of this class it to provide a mechanism to get the next message in the queue while removing it.

``` js
q.next()
```
