# Class Emitter
This class exists to manage emitter information for the impulse functionality. 
It allows to set get and check relevant information.  

## Functionality
This class is responsible for providing an interface to manage emitter information.

### Set Information
#### Instantiation
At this moment we can provide an `object` for the emitter to be filled. The object will only be valid if it has specific attributed present.

So the minimum information must be:
```js
// TODO: May need some updates
const emitterInfo = {
    time: Date.now(),
    info: {}, 
    content: {}
}
```

```js
let emitter1 = new Emitter()
let emitter2 = new Emitter(emitterInfo)
```

#### Procedural
Another wat to set the emitter info is by using the provided functionality.

It will ignore the request if the information is not valid.

It will return `boolean` representing the operation status.

```js
let status = emitter1.setInfo(emitterInfo)
```

### Get 
#### Id
The API provides a method to get the emitter generated ID.

```js
let emitterId = emitter1.getId()
```

### Verification
The API provides a method to check if two emitters are equal.

It will return `boolean` representing the operation status.

```js
let status = emitter1.isEqual(emitter2)
```
