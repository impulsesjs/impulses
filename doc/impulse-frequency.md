# Class Frequency
This class exists to manage frequency information for the impulse functionality. 
It allows to set get and check relevant information.  

## Functionality
This class is responsible for providing an interface to manage frequency information.

### Information / Name

```js
let freq = new Frequency('ENTITY', 'CHANNEL')
let entity = freq.getEntity() // ENTITY
let channel = freq.getChannel() // CHANNEL
```

### Instantiation 
The only moment where we can `set` the information is at the creation moment.

```js
let freq = new Frequency('ENTITY', 'CHANNEL')
```

### Entity
#### Get
If required we should get the entity name by calling the `getEntity` method.

```js
let entity = freq.getEntity() // ENTITY
```

### Channel
#### Get
If required we should get the channel name by calling the `getChannel` method.

```js
let channel = freq.getChannel() // CHANNEL
```

### Check
In order to check if the frequency is actually something specific there is a implementation that support it.

#### Verify
To verify if the current frequency is a specific entity and channel.

```js
let isFrequency = freq.is('ENTITY', 'CHANNEL') // true
let isNotFrequency = freq.is('ENT', 'CHANN') // false
```

#### Equality
To assert the equality between two frequencies.

```js
let areEqual = freq1.isEqual(freq2) // true or false
```
