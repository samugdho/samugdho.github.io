// @ts-check
import Sketch from "../app/sketch.mjs";
/**
 * @typedef {import('p5')} p5
 * @typedef {import('p5').Vector} Vector
 */

export default class Minesweeper extends Sketch {
  static Const = {
    State: {
      Unknown: 0,
      Displayed: 1,
      Flag: 2,
    },
    MaximumSpeed: 5,
    LongTapTime: 500,
  };
  /**
   *
   * @param {p5} P
   */
  constructor(P) {
    super(P);
    this.Size = { Width: 32, Height: 16 };
    /**
     *
     * @type {number[][]}
     */
    this.Board = [];
    /** @type {number[][]} */
    this.Displayed = [];
    this.Mines = {
      Total: 24,
    };
    this.D = {
      TileSize: 24,
      Gap: 2,
      FontSize: 12,
      StartPosition: P.createVector(),
      BorderRadius: 2,
    };
    this.Colors = {
      Mine: "#f44336",
      Empty: "#563098",
      Flag: "#03a9f4",
      Question: "#ffc107",
      Blank: "#673ab7",
      FontColor: "#b39ddb",
    };
    this.Scroll = {
      Position: P.createVector(),
      CanScroll: false,
      MaxScroll: 0,
      Step: 16,
      Velocity: P.createVector(),
    };
    this.PopulateBoard();
    this.Tap = {
      Down: false,
      Position: P.createVector(),
      Scroll: 0,
      Click: false,
      StartTime: 0,
      Long: false,
      LongTimer: null,
    };
  }
  PopulateBoard() {
    let size = this.Size;
    let mines = this.Mines.Total;
    for (let y = 0; y < size.Height; y++) {
      let col = [];
      this.Board.push(col);
      let disp = [];
      this.Displayed.push(disp);
      for (let x = 0; x < size.Width; x++) {
        col.push(0);
        disp.push(0);
      }
    }
    const search = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    /**
     *
     * @param {number} x
     * @param {number} y
     */
    let num = (x, y) => {
      for (let i = 0; i < search.length; i++) {
        let s = search[i];
        let dx = x + s[0];
        let dy = y + s[1];
        let cell = this.Board[dy] ? this.Board[dy][dx] : null;
        if (cell == null || cell == 9) continue;
        this.Board[dy][dx]++;
      }
    };
    // Add mines
    let i = 0;
    while (i < mines) {
      let x = Math.floor(Math.random() * size.Width);
      let y = Math.floor(Math.random() * size.Height);
      if (this.Board[y][x] == 0) {
        this.Board[y][x] = 9;
        i++;
      }
    }
    // Add hints
    for (let y = 0; y < size.Height; y++) {
      for (let x = 0; x < size.Width; x++) {
        let cell = this.Board[y][x];
        if (cell == 9) {
          num(x, y);
        }
      }
    }
  }

  /**
   *
   * @param {p5} P
   */
  static Sketch(P) {
    let S = new Minesweeper(P);
  }
  MousePressed() {
    this.Tap.Down = true;
    let P = this.Processing;
    this.Tap.Position.set(P.mouseX, P.mouseY);
    this.Tap.Scroll = this.Scroll.Position.x;
    this.Tap.StartTime = P.millis();
    this.Tap.LongTimer = setTimeout(() => (this.Tap.Long = true), Minesweeper.Const.LongTapTime);
  }
  MouseReleased() {
    this.Tap.Down = false;
    this.Tap.Click = true;
    let P = this.Processing;
    if (P.millis() - this.Tap.StartTime < Minesweeper.Const.LongTapTime) {
      clearTimeout(this.Tap.LongTimer);
    }
  }
  TapCell() {
    let P = this.Processing;
    let M = P.createVector(P.mouseX, P.mouseY);
    let Size = this.Size;
    let D = this.D;
    let TileSize = D.TileSize;
    let Gap = D.Gap;
    let StartPosition = D.StartPosition;
    let x = Math.floor((M.x - StartPosition.x) / (TileSize + Gap));
    let y = Math.floor((M.y - StartPosition.y) / (TileSize + Gap));
    if (x < 0 || y < 0 || x >= Size.Width || y >= Size.Height) return;
    let State = Minesweeper.Const.State;
    let cell = this.Board[y][x];
    let dispY = this.Displayed[y];
    let disp = dispY[x];
    if (P.mouseButton == P.RIGHT) {
      if (disp == State.Unknown) {
        dispY[x] = State.Flag;
      } else if (disp == State.Flag) {
        dispY[x] = State.Unknown;
      }
      return;
    }
    if (P.mouseButton == P.LEFT) {
      if (disp != State.Unknown) return;
      if (disp == State.Flag) {
        dispY[x] = State.Unknown;
        return;
      }
      if (cell == 0) {
        this.DisplayFill(x, y);
        return;
      }
      if (cell == 9) {
        // Display all
        for (let y = 0; y < Size.Height; y++) {
          for (let x = 0; x < Size.Width; x++) {
            this.Displayed[y][x] = State.Displayed;
          }
        }
        return;
      }
      this.Displayed[y][x] = State.Displayed;
      return;
    }
  }
  LongTapCell(){
    let P = this.Processing;
    let M = P.createVector(P.mouseX, P.mouseY);
    let Size = this.Size;
    let D = this.D;
    let TileSize = D.TileSize;
    let Gap = D.Gap;
    let StartPosition = D.StartPosition;
    let x = Math.floor((M.x - StartPosition.x) / (TileSize + Gap));
    let y = Math.floor((M.y - StartPosition.y) / (TileSize + Gap));
    if (x < 0 || y < 0 || x >= Size.Width || y >= Size.Height) return;
    let State = Minesweeper.Const.State;
    let cell = this.Board[y][x];
    let dispY = this.Displayed[y];
    let disp = dispY[x];

    if (disp == State.Unknown) {
      dispY[x] = State.Flag;
    } else if (disp == State.Flag) {
      dispY[x] = State.Unknown;
    }
  }
  /**
   *
   * @param {number} x
   * @param {number} y
   */
  DisplayFill(x, y) {
    let cell = this.Board[y] != null ? this.Board[y][x] : null;
    if (cell == null) return;
    let State = Minesweeper.Const.State;
    if (cell == 0) {
      let displayed = this.Displayed[y][x];
      if (displayed > 0) return;
      this.Displayed[y][x] = State.Displayed;
      this.DisplayFill(x + 1, y);
      this.DisplayFill(x - 1, y);
      this.DisplayFill(x, y + 1);
      this.DisplayFill(x, y - 1);
    } else {
      this.Displayed[y][x] = State.Displayed;
    }
  }
  Update() {
    const G = this;
    const P = this.Processing;
    let Board = this.Board;
    let Displayed = this.Displayed;
    let Size = this.Size;
    let D = this.D;
    let TileSize = D.TileSize;
    let Gap = D.Gap;
    let BR = D.BorderRadius;

    let StartPosition = D.StartPosition;
    P.push();
    let State = Minesweeper.Const.State;
    for (let y = 0; y < Size.Height; y++) {
      for (let x = 0; x < Size.Width; x++) {
        let cell = Board[y][x];
        let unknown = Displayed[y][x] == State.Unknown;
        let flag = Displayed[y][x] == State.Flag;
        let color = G.Colors.Blank;
        let position = StartPosition.copy().add(
          x * (TileSize + Gap),
          y * (TileSize + Gap)
        );
        if (unknown) {
          P.fill(color);
          P.rect(position.x, position.y, TileSize, TileSize, BR, BR, BR, BR);
          continue;
        } else {
          color = G.Colors.Empty;
        }
        if (cell == 9) {
          color = G.Colors.Mine;
        }
        if (flag) {
          color = G.Colors.Flag;
        }
        P.fill(color);
        P.rect(position.x, position.y, TileSize, TileSize, BR, BR, BR, BR);
        if (cell > 0 && cell < 9 && !flag) {
          // color = G.colors.empty;
          P.textAlign(P.CENTER, P.CENTER);
          // P.textSize(24);
          P.fill(G.Colors.FontColor);
          P.textSize(D.FontSize);
          P.text(
            cell,
            position.x + TileSize / 2,
            position.y + TileSize / 2 + Gap
          );
        }
      }
    }
    P.pop();

    let SV = this.Scroll.Velocity;
    let SP = this.Scroll.Position;
    let MaxScroll = this.Scroll.MaxScroll;
    let Mouse = P.createVector(P.mouseX, P.mouseY);
    let Displacement = Mouse.copy().sub(this.Tap.Position);
    // Tap Scroll
    if (this.Tap.Down && this.Scroll.CanScroll) {
      let TargetX = this.Tap.Scroll - Displacement.x;
      SP.x += (TargetX - SP.x) * 0.2;
    }
    // Add Velocity
    if (SV.x != 0) {
      if (Math.abs(SV.x) < 0.01) SV.x = 0;
      SV.x *= 0.9;
      SP.x += SV.x * P.deltaTime;
    }
    if (!this.Tap.Down) {
      let TargetX = SP.x < 0 ? 0 : SP.x > MaxScroll ? MaxScroll : SP.x;
      SP.x += (TargetX - SP.x) * 0.2;
    }
    // Move
    this.CalculateStartPosition();
    // Click
    if (this.Tap.Click) {
      this.Tap.Click = false;
      let TargetX = this.Tap.Scroll - Displacement.x;
      SV.x = (TargetX - SP.x) * 0.01;
      let MaximumSpeed = Minesweeper.Const.MaximumSpeed;
      if (Math.abs(SV.x) > MaximumSpeed) SV.x = MaximumSpeed * Math.sign(SV.x);
      if (SV.x < 0.1 && Math.abs(Displacement.x) < TileSize && !this.Tap.Long) {
        this.TapCell();
      }
    }
    if (this.Tap.Long) {
      this.Tap.Long = false;
      this.LongTapCell();
    }
  }
  WindowResized() {
    super.WindowResized();
    this.ResizeTileSize();
  }
  ResizeTileSize() {
    let P = this.Processing,
      D = this.D,
      S = this.Size;
    D.TileSize = Math.floor(P.height / S.Height) - D.Gap;
    D.BorderRadius = Math.max(2, Math.floor(D.TileSize / 10));
    this.Scroll.MaxScroll =
      S.Width * (D.TileSize + D.Gap) - P.width + D.Gap * 4;
    this.Scroll.CanScroll = this.Scroll.MaxScroll > 0;
    D.FontSize = D.TileSize / 2;
    this.CalculateStartPosition();
  }
  CalculateStartPosition() {
    let P = this.Processing,
      D = this.D,
      S = this.Size;
    D.StartPosition = P.createVector(
      Math.max(
        D.Gap * 2,
        (P.width - S.Width * D.TileSize - (S.Width - 1) * D.Gap) / 2
      ) - this.Scroll.Position.x,
      (P.height - S.Height * D.TileSize - (S.Height - 1) * D.Gap) / 2
    );
  }
  Setup() {
    super.Setup();
    this.ResizeTileSize();
    let R = this.Renderer;
    $(R.elt).on("contextmenu", (e) => e.preventDefault());
  }
  /**
   *
   * @param {WheelEvent} e
   */
  MouseWheel(e) {
    return;
    let CanScroll = this.Scroll.CanScroll;
    let MaxScroll = this.Scroll.MaxScroll;
    let Step = this.Scroll.Step;
    if (e.deltaY < 0) {
      Step *= -1;
    }
    if (!CanScroll) return;
    let SP = this.Scroll.Position;
    SP.x += Step;
    SP.x = Math.min(Math.max(SP.x, 0), MaxScroll);
    this.CalculateStartPosition();
  }
}
