'use strict'

var path = require('path')
var expect = require('chai').expect
var JasperNode = require('../index')
var JasperError = require('../JasperError')
const fs = require('fs')

// set false if you want to see the output file
const isAutoDelete = true

describe('JasperNodeTest', function() {
    it('should error JasperError (file not found)', async function() {
        const inputFile = path.join(__dirname, '../sample/fakeFile.jasper')
        const jasper = new JasperNode()
        try {
            const params = await jasper.listParameters(inputFile).execute()
        } catch (e) {
            expect(e).to.be.an('error')
        }
    }).timeout(0)

    it('listParameters output test', async function() {
        const inputFile = path.join(__dirname, '../sample/params.jasper')
        const jasper = new JasperNode()
        const command = await jasper.listParameters(inputFile).output()

        expect(command).to.be.a('string')
        expect(command).to.have.string('list_parameters')
    }).timeout(0)

    it('compile test (without output file path)', async function() {
        const inputFile = path.join(__dirname, '../sample/compile_1.jrxml')
        const jasper = new JasperNode()
        const filePath = await jasper.compile(inputFile).execute()
        
        expect(filePath).to.be.a('string')
        expect(filePath).to.have.string(path.join(__dirname, '../sample/compile_1.jasper'))

        if (isAutoDelete) fs.unlinkSync(filePath)
    }).timeout(0)

    it('compile test (base name)', async function() {
        const inputFile = path.join(__dirname, '../sample/compile_2.jrxml')
        const outputFile = path.join(__dirname, '../sample/compile_2_compiled')
        const jasper = new JasperNode()
        const filePath = await jasper.compile(inputFile, outputFile).execute()
        
        expect(filePath).to.be.a('string')
        expect(filePath).to.have.string(path.join(__dirname, '../sample/compile_2_compiled.jasper'))

        if (isAutoDelete) fs.unlinkSync(filePath)
    }).timeout(0)

    it('compile test (base directory)', async function() {
        const inputFile = path.join(__dirname, '../sample/compile_3.jrxml')
        const outputFile = path.join(__dirname, '../sample/output')
        const jasper = new JasperNode()
        const filePath = await jasper.compile(inputFile, outputFile).execute()
        
        expect(filePath).to.be.a('string')
        expect(filePath).to.have.string(path.join(__dirname, '../sample/output/compile_3.jasper'))

        if (isAutoDelete) fs.unlinkSync(filePath)
    }).timeout(0)
    
    it('listParameters execute test', async function() {
        const inputFile = path.join(__dirname, '../sample/params.jasper')
        const jasper = new JasperNode()
        const params = await jasper.listParameters(inputFile).execute()

        expect(params).to.be.a('string')
        expect(params).to.have.string('P myString java.lang.String')
        expect(params).to.have.string('P myInt    java.lang.Integer')
        expect(params).to.have.string('P myDate   java.util.Date')
        expect(params).to.have.string('P myImage  java.lang.String  This is the description of parameter myImage')
    }).timeout(0)
    
    it('process output compile test', async function() {
        const resourceDir = path.join(__dirname, 'tmp')
        const inputFile = path.join(__dirname, '../sample/compile_1.jrxml')

        const jasper = new JasperNode(resourceDir)
        const command = await jasper.compile(inputFile).output()
        
        expect(command).to.be.a('string')
        expect(command).to.have.string('compile')
        expect(command).to.have.string('compile_1.jrxml')
    }).timeout(0)

    it('process output process test', async function() {
        const resourceDir = path.join(__dirname, 'tmp')
        const inputFile = path.join(__dirname, '../sample/params.jasper')
        const outputFile = path.join(__dirname, '../sample/output')
        
        const jasper = new JasperNode(resourceDir)
        const params = {
            myString: jasper.quotes('My String'),
            myInt: 100,
            myImage: jasper.quotes('sample.jpg')
        }
        const command = await jasper.process(inputFile, outputFile, params).output()

        expect(command).to.be.a('string')
        expect(command).to.have.string('process')
        expect(command).to.have.string('-o')
        expect(command).to.have.string('-f')
        expect(command).to.have.string('-r')
        expect(command).to.have.string('-P')
    }).timeout(0)

    it('process execute test (without params)', async function() {
        const inputFile = path.join(__dirname, '../sample/params.jasper')
        const outputFile = path.join(__dirname, '../sample/without-params')
        
        const jasper = new JasperNode() // by default resourceDir is equal with inputFile directory
        const filePath = await jasper.process(inputFile, outputFile).execute()
        
        expect(filePath).to.be.a('string')
        expect(filePath).to.have.string(path.join(__dirname, '../sample/without-params.pdf'))

        if (isAutoDelete) fs.unlinkSync(filePath)
    }).timeout(0)

    it('process execute test (with params | output file name equals with input file name)', async function() {
        const inputFile = path.join(__dirname, '../sample/params.jasper')
        const outputFile = path.join(__dirname, '../sample/output')
        
        const jasper = new JasperNode() // by default resourceDir is equal with inputFile directory
        const params = {
            myString: jasper.quotes('My String'),
            myInt: 100,
            myImage: jasper.quotes('sample.jpg')
        }
        const filePath = await jasper.process(inputFile, outputFile, params).execute()
        
        expect(filePath).to.be.a('string')
        expect(filePath).to.have.string(path.join(__dirname, '../sample/output/params.pdf'))

        if (isAutoDelete) fs.unlinkSync(filePath)
    }).timeout(0)

    it('process execute test (with params | custom output file name)', async function() {
        const inputFile = path.join(__dirname, '../sample/params.jrxml')
        const outputFile = path.join(__dirname, '../sample/customName')
        
        const jasper = new JasperNode() // by default resourceDir is equal with inputFile directory
        const params = {
            myString: jasper.quotes('My String'),
            myInt: 100,
            myImage: jasper.quotes('sample.jpg')
        }
        const filePath = await jasper.process(inputFile, outputFile, params).execute()
        
        expect(filePath).to.be.a('string')
        expect(filePath).to.have.string(path.join(__dirname, '../sample/customName.pdf'))

        if (isAutoDelete) fs.unlinkSync(filePath)
    }).timeout(0)

    it('process database test 1', async function() {
        const inputFile = path.join(__dirname, '../sample/database.jasper')
        const outputFile = path.join(__dirname, '../sample')
        
        const jasper = new JasperNode()
        const connections = {
            driver: 'mysql',
            host: 'localhost',
            port: 3306, // optional, default port driver
            username: 'root',
            password: 'admin', // optional if using password NO
            database: 'test'
        }

        try {
            const filePath = await jasper.process(inputFile, outputFile, null, connections).execute()
            
            expect(filePath).to.be.a('string')
            expect(filePath).to.have.string(path.join(__dirname, '../sample/database.pdf'))
            
            if (isAutoDelete) fs.unlinkSync(filePath)
        } catch (e) {
            expect(e).to.be.an('error')
        }

    }).timeout(0)
    
    it('process database test 2', async function() {
        const inputFile = path.join(__dirname, '../sample/database.jasper')
        const outputFile = path.join(__dirname, '../sample')
        
        const jasper = new JasperNode()
        const connections = {
            driver: 'mysql',
            host: 'localhost',
            username: 'root',
            database: 'test'
        }

        try {
            const filePath = await jasper.process(inputFile, outputFile, null, connections).execute()

            expect(filePath).to.be.a('string')
            expect(filePath).to.have.string(path.join(__dirname, '../sample/database.pdf'))

            if (isAutoDelete) fs.unlinkSync(filePath)
        } catch (e) {
            expect(e).to.be.an('error')
        }
    }).timeout(0)
})