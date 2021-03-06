$(document).ready(function(){

let canvasOffset = 0;
const canvas = document.getElementById('myCanvas');
const cageNumber = 20;
canvas.height = canvas.width;
const side = canvas.width / cageNumber;
let context = canvas.getContext('2d');
let mouseX = 0;
let mouseY = 0;
let enteredCage = {};
let previousCage = {};
let ennumberedCages = [[]];
const chessKnight = new Image();
chessKnight.src = './pics/chessKnight.png';
let numberInCageCount = 0;
let time = 0;

// $(document).on('click', '#knights-move', function(){



// });


$('#tabs-div').tabs();
$('#accordion').accordion({

    collapsible: true,
    heightStyle: "content",
    active: false

}); 

$(document).on('click', '#knights-move', function(){

    canvasOffset = $('#myCanvas').offset();   

});


const clickSound = function(){

const click = new Audio();
click.src = './sounds/click.mp3';
click.autoplay = true;

}
const snoring = function(){

    const snr = new Audio();
    snr.src = './sounds/snoring.mp3';
   snr.autoplay = true;

}

const gameFieldBorder = {

    leftTopX: side * 5,
    leftTopY: side * 4,
    leftBottomX: side * 5,
    leftBottomY: side * 14,
    rightTopX: side * 15,
    rightTopY: side * 4,
    rightBottomX: side * 15,
    rightBottomY: side * 14

};

const rulesFieldBorder = {

    pointX: side * 1,
    pointY: side * 17,
    height: side * 2,
    width: side * 6

};

const onFieldClick = function(e){

    let mouseX = e.pageX - canvasOffset.left;
    let mouseY = e.pageY - canvasOffset.top;
    const cage = currentCage(mouseX, mouseY);

    if((cage.x >= 1 && cage.x < 7) && (cage.y >= 17 && cage.y <= 19)){

        $('#my-modal-window').dialog({
            width: 500,
            height: 230, 
            draggable: false,
            title: 'Правила игры',
            buttons: [
                {
                    text: "OK",
                    click: function(){
                        $(this).dialog('close');
                    }
                }
            ]
        }).empty().append(`<p>Делая ходы конем, нужно заполнить игровое поле числами от 1 до 100 таким образом, чтобы в каждой клеточке было по числу. 
        Начинать можно с любой клеточки. На ход дается 15 сек.</p>`);

    }
}

const drawRulesField = function(){

context.save();
context.fillStyle ="#8FBC8F";
context.fillRect(rulesFieldBorder.pointX, rulesFieldBorder.pointY, rulesFieldBorder.width, rulesFieldBorder.height);
context.restore();
context.save();
context.font = '20px Georgia';
context.fillStyle = '#000080';
context.fillText('Правила игры', rulesFieldBorder.pointX +  1.2 * side, rulesFieldBorder.pointY +  1.2 * side, side * 5, side);
context.restore();

}

const drawGameField = function () {

    for (let x = 0; x <= canvas.width; x += side) {

        if (x >= gameFieldBorder.leftTopX && x <= gameFieldBorder.rightBottomX) {

            context.moveTo(x, gameFieldBorder.leftTopY);
            context.lineTo(x, gameFieldBorder.leftBottomY);

        }
    }

    for (let y = 0; y < canvas.height; y += side) {

        if (y >= gameFieldBorder.leftTopY && y <= gameFieldBorder.leftBottomY) {

            context.moveTo(gameFieldBorder.leftTopX, y);
            context.lineTo(gameFieldBorder.rightTopX, y);

        }

    }

    context.strokeStyle = '#87CEFA';
    context.stroke();
}

const drawAmbient = function () {

    context.fillStyle = '#B0C4DE';
    context.fillRect(0, 0, side * 5, canvas.height);
    context.fillRect(15 * side, 0, side * 5, canvas.height);
    context.fillRect(5, 0, canvas.width + (side * 5), side * 4);
    context.fillRect(5, 14 * side, canvas.width + (side * 5), side * 6);

    context.fillStyle = '#000080';
    context.font = '40px Georgia';
    context.fillText("ХОД КОНЁМ", side * 7, side * 2, side * 7, side * 1);
    context.font = '20px Georgia';
    context.fillText("Текущее число:", side * 5, side * 16, side * 7, side * 1);
   
}

const drawChangeNumber = function () {

    context.fillStyle = '#B0C4DE';
    context.fillRect(side * 9, side * 15, side, side * 2);
    context.fillStyle = '#000080';
    context.fillText(numberInCageCount.toString(), side * 9, side * 16, side, side);
    context.fillStyle = 'black';

}

drawAmbient();
drawGameField();
drawRulesField();

const currentCage = function (mouseX, mouseY) {
    
    const mX = mouseX;
    const mY = mouseY;
    console.log('mX ' + mX + ' mouseX ' + mouseX + ' off ' + canvasOffset.left);
    let cage = [];
    let location = [];
    if ((mX >= gameFieldBorder.leftTopX && mX < gameFieldBorder.rightTopX) && (mY >= gameFieldBorder.leftTopY && mY < gameFieldBorder.leftBottomY)) {

        location['gameFieldLocation'] = 1;
        cage['x'] = Math.floor(mX / side) - 4;
        cage['y'] = Math.floor(mY  / side) - 3;

        console.log('CAGE х ' + cage['x']);
    }
    else {

        location['gameFieldLocation'] = 0;
        cage['x'] = Math.floor(mX / side);
        cage['y'] = Math.floor(mY / side);

    }
    cage['location'] = location;
    return cage;
}

const prevCage = function (x, y) {

    let pCage = [];
    if ((x >= gameFieldBorder.leftTopX && x < gameFieldBorder.rightTopX) && (y >= gameFieldBorder.leftTopY && y < gameFieldBorder.leftBottomY)) {

        pCage['x'] = Math.floor(x / side) - 4;
        pCage['y'] = Math.floor(y / side) - 3;

    }

    return pCage;

}
const allowedMovie = function (currentCage) {

    let result = false;
    let isEnnumbered = false;
    let isAllowed = false;
    let inGameField = currentCage.location.gameFieldLocation;
    const numberInCage = currentCage.numberInCage;
    const x = currentCage.x;
    const y = currentCage.y;
    let item = ennumberedCages[ennumberedCages.length - 1];
    
    if (inGameField === 1) {

        if (item.length !== 'undefined') {

            if (((item.x - 1 === x) || (item.x + 1 === x)) &&
                ((y === item.y - 2) || (y === item.y + 2)) ||
                ((x === item.x - 2) || (x === item.x + 2)) &&
                ((y === item.y - 1) || (y === item.y + 1))) {


                isAllowed = true;

            }
        }


        let isEnnumbered = ennumberedCages
            .some(function (current) {

                return (current.x == x && current.y == y) && current.numberInCage !== 'undefined';

            });

        if (numberInCageCount == 0) {

            isAllowed = true;

        }

        if (isEnnumbered) {

            isAllowed = false;

        }

    }

    if (inGameField === 0) {

        return;

    }


    return isAllowed;

}

const perspective = function (currentCage) {

    let persp = [];
    let perspX = currentCage.x + 1;
    let perspY = currentCage.y + 2;

}

const moveOverCage = function (e) {
 
    let mouseX = e.pageX - canvasOffset.left;
    let mouseY = e.pageY - canvasOffset.top;
    let cage = currentCage(mouseX, mouseY);
    let inGameField = cage.location.gameFieldLocation;
    let pCg = prevCage(previousCage.leftX, previousCage.topY);
    console.log(cage.x + ', ' + cage.y);

    if (inGameField === 1) {

        let allowed = allowedMovie(cage);

        enteredCage['leftX'] = Math.floor(mouseX / side) * side;
        enteredCage['topY'] = Math.floor(mouseY / side) * side;

        let isEnnumbered = ennumberedCages
            .some(function (current) {

                return (current.x == cage.x && current.y == cage.y) && current.numberInCage !== 'undefined';

            });

        let prevIsEnnumbered = ennumberedCages
            .some(function (current) {

                return (current.x == pCg.x && current.y == pCg.y) && current.numberInCage !== 'undefined';

            });

        if ((typeof (previousCage.leftX) !== "undefined") && !prevIsEnnumbered) {



            context.clearRect(previousCage.leftX + 1, previousCage.topY + 1, side - 2, side - 2);

        }

        if (!isEnnumbered) {

            context.drawImage(chessKnight, enteredCage.leftX + 1, enteredCage.topY + 3);

        }

        previousCage['leftX'] = enteredCage.leftX;
        previousCage['topY'] = enteredCage.topY;

    }


}



const insertNumberMovie = function (e) {

    
    let mouseX = e.pageX - canvasOffset.left;
    let mouseY = e.pageY - canvasOffset.top;
    const cage = currentCage(mouseX, mouseY);
    let allowed = allowedMovie(cage);
    const inGameField = cage.location.gameFieldLocation;
    
    if (!allowed && inGameField === 1) {
        
        snoring();
        alert('Неверный ход! Попробуйте еще раз!');
        return;

    }

    if (inGameField === 1) {
        
        clearTimeout(time);
        numberInCageCount += 1;
        drawChangeNumber();

        cage['numberInCage'] = numberInCageCount;
        ennumberedCages.push(cage);

        clickSound();

        context.font = '20px Georgia';
        context.fillStyle = "black";
        context.clearRect(enteredCage.leftX + 1, enteredCage.topY + 1, side - 2, side - 2);
        context.fillText(numberInCageCount.toString(), enteredCage.leftX + 10, enteredCage.topY + 25, side, side);
       
        time = setTimeout(function(){

            alert('Время для хода вышло. Игра закончена.');
            location.reload();
                        
        }, 15000);    
        
    }
    else {

        

    }

}   

const clicker = function(e){

    insertNumberMovie(e);
    onFieldClick(e);

}

canvas.addEventListener('mousemove', moveOverCage);
canvas.addEventListener('click', clicker);


});
