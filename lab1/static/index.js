// включение строгого режима выполнения кода
"use strict";

// При работе с CSS должно быть продемонстрировано использование селекторов классов, селекторов псевдоэлементов, селекторов дочерних элементов, селекторов псевдоклассов а также такие свойства стилей CSS, как наследование и каскадирование.
// При оформлении шапки необходимо явным образом задать шрифт (sans-serif), его цвет и размер в каскадной таблице стилей.
// Отступы элементов ввода должны задаваться в процентах.


// состояние точек
const state = {
    x: 0,
    y: 0,
    r: 1.0,
};


let start;
const table = document.getElementById("result-table");
const error = document.getElementById("error");
const form = document.getElementById("data");


// возможные значения параметров 
const valsX = [-3, 3];
const valsY = new Set([-5, -4, -3, -2, -1, 0, 1, 2, 3]);
const valsR = new Set([1.0, 1.5, 2.0, 2.5, 3.0]);


// проверка полученных параметров
const validate = (state) => {
    if(isNaN(Number(state.x)) || state.x < valsX[0] || state.x > valsX[1]){
        error.hidden = false;
        error.innerText = `x должен быть в диапазоне [${[...valsX].join(", ")}]`;
        return false;
    }

    if(isNaN(Number(state.y)) || !valsY.has(Number(state.y))){
        error.hidden = false;
        error.innerText = `y должно принадлежать {${[...valsY].join(", ")}}`;
        return false;
    }

    if(isNaN(Number(state.r)) || !valsR.has(Number(state.r))){
        error.hidden = false;
        error.innerText = `r должно принадлежать {${[...valsR].join(", ")}}`;
        return false;
    }

    error.hidden = true;
    return true
}


// добавление значений полученных от сервера
const add_res = (result) => {
    const now = new Date();
    const newRow = table.insertRow();

    const cell1 = newRow.insertCell(0);
    const cell2 = newRow.insertCell(1);
    const cell3 = newRow.insertCell(2);
    const cell4 = newRow.insertCell(3);
    const cell5 = newRow.insertCell(4);
    const cell6 = newRow.insertCell(5);

    cell1.innerHTML = result['x'];
    cell2.innerHTML = result['y'];
    cell3.innerHTML = result['r'];
    cell4.innerHTML = `${start.getHours()}:${start.getMinutes()}:${start.getSeconds()}`;
    cell5.innerHTML =  `${now - start} мс`;
    if(result['result']){
        cell6.innerHTML = 'попадание';
        cell6.setAttribute('id', 'good');
    }else{
        cell6.innerHTML = 'промах';
        cell6.setAttribute('id', 'error');
    }
}


// получение и отправка данных на сервер
form.addEventListener("submit", async function(e){
    e.preventDefault();
    state.x = form.querySelector('input[type="number"]').value;
    state.y = form.querySelector('input[type="radio"]:checked').value;
    state.r = form.querySelector('select').value;

    if(validate(state)){
        const params = (new URLSearchParams(state)).toString();
        start = new Date();
        const response = await fetch("http://localhost:8080/fcgi-bin/server.jar?" + params.toString(), {
            method: 'POST'
        });
        const result = await response.json();

        if('error' in result){
            error.hidden = false;
            error.innerText = result['error'];
        }else{
            add_res(result);
        }
    }
});


// отрисовка графика
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');

// размеры
const width = canvas.width;
const height = canvas.height;
const R = 100;
const centerX = width / 2;
const centerY = height / 2;

// параметры
ctx.fillStyle = 'rgba(51, 153, 255, 0.2)';
ctx.font = "12px sans-serif";
ctx.strokeStyle  = "black";
ctx.strokeStyle = "white";

// задание области
ctx.strokeRect(0, 0, width, height)

// отрисовка квадрата
ctx.beginPath();
ctx.rect(centerX, centerY - R, R, R);
ctx.fill();

// отрисовка сектора круга
ctx.beginPath();
ctx.moveTo(centerX, centerY);
ctx.arc(centerX, centerY, R, Math.PI / 2, Math.PI, false);
ctx.lineTo(centerX, centerY);
ctx.fill();

// отрисовка треугольника
ctx.beginPath();
ctx.moveTo(centerX, centerY);
ctx.lineTo(centerX + R, centerY);
ctx.lineTo(centerX, centerY + R);
ctx.closePath();
ctx.fill();

ctx.beginPath();
// ось Y
ctx.moveTo(centerX, 0);
ctx.lineTo(centerX, height);
// ось X
ctx.moveTo(0, centerY);
ctx.lineTo(width, centerY);
ctx.stroke();

ctx.beginPath();
// верхняя стрелка
ctx.moveTo(centerX, 0);
ctx.lineTo(centerX-7, 10);
ctx.moveTo(centerX, 0);
ctx.lineTo(centerX+7, 10);
// правая стрелка
ctx.moveTo(width, centerY);
ctx.lineTo(width-10, centerY-7);
ctx.moveTo(width, centerY);
ctx.lineTo(width-10, centerY+7);
ctx.stroke();

ctx.beginPath();
// отрицательная ось X
ctx.moveTo(R/2+10, centerY-7);
ctx.lineTo(R/2+10, centerY+7);
ctx.moveTo(R+17, centerY-7);
ctx.lineTo(R+17, centerY+7);

ctx.strokeText("-R/2", centerX - R / 2 - 6, centerY - 12);
ctx.strokeText("-R", centerX - R - 6, centerY - 12);

// положительная ось X
ctx.moveTo(centerX + R/2, centerY-7);
ctx.lineTo(centerX + R/2, centerY+7);
ctx.moveTo(centerX + R, centerY-7);
ctx.lineTo(centerX + R, centerY+7);

ctx.strokeText("R/2", centerX + R / 2 - 6, centerY - 12);
ctx.strokeText("R", centerX + R - 3, centerY - 12);

// отрицательная ось Y
ctx.moveTo(centerX-7, R/2+10);
ctx.lineTo(centerX+7, R/2+10);
ctx.moveTo(centerX-7, R+10);
ctx.lineTo(centerX+7, R+10);

ctx.strokeText("-R/2", centerX + 12, centerY + R / 2 + 3);
ctx.strokeText("-R", centerX + 12, centerY + R + 3);

// положительная ось Y
ctx.moveTo(centerX-7, centerY + R/2);
ctx.lineTo(centerX+7, centerY + R/2);
ctx.moveTo(centerX-7, centerY + R);
ctx.lineTo(centerX+7, centerY + R);
ctx.stroke();

ctx.strokeText("R/2", centerX + 12, centerY - R / 2 + 3);
ctx.strokeText("R", centerX + 12, centerY - R + 3);