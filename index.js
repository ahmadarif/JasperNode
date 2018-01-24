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

    compile(inputFile, outputFile = null) {
        this.inputFile = inputFile
        this.outputFile = outputFile
        this.format = null
        this.task = 'compile'

        this.command = this.executable
        this.command += ' compile ' + inputFile

        if (outputFile) this.command += ' -o ' + outputFile

        return this
    }
    
    process(inputFile, outputFile, parameters, connections = null, format = 'pdf') {
        this.inputFile = inputFile
        this.outputFile = outputFile
        this.format = format
        this.task = 'process'

        if (!this.resourcePath) this.resourcePath = path.dirname(this.inputFile)

        this.command = this.executable
        this.command += ' process '
        this.command += inputFile
        this.command += ' -o ' + outputFile
        this.command += ' -f ' + format
        this.command += ' -r ' + this.resourcePath

        if (parameters) {
            this.command += ' -P'
            for (var key in parameters) {
                this.command += ` ${key}=${parameters[key]}`
            }
        }

        if (connections) {
            this.command += ' -t ' + connections.driver
            this.command += ' -H ' + connections.host
            this.command += ' -n ' + connections.database
            this.command += ' -u ' + connections.username

            // optional parameters
            if (connections.hasOwnProperty('password')) this.command += ' -p ' + connections.password
            if (connections.hasOwnProperty('port')) this.command += ' --db-port ' + connections.port
        }

        return this
    }

    listParameters(inputFile) {
        this.inputFile = inputFile
        this.outputFile = null
        this.format = null
        this.task = 'listParameters'

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
                    if (this.task == 'process' || this.task == 'listParameters') {
                        const ext = path.extname(this.inputFile)
                        let file = null
                        if (ext == '.jasper') {
                            file = path.basename(this.inputFile, '.jasper')
                        } else {
                            file = path.basename(this.inputFile, '.jrxml')
                        }
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
                    } else { // this.task == compile
                        const filename = path.basename(this.inputFile, '.jrxml')
                        const path1 = `${path.dirname(this.inputFile)}${path.sep}${filename}.jasper`
                        
                        if (fs.existsSync(path1)) {
                            resolve(path1)
                        } else {
                            const path2 = `${this.outputFile}.jasper`
                            const path3 = `${this.outputFile}${path.sep}${filename}.jasper`

                            if (fs.existsSync(path2)) {
                                resolve(path2)
                            } else {
                                resolve(path3)
                            }
                        }
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