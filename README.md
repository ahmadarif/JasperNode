# JasperNode [![BuildStatusBadge]][BuildStatusLink] [![CoverageBadge]][CoverageLink] [![NPMBadge]][NPMLink] [![ContributionBadge]][ContributionLink]

JasperReports for NodeJS

## Requirements
- Java is already installed on your machine
- [NodeJS](https://nodejs.org/) 8.0 or greater
- [NPM](https://www.npmjs.com/) 3.0 or greater

## Installation
    npm install jaspernode -S

## Usage (in AdonisJS)

```js
'use strict'

const Helpers = use('Helpers')
const JasperNode = require('jaspernode')

class JasperController {
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
}
```

## Tests
    npm test

## Code Coverage
    npm run cover

## Thanks
- Thanks to [Cenote GmbH](http://www.cenote.de/) for the [JasperStarter](http://jasperstarter.sourceforge.net/) tool.
- Thanks to [Hélder Duarte](https://github.com/cossou) for the [JasperPHP](https://github.com/cossou/JasperPHP) repository

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code.

[BuildStatusBadge]:https://travis-ci.org/ahmadarif/JasperNode.svg?branch=master
[BuildStatusLink]:https://travis-ci.org/ahmadarif/JasperNode
[CoverageBadge]:https://coveralls.io/repos/github/ahmadarif/JasperNode/badge.svg?branch=master
[CoverageLink]:https://coveralls.io/github/ahmadarif/JasperNode?branch=master
[NPMBadge]:https://badge.fury.io/js/jaspernode.svg
[NPMLink]:https://badge.fury.io/js/jaspernode
[ContributionBadge]:https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat
[ContributionLink]:https://github.com/ahmadarif/JasperNode/issues