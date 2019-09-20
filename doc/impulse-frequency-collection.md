# Class FrequencyCollection
This class exists to manage frequency collection for the impulse functionality. 
It allows to set get and check frequencie collections.

## Functionality
This class is responsible for providing an interface to manage frequency collection.

### Initialization

```js
let freqCollection = new FrequencyCollection(config)
```

### Adding frequencies
It is possible to add frequency object to the collection. It will only add if the frequency does not exist.
It will return a boolean representing `success` state of the operation

```js
let success = freqCollection.add(freq)
```

### Exists
It is possible to check if a frequency object already exists in the collection. 
It will return a boolean representing `success` state of the operation

```js
let success = freqCollection.has(freq)
```

### Size
It is possible to get the number of frequencies in the collection. 
It will return an `int` representing the number of frequencies in the collection.

```js
let count = freqCollection.count()
```

### Iteration
It is also possible, similar to Array to iterate through all the frequencies within the collection.

The function to provide should respect the same format as in `Array.forEach` documentation.

```js
freqCollection.each(func)
```
