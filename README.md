# JasperNode 

[![Greenkeeper badge](https://badges.greenkeeper.io/ahmadarif/JasperNode.svg)](https://greenkeeper.io/)
[![npm version](https://badge.fury.io/js/jaspernode.svg)](https://badge.fury.io/js/jaspernode)
[![npm](https://img.shields.io/npm/dt/jaspernode.svg)](https://www.npmjs.com/package/jaspernode)
[![build status](https://travis-ci.org/ahmadarif/JasperNode.svg?branch=master)](https://travis-ci.org/ahmadarif/JasperNode)
[![Coverage Status](https://coveralls.io/repos/github/ahmadarif/JasperNode/badge.svg)](https://coveralls.io/github/ahmadarif/JasperNode)
[![npm](https://img.shields.io/npm/l/jaspernode.svg)](https://www.npmjs.com/package/jaspernode)
[![contributions](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/ahmadarif/JasperNode/issues)

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