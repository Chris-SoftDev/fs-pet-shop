const fs = require('fs');

function readPets() {
    fs.readFile('./pets.json', 'utf8', function(error, data){
        if(error){
            console.log(error)
        } else {
            console.log(JSON.parse(data));
        }
    });    
}

function specificPet(index) {
    fs.readFile('./pets.json', 'utf8', function(error, data){
        if(error){
            console.log(error)
        } else {
            if (index < 0 || index > (JSON.parse(data).length -1)) {
                process.stderr.write('Usage: node pets.js read INDEX');
                process.exitCode = 1;
            } else console.log(JSON.parse(data)[index]);
        }
    });
}

function createPet(age, kind, name) {
    let obj = {age: parseInt(age), kind: kind, name: name};
    let fileResult; 
    fs.readFile('./pets.json', 'utf8', function(error, data){
        if(error){
            console.log(error)
        } else {
            fileResult = JSON.parse(data);
            fileResult.push(obj);
            fs.writeFile('./pets.json', JSON.stringify(fileResult), function(error){
                if (error) {
                    console.log(error)
                } else console.log(obj)
            })
        }
    });
}

function updatePet(index, age, kind, name) {
    let obj = {age: parseInt(age), kind: kind, name: name};
    let fileResult; 
    fs.readFile('./pets.json', 'utf8', function(error, data){
        if(error){
            console.log(error)
        } else {
            fileResult = JSON.parse(data);
            fileResult[index] = obj;
            fs.writeFile('./pets.json', JSON.stringify(fileResult), function(error){
                if (error) {
                    console.log(error)
                } else console.log(obj)
            })
        }
    });
}


let cmdInput = process.argv;
let cmdAction = cmdInput[2];
let cmdIndex;
let cmdAge; 
let cmdKind;
let cmdName;

if (cmdAction === 'read') {
    if (cmdIndex === undefined) {
        readPets()  
    } else specificPet(cmdIndex);
} else if (cmdAction === 'create') {
        cmdAge = cmdInput[3];
        cmdKind = cmdInput[4];
        cmdName = cmdInput [5];
    if (cmdAge != undefined && cmdKind != undefined && cmdName != undefined) {
        createPet(cmdAge, cmdKind, cmdName);
    } else {
        process.stderr.write('Usage: node pets.js create AGE KIND NAME');
        process.exitCode = 1;
    }
} else if (cmdAction === 'update') {
     cmdIndex = cmdInput[3];
     cmdAge = cmdInput[4];
     cmdKind = cmdInput[5];
     cmdName = cmdInput [6];
    if (cmdIndex != undefined && cmdAge != undefined && cmdKind != undefined && cmdName != undefined) {
        updatePet(cmdIndex, cmdAge, cmdKind, cmdName);
    } else {
        process.stderr.write('Usage: node pets.js update INDEX AGE KIND NAME');
        process.exitCode = 1;
    }
} else if (cmdAction === 'destroy') {

} else {
    process.stderr.write('Usage: node pets.js [read | create | update | destroy]');
    process.exitCode = 1;
}