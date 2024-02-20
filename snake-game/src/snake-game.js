import { LitElement, html, css } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
class SnakeGame extends LitElement {
    static styles = css`
    :host {
      display: block;
      --snake-size: 20px; /* Size of the snake block */
      --snake-head-color: #FFD700; /* Gold color for the head */
      --snake-body-color: lime; /* Existing body color */
    }
    .game-container {
      width: var(--game-size, 400px);
      height: var(--game-size, 400px);
      background-color: black;
      position: relative;
    }
    .snake-head {
      position: absolute;
      width: var(--snake-size);
      height: var(--snake-size);
      background-color: var(--snake-head-color);
    }
    .snake-body {
      position: absolute;
      width: var(--snake-size);
      height: var(--snake-size);
      background-color: var(--snake-body-color);
    }
    .food {
      position: absolute;
      width: var(--snake-size);
      height: var(--snake-size);
      background-color: red;
    }

    @keyframes flash {
      0% { outline: 20px solid red; }
      50% { outline: none; }
      100% { outline: 2px solid red; }
    }
    .flashing-outline {
      animation: flash 1s infinite;
    }
  `;

  static get properties() {
    return {
      snake: { type: Array },
      food: { type: Object },
      direction: { type: String },
      gameRunning: { type: Boolean },
      gameSize: { type: Number },
      collisionOccured: { type: Boolean },
      score: { type: Number }
    };
  }

  constructor() {
    super();
    this.gameSize = 800;
    this.gameRunning = false;
    this.timeoutId = null;
    this.resetProperties();
  }

  resetProperties()  {    
    this.snake = [{ x: 10, y: 10 }];
    this.food = { x: this.randomPosition(), y: this.randomPosition() };
    this.direction = 'ArrowRight'; 
    this.moveSnake = this.moveSnake.bind(this);
    this.collisionOccured = false;
    this.score = 0;
  }

  startGame() {
    this.gameRunning = true;
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId);
    }
    this.gameLoop();
  }

  resetGame() {
    if (this.timeoutId !== null) {
      clearTimeout(this.timeoutId); 
      this.timeoutId = null;
    }
    this.resetProperties();    
    this.requestUpdate();
    this.startGame();
  }

  firstUpdated() {
    window.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          this.direction = e.key;
          break;
        default:
          break;
      }
    });

    this.startGame();
  }

  gameLoop() {
    if (this.gameRunning) {
      this.moveSnake();
      this.checkCollision();
      this.updateFood();
      this.requestUpdate();
      this.timeoutId = setTimeout(() => this.gameLoop(), 200); 
    }
  }

  moveSnake() {
    let newHead = { ...this.snake[0] };

    // Update the position for the new head
    switch (this.direction) {
      case 'ArrowUp':
        newHead.y -= 1;
        break;
      case 'ArrowDown':
        newHead.y += 1;
        break;
      case 'ArrowLeft':
        newHead.x -= 1;
        break;
      case 'ArrowRight':
        newHead.x += 1;
        break;
      default:
        break;
    }

    this.snake = [newHead, ...this.snake.slice(0, -1)]; // Move the snake
  }

  checkCollision() {
    const head = this.snake[0];
    const gameWidth = (this.gameSize / 20);
    if (head.x < 0 || head.x >= gameWidth || head.y < 0 || head.y >= gameWidth) {
      console.log("Collision happened.");
      this.collisionOccured = true;
      this.gameRunning = false; 
      return;
    }

    if (head.x === this.food.x && head.y === this.food.y) {
      this.snake.push({ ...this.snake[this.snake.length - 1] }); // Extend the snake
      this.food = { x: this.randomPosition(), y: this.randomPosition() };
      this.score += 1;
    }
  }

  updateFood() {
    // Logic to render or update food position if necessary
  }

  randomPosition() {
    return Math.floor(Math.random() * (this.gameSize/20)); 
  }

  renderSnake() {
    return this.snake.map((segment, index) => {
      const segmentClass = index === 0 ? 'snake-head' : 'snake-body';
      return html`<div class="${segmentClass}" style="left: ${segment.x * 20}px; top: ${segment.y * 20}px;"></div>`;
    });
  }

  renderFood() {
    return html`
      <div class="food" style="left: ${this.food.x * 20}px; top: ${this.food.y * 20}px;"></div>
    `;
  }

  render() {
    const gameContainerClasses = { 'flashing-outline': this.collisionOccured, 'game-container': true };
    console.log(gameContainerClasses);
    const gameStyle = `--game-size: ${this.gameSize}px;`;
    return html`
      <select @change="${this.onGameSizeChange}">
        <option value="400">Small</option>
        <option value="600">Medium</option>
        <option value="800">Large</option>
      </select>
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="${this.resetGame}">Reset Game</button>
      <div class="score">Score: ${this.score}</div>
      <div class=${classMap(gameContainerClasses)} style="${gameStyle}">
        ${this.renderSnake()} ${this.renderFood()}
      </div>
    `;
  }

  onGameSizeChange(e) {
    this.gameSize = Number(e.target.value);
    this.resetGame();
  }
}

customElements.define('snake-game', SnakeGame);
