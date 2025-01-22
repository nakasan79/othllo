document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("othelloBoard");
    const ctx = canvas.getContext("2d");
    const size = 8;
    const cellSize = 50;
    canvas.width = size * cellSize;
    canvas.height = size * cellSize;

    let board = Array(size).fill(null).map(() => Array(size).fill(null));
    let currentPlayer = 'black';

    // 8方向のベクトル
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0],
        [1, 1], [1, -1], [-1, 1], [-1, -1]
    ];

    function initBoard() {
        board[3][3] = 'white';
        board[3][4] = 'black';
        board[4][3] = 'black';
        board[4][4] = 'white';
    }

    function drawBoard() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // セル描画
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                ctx.strokeStyle = "black";
                ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
                // 駒描画
                if (board[i][j]) {
                    ctx.beginPath();
                    ctx.arc(i * cellSize + cellSize / 2, j * cellSize + cellSize / 2, cellSize / 3, 0, 2 * Math.PI);
                    ctx.fillStyle = board[i][j];
                    ctx.fill();
                    ctx.stroke();
                }
            }
        }
    }

    // 指定した方向にあるひっくり返せる石のリストを取得
    function stonesToFlip(x, y, dx, dy, color) {
        let stones = [];
        let opponent = color === 'black' ? 'white' : 'black';
        let i = x + dx;
        let j = y + dy;
        while (i >= 0 && i < size && j >= 0 && j < size) {
            if (board[i][j] === opponent) {
                stones.push([i, j]);
            } else if (board[i][j] === color) {
                return stones;
            } else {
                break;
            }
            i += dx;
            j += dy;
        }
        return [];
    }

    // その場所に置けるかチェックし、置いた場合ひっくり返す
    function placeStone(x, y, color) {
        if (board[x][y] !== null) return false;

        let flipped = [];
        for (const [dx, dy] of directions) {
            const stones = stonesToFlip(x, y, dx, dy, color);
            if (stones.length > 0) {
                flipped = flipped.concat(stones);
            }
        }

        if (flipped.length === 0) {
            return false; // 置ける石がない場合
        }

        // 駒を置く
        board[x][y] = color;
        // ひっくり返す
        for (const [i, j] of flipped) {
            board[i][j] = color;
        }
        return true;
    }

    canvas.addEventListener("click", function (event) {
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((event.clientX - rect.left) / cellSize);
        const y = Math.floor((event.clientY - rect.top) / cellSize);

        // 有効な手がある場合に石を配置
        if (placeStone(x, y, currentPlayer)) {
            // プレイヤー交代
            currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
            drawBoard();
        }
    });

    initBoard();
    drawBoard();
});
