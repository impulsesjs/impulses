# Class Values
This class exists to collect and retain all the values required to be stored in memory. It is intended for the future 
to persist data by allowing queues to continue work where they have stopped. e.g. in case of connectivity loss.

## Functionality
This class is responsible for storing and manage key/value information. For this case only basic functionality should 
exist. It also implement a Time To Live (TTL) for data that require to be deprecated after a specific time frame.

### Setting a value
Values accept storing data by either providing a object in the instantiation moment or through the `set` method.
The procedural is also used to change the value of a specific variable.
 
``` js
// Creation way
let data = new Values({var1: 'val1', var2: {var2_1: 'val2_1'}})


// Procedural way 
data.set('var2.var2_2', 'val2_2')
```

If we exported data it would be:
``` js
{
    var1: 'val1', 
    var2: {
        var2_1: 'val2_1',
        var2_2: 'val2_2'
    }
}
```

### Getting a value
To fetch a value from a Values object we just need to request in the same format through the `get` method.

``` js
let val = data.get('var2.var2_1')
```

in this case the variable `val` would have the value of `val2_1`

### Exporting
Export may be used to get all the data with the structure that Values object is holding. This was mainly created 
thinking on the specific purpose of allowing an external entity to persist that data.

``` js
let allData = data.export()
```

### Destroying value
Destroy will remove and free the Values object of that specific variable information.

``` js
data.destroy('var2.var2_1')
```
If we exported data it would be:
``` js
{
    var1: 'val1', 
    var2: {
        var2_2: 'val2_2'
    }
}
```

### Check if value exists
This will allow us to get the information of a specific value is being stored within the Variables object.

``` js
data.isSet('var2.var2_3') // false
data.isSet('var1') // true
data.isSet('var2.var2_3') // true
```

### Check if value was changed
This allows us to see if any change was made to the data. This will not provide changes on specific variables.
``` js
data.isDirty()
```

## Keys
The functionality uses a notation define data structure and to allow an quick access to a variable in a deeper structure.

The dot notation was adopted and indicating the variable to be accessed we can use: `there.is.the.variable` this shows 
that we want to access the `variable` that is the fourth level, under `there.is.the` 

