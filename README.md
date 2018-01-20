# JasperNode
JasperReports for NodeJS

## Installation
    npm install jaspernode -S

## Usage (in AdonisJS)

```js
async jasper ({ response }) {
    const jasper = new JasperNode(Helpers.appRoot('tmp/JasperNode'))
    let inputFile = Helpers.appRoot('tmp/JasperNode/params.jasper')
    let outputFile = Helpers.appRoot('tmp/JasperNode/output')

    let parameters = {
        myString: jasper.quotes('My String'),
        myInt: 100,
        myImage: jasper.quotes('sample.jpg')
    }
    
    try {   
        const pathFile = await jasper.process(inputFile, outputFile, parameters).execute()
        return response.send(pathFile)
    } catch (e) {
        return response.send(e)
    }
}
```

## Tests
    npm test

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.