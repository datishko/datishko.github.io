

$(document).ready(function () {

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

    const clickSound = function(){

    const click = new Audio();
    click.src = './sounds/click.mp3';
    click.autoplay = true;

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

        context.fillStyle = '#F0FFF0';
        context.fillRect(0, 0, side * 5, canvas.height);
        context.fillRect(15 * side, 0, side * 5, canvas.height);
        context.fillRect(5, 0, canvas.width + (side * 5), side * 4);
        context.fillRect(5, 14 * side, canvas.width + (side * 5), side * 6);

        context.fillStyle = '#B8860B';
        context.font = '40px Georgia';
        context.fillText("ХОД КОНЁМ", side * 7, side * 2, side * 7, side * 1);
        context.font = '20px Georgia';
        context.fillText("Текущее число:", side * 5, side * 16, side * 7, side * 1);
        // context.fillText('нет', side * 9, side * 15, side, side);       


    }

    const drawChangeNumber = function () {

        context.fillStyle = '#F0FFF0';
        context.fillRect(side * 9, side * 15, side, side * 2);
        context.fillStyle = '#B8860B';
        context.fillText(numberInCageCount.toString(), side * 9, side * 16, side, side);
        context.fillStyle = 'black';

    }

    drawAmbient();
    drawGameField();

    const currentCage = function (mouseX, mouseY) {

        let cage = [];
        let location = [];
        if ((mouseX >= gameFieldBorder.leftTopX && mouseX < gameFieldBorder.rightTopX) && (mouseY >= gameFieldBorder.leftTopY && mouseY < gameFieldBorder.leftBottomY)) {

            location['gameFieldLocation'] = 1;
            cage['x'] = Math.floor(mouseX / side) - 4;
            cage['y'] = Math.floor(mouseY / side) - 3;
        }
        else {

            location['gameFieldLocation'] = 0;
            cage['x'] = Math.floor(mouseX / side);
            cage['y'] = Math.floor(mouseY / side);

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

        let mouseX = e.pageX;
        let mouseY = e.pageY;
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

        const mouseX = e.pageX;
        const mouseY = e.pageY;
        const cage = currentCage(mouseX, mouseY);
        let allowed = allowedMovie(cage);
        const inGameField = cage.location.gameFieldLocation;
        
        if (!allowed && inGameField === 1) {

            alert('Неверный ход! Попробуйте еще раз!');
            return;

        }

        if (inGameField === 1) {
            
            numberInCageCount += 1;
            drawChangeNumber();

            cage['numberInCage'] = numberInCageCount;
            ennumberedCages.push(cage);

            clickSound();

            context.font = '20px Georgia';
            context.fillStyle = "black";
            context.clearRect(enteredCage.leftX + 1, enteredCage.topY + 1, side - 2, side - 2);
            context.fillText(numberInCageCount.toString(), enteredCage.leftX + 10, enteredCage.topY + 25, side, side);

        }
        else {

            

        }

    }   

    canvas.addEventListener('mousemove', moveOverCage);
    canvas.addEventListener('click', insertNumberMovie);

});