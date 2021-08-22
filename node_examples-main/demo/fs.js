const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'test', 'text.txt');
const firstFile = path.join(__dirname, '1.txt');
const secondFile = path.join(__dirname, '2.txt');
const thirdFile = path.join(__dirname, '3.txt');
const fourthFile = path.join(__dirname, '4.txt');

function z1() {
    // создание папки
    // проверка наличия папки test
    fs.access(path.join(__dirname, 'test'), (err) => {
        if (err) { // если папка test недоступна, создать папку -> создать файл text -> записать строку "Hello NodeJS"
            fs.mkdir(path.join(__dirname, 'test'), (err) => {
                if(err) throw `Не удалось создать папку. ${err}`; // создать исключение(ошибку)
            });
            fs.writeFile(filePath, 'Hello NodeJS',{'flag': 'w'}, (err) => {
                if(err) throw `Не удалось создать файл. ${err}`;
                console.log('Файл создан');
            });
        }
        // если папка test доступна, в файл text добавить строку "Hello again"
        fs.appendFile(filePath, '\nHello again', err => {
            if(err) throw `Не удалось добавить в файл. ${err}`;
            console.log('Файл обновлен');
        });
        fs.readFile(filePath, 'utf-8', (err, content) => {
            if(err) throw `Не удалось прочитать файл. ${err}`;
            console.log(content);
        });
    });
}

// Создание двух текстовых файлов с разным содержимым
function z2() {
    fs.writeFile(firstFile, 'Первый текст\n JavaScript - язык программирования высокого уровня.',{'flag': 'w'}, (err) => {
        if(err) throw `Не удалось создать первый файл. ${err}`;
        fs.writeFile(secondFile, 'Второй текст\n JavaScript - это легковесный, интерпретируемый ' +
            'или JIT-компилируемый, объектно-ориентированный язык.',{'flag': 'w'}, (err) => {
            if(err) throw `Не удалось создать второй файл. ${err}`;
            z3();
        });
    });
}

// Создание третьего файла с текстами из первых двух
function z3() {
    fs.readFile(firstFile, 'utf8', function(err, fileContent){
        if(err) throw err;
//        console.log(fileContent); // содержимое файла
        fs.writeFile(thirdFile, fileContent, function(err){
            if(err) throw err;
            fs.readFile(secondFile, 'utf8', function(err, fileContent2){
                if(err) throw err;
//                console.log(fileContent2); // содержимое файла
                fs.appendFile(thirdFile, '\n'+fileContent2, function(err){
                    if(err) throw err;
                    console.log('Тексты записаны в третий файл');
                    z4();
                });
            });
        });
    });
}

// Запись текста без дубликатов в четвёртый файл (пока как-то так..., лучше не придумал)
function z4() {
    fs.readFile(thirdFile, 'utf8', function(err, fileContent) {
        if (err) throw err;
        let words = fileContent.split(/[,. ;()!?\r\n]/).filter(x => x);
        //console.log(words);
        let filteredwords = words.filter((item, index) => {
            // Возврат к новому массиву, если индекс текущего элемента совпадает с другим
            return words.indexOf(item) === index;
        });
        //console.log(filteredwords);
        fs.writeFile(fourthFile, filteredwords[0], function(err) {
            if (err) throw err;
            for (let i=1; i<filteredwords.length; i++) {
                fs.appendFile(fourthFile, '\n'+filteredwords[i], function(err){
                    if(err) throw err;
                });
            }
            z5();
        });
    });
}

// Удаление временных файлов
function z5() {
    fs.unlink(firstFile, (err) => {
        if (err) throw err;
        fs.unlink(secondFile, (err) => {
            if (err) throw err;
            fs.unlink(thirdFile, (err) => {
                if (err) throw err;
                console.log('Файлы 1,2,3 удалены');
            });
        });
    });
}

z1();
z2();