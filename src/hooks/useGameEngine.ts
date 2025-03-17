'use client';

import { useEffect, useRef } from 'react';

// 게임 엔진 클래스
class GameEngine {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  player: Player;
  monsters: Monster[];
  weapons: Weapon[];
  gameTime: number;
  score: number;
  isRunning: boolean;
  isPaused: boolean;
  lastFrameTime: number;
  settings: GameSettings;
  onScoreChange: (score: number) => void;
  onTimeChange: (time: number) => void;

  constructor(canvas: HTMLCanvasElement, settings: GameSettings, onScoreChange: (score: number) => void, onTimeChange: (time: number) => void) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas context not supported');
    this.ctx = ctx;
    
    this.settings = settings;
    this.onScoreChange = onScoreChange;
    this.onTimeChange = onTimeChange;
    
    // 게임 상태 초기화
    this.player = new Player(canvas.width / 2, canvas.height / 2, settings.character);
    this.monsters = [];
    this.weapons = [];
    this.gameTime = 0;
    this.score = 0;
    this.isRunning = false;
    this.isPaused = false;
    this.lastFrameTime = 0;
    
    // 이벤트 리스너 설정
    this.setupEventListeners();
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    window.addEventListener('keydown', this.handleKeyDown.bind(this));
    window.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  // 키 입력 처리
  handleKeyDown(e: KeyboardEvent) {
    if (!this.isRunning || this.isPaused) return;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        this.player.moveUp = true;
        break;
      case 'ArrowDown':
      case 's':
        this.player.moveDown = true;
        break;
      case 'ArrowLeft':
      case 'a':
        this.player.moveLeft = true;
        break;
      case 'ArrowRight':
      case 'd':
        this.player.moveRight = true;
        break;
    }
  }

  // 키 입력 해제 처리
  handleKeyUp(e: KeyboardEvent) {
    if (!this.isRunning) return;
    
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        this.player.moveUp = false;
        break;
      case 'ArrowDown':
      case 's':
        this.player.moveDown = false;
        break;
      case 'ArrowLeft':
      case 'a':
        this.player.moveLeft = false;
        break;
      case 'ArrowRight':
      case 'd':
        this.player.moveRight = false;
        break;
    }
  }

  // 게임 시작
  start() {
    this.isRunning = true;
    this.isPaused = false;
    this.gameTime = 0;
    this.score = 0;
    this.monsters = [];
    this.weapons = [];
    
    // 초기 무기 설정
    this.weapons.push(new Weapon(this.player.x, this.player.y, this.settings.weapon));
    
    // 게임 루프 시작
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  // 게임 일시정지/재개
  togglePause() {
    this.isPaused = !this.isPaused;
    if (!this.isPaused) {
      this.lastFrameTime = performance.now();
      requestAnimationFrame(this.gameLoop.bind(this));
    }
  }

  // 게임 종료
  stop() {
    this.isRunning = false;
  }

  // 게임 루프
  gameLoop(timestamp: number) {
    if (!this.isRunning) return;
    if (this.isPaused) return;
    
    // 델타 타임 계산 (초 단위)
    const deltaTime = (timestamp - this.lastFrameTime) / 1000;
    this.lastFrameTime = timestamp;
    
    // 게임 상태 업데이트
    this.update(deltaTime);
    
    // 게임 렌더링
    this.render();
    
    // 다음 프레임 요청
    requestAnimationFrame(this.gameLoop.bind(this));
  }

  // 게임 상태 업데이트
  update(deltaTime: number) {
    // 게임 시간 업데이트
    this.gameTime += deltaTime;
    this.onTimeChange(this.gameTime);
    
    // 플레이어 업데이트
    this.player.update(deltaTime, this.canvas);
    
    // 몬스터 생성
    if (Math.random() < this.settings.monster.spawnRate * deltaTime) {
      this.spawnMonster();
    }
    
    // 몬스터 업데이트
    for (let i = this.monsters.length - 1; i >= 0; i--) {
      const monster = this.monsters[i];
      monster.update(deltaTime, this.canvas, this.player);
      
      // 플레이어와 몬스터 충돌 체크
      if (this.checkCollision(this.player, monster)) {
        this.player.takeDamage(monster.damage);
        if (this.player.health <= 0) {
          this.stop();
          return;
        }
      }
    }
    
    // 무기 업데이트
    for (let i = this.weapons.length - 1; i >= 0; i--) {
      const weapon = this.weapons[i];
      weapon.update(deltaTime, this.player.x, this.player.y);
      
      // 무기와 몬스터 충돌 체크
      for (let j = this.monsters.length - 1; j >= 0; j--) {
        const monster = this.monsters[j];
        if (weapon.checkHit(monster)) {
          monster.takeDamage(weapon.damage);
          if (monster.health <= 0) {
            this.monsters.splice(j, 1);
            this.score += 10;
            this.onScoreChange(this.score);
          }
        }
      }
    }
  }

  // 몬스터 생성
  spawnMonster() {
    // 화면 밖에서 몬스터 생성
    let x, y;
    const side = Math.floor(Math.random() * 4); // 0: 위, 1: 오른쪽, 2: 아래, 3: 왼쪽
    
    switch (side) {
      case 0: // 위
        x = Math.random() * this.canvas.width;
        y = -30;
        break;
      case 1: // 오른쪽
        x = this.canvas.width + 30;
        y = Math.random() * this.canvas.height;
        break;
      case 2: // 아래
        x = Math.random() * this.canvas.width;
        y = this.canvas.height + 30;
        break;
      case 3: // 왼쪽
        x = -30;
        y = Math.random() * this.canvas.height;
        break;
      default:
        x = 0;
        y = 0;
    }
    
    this.monsters.push(new Monster(x, y, this.settings.monster));
  }

  // 충돌 체크
  checkCollision(obj1: { x: number, y: number, radius: number }, obj2: { x: number, y: number, radius: number }) {
    const dx = obj1.x - obj2.x;
    const dy = obj1.y - obj2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < obj1.radius + obj2.radius;
  }

  // 게임 렌더링
  render() {
    const { ctx, canvas } = this;
    
    // 캔버스 지우기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 배경 그리기
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 플레이어 그리기
    this.player.render(ctx);
    
    // 몬스터 그리기
    for (const monster of this.monsters) {
      monster.render(ctx);
    }
    
    // 무기 그리기
    for (const weapon of this.weapons) {
      weapon.render(ctx);
    }
    
    // 게임 정보 그리기
    this.renderGameInfo();
  }

  // 게임 정보 렌더링
  renderGameInfo() {
    const { ctx } = this;
    
    // 플레이어 체력 바
    ctx.fillStyle = '#333';
    ctx.fillRect(20, 20, 200, 20);
    
    const healthPercent = this.player.health / this.player.maxHealth;
    ctx.fillStyle = healthPercent > 0.5 ? '#0f0' : healthPercent > 0.25 ? '#ff0' : '#f00';
    ctx.fillRect(20, 20, 200 * healthPercent, 20);
    
    ctx.strokeStyle = '#fff';
    ctx.strokeRect(20, 20, 200, 20);
    
    // 체력 텍스트
    ctx.fillStyle = '#fff';
    ctx.font = '14px Arial';
    ctx.fillText(`체력: ${Math.floor(this.player.health)}/${this.player.maxHealth}`, 25, 35);
  }

  // 리소스 정리
  cleanup() {
    window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    window.removeEventListener('keyup', this.handleKeyUp.bind(this));
  }
}

// 플레이어 클래스
class Player {
  x: number;
  y: number;
  radius: number;
  speed: number;
  health: number;
  maxHealth: number;
  damage: number;
  moveUp: boolean;
  moveDown: boolean;
  moveLeft: boolean;
  moveRight: boolean;
  color: string;

  constructor(x: number, y: number, settings: CharacterSettings) {
    this.x = x;
    this.y = y;
    this.radius = 20;
    this.speed = settings.speed;
    this.health = settings.health;
    this.maxHealth = settings.health;
    this.damage = settings.damage;
    this.moveUp = false;
    this.moveDown = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.color = '#f00';
  }

  update(deltaTime: number, canvas: HTMLCanvasElement) {
    // 이동 처리
    const moveDistance = this.speed * deltaTime;
    
    if (this.moveUp) this.y -= moveDistance;
    if (this.moveDown) this.y += moveDistance;
    if (this.moveLeft) this.x -= moveDistance;
    if (this.moveRight) this.x += moveDistance;
    
    // 화면 경계 처리
    this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
  }

  takeDamage(amount: number) {
    this.health -= amount;
    if (this.health < 0) this.health = 0;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 테두리
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

// 몬스터 클래스
class Monster {
  x: number;
  y: number;
  radius: number;
  speed: number;
  health: number;
  maxHealth: number;
  damage: number;
  color: string;

  constructor(x: number, y: number, settings: MonsterSettings) {
    this.x = x;
    this.y = y;
    this.radius = 15;
    this.speed = settings.speed;
    this.health = settings.health;
    this.maxHealth = settings.health;
    this.damage = settings.damage;
    this.color = '#0f0';
  }

  update(deltaTime: number, canvas: HTMLCanvasElement, player: Player) {
    // 플레이어 방향으로 이동
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      const moveX = (dx / distance) * this.speed * deltaTime;
      const moveY = (dy / distance) * this.speed * deltaTime;
      this.x += moveX;
      this.y += moveY;
    }
  }

  takeDamage(amount: number) {
    this.health -= amount;
    if (this.health < 0) this.health = 0;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // 체력 바
    const healthBarWidth = this.radius * 2;
    const healthBarHeight = 4;
    const healthPercent = this.health / this.maxHealth;
    
    ctx.fillStyle = '#333';
    ctx.fillRect(this.x - this.radius, this.y - this.radius - 10, healthBarWidth, healthBarHeight);
    
    ctx.fillStyle = healthPercent > 0.5 ? '#0f0' : healthPercent > 0.25 ? '#ff0' : '#f00';
    ctx.fillRect(this.x - this.radius, this.y - this.radius - 10, healthBarWidth * healthPercent, healthBarHeight);
  }
}

// 무기 클래스
class Weapon {
  x: number;
  y: number;
  radius: number;
  damage: number;
  speed: number;
  range: number;
  angle: number;
  color: string;
  hitCooldown: number;
  lastHitTime: { [key: string]: number };

  constructor(x: number, y: number, settings: WeaponSettings) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.damage = settings.damage;
    this.speed = settings.speed;
    this.range = settings.range;
    this.angle = 0;
    this.color = '#ff0';
    this.hitCooldown = 1 / this.speed; // 공격 속도에 따른 쿨다운
    this.lastHitTime = {}; // 몬스터별 마지막 공격 시간
  }

  update(deltaTime: number, playerX: number, playerY: number) {
    // 플레이어 주변을 회전
    this.angle += deltaTime * this.speed * 2;
    if (this.angle > Math.PI * 2) this.angle -= Math.PI * 2;
    
    this.x = playerX + Math.cos(this.angle) * this.range;
    this.y = playerY + Math.sin(this.angle) * this.range;
  }

  checkHit(monster: Monster): boolean {
    const dx = monster.x - this.x;
    const dy = monster.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // 몬스터 ID (간단하게 좌표로 대체)
    const monsterId = `${monster.x},${monster.y}`;
    
    // 현재 시간
    const now = performance.now() / 1000;
    
    // 쿨다운 체크
    if (this.lastHitTime[monsterId] && now - this.lastHitTime[monsterId] < this.hitCooldown) {
      return false;
    }
    
    // 충돌 체크
    if (distance < this.radius + monster.radius) {
      this.lastHitTime[monsterId] = now;
      return true;
    }
    
    return false;
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

// 게임 설정 타입
interface GameSettings {
  character: CharacterSettings;
  monster: MonsterSettings;
  weapon: WeaponSettings;
  gameSpeed: number;
  difficulty: string;
}

interface CharacterSettings {
  health: number;
  speed: number;
  damage: number;
}

interface MonsterSettings {
  health: number;
  speed: number;
  damage: number;
  spawnRate: number;
}

interface WeaponSettings {
  damage: number;
  speed: number;
  range: number;
}

// 게임 엔진 훅
export function useGameEngine(canvasRef: React.RefObject<HTMLCanvasElement>, onScoreChange: (score: number) => void, onTimeChange: (time: number) => void) {
  const gameEngineRef = useRef<GameEngine | null>(null);
  
  // 기본 게임 설정
  const defaultSettings: GameSettings = {
    character: {
      health: 100,
      speed: 200,
      damage: 10
    },
    monster: {
      health: 30,
      speed: 100,
      damage: 10,
      spawnRate: 0.5
    },
    weapon: {
      damage: 10,
      speed: 2,
      range: 50
    },
    gameSpeed: 1,
    difficulty: 'normal'
  };
  
  // 게임 시작
  const startGame = (settings: GameSettings = defaultSettings) => {
    if (!canvasRef.current) return;
    
    // 캔버스 크기 설정
    canvasRef.current.width = canvasRef.current.clientWidth;
    canvasRef.current.height = canvasRef.current.clientHeight;
    
    // 이전 게임 엔진 정리
    if (gameEngineRef.current) {
      gameEngineRef.current.cleanup();
    }
    
    // 새 게임 엔진 생성
    gameEngineRef.current = new GameEngine(canvasRef.current, settings, onScoreChange, onTimeChange);
    gameEngineRef.current.start();
  };
  
  // 게임 일시정지/재개
  const togglePause = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.togglePause();
    }
  };
  
  // 게임 종료
  const stopGame = () => {
    if (gameEngineRef.current) {
      gameEngineRef.current.stop();
    }
  };
  
  // 리소스 정리
  useEffect(() => {
    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.cleanup();
      }
    };
  }, []);
  
  return { startGame, togglePause, stopGame };
}

export default useGameEngine;
