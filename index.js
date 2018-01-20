'use strict'

const { exec } = require('child_process')
const fs = require('fs')
const path = require('path')
const JasperError = require('./JasperError')

class JasperNode {

    constructor(resourcePath) {
        this.executable = __dirname + '/JasperStarter/bin/jasperstarter'
        this.resourcePath = resourcePath || null
    }
    
    process(inputFile, outputFile, parameters, format = 'pdf') {
        this.inputFile = inputFile
        this.outputFile = outputFile
        this.format = format

        if (!this.resourcePath) {
            this.resourcePath = path.dirname(this.inputFile)
        }

        this.command = this.executable
        this.command += ' process '
        this.command += inputFile
        this.command += ' -o ' + outputFile
        this.command += ' -f ' + format

        if (this.resourcePath) {
            this.command += ' -r ' + this.resourcePath
        }

        this.command += ' -P'
        for (var key in parameters) {
            this.command += ` ${key}=${parameters[key]}`
        }

        return this
    }

    listParameters(inputFile) {
        this.inputFile = inputFile
        this.outputFile = null
        this.format = null

        if (!this.resourcePath) {
            this.resourcePath = path.dirname(this.inputFile)
        }

        this.command = this.executable
        this.command += ' list_parameters ' + inputFile
        return this
    }

    output() {
        return new Promise((resolve, reject) => {
            resolve(this.command)
        })
    }

    /**
     * @returns path of file OR
     * @returns list params OR
     * @returns JasperError
     */
    execute() {
        return new Promise((resolve, reject) => {
            exec(this.command, (error, stdout, stderr) => {
                if (error) {
                    reject(new JasperError(stderr))
                } else {
                    const file = path.basename(this.inputFile.split('.jasper')[0])
                    const path1 = `${this.outputFile}.${this.format}`
                    const path2 = `${this.outputFile}${path.sep}${file}.${this.format}`
                    
                    if (this.outputFile) {
                        if (fs.existsSync(path1)) {
                            resolve(path1)
                        } else {
                            resolve(path2)
                        }
                    } else {
                        resolve(stdout)
                    }
                }
            })
        })
    }

    static quotes(str) {
        return `\"${str}\"`
    }

    quotes(str) {
        return JasperNode.quotes(str)
    }

}

module.exports = JasperNode