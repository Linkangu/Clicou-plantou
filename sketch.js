let planta = 0;
let dinheiro = 0;
let estado = "fazenda";

let mapaFazenda, mapaCidade, imgPlanta;
let btnIndo, btnVoltando, btnVender;
let imgFazendeiro, imgFazendeiroPreco;
let imgTrator, imgTratorPreco;

let plantaBaseSize = 200;
let plantaSize = plantaBaseSize;
let plantaAngle = 0;
let plantaAngleDir = 0.015;

let miniClones = [];
let tempoUltimo = 0;

let fazendeiroNivel = 0;
let tratorNivel = 0;
let ganhoClique = 1;

function preload() {
  mapaFazenda = loadImage("pixilart-drawing (7).png");
  mapaCidade = loadImage("mopa-pixilart.png");
  imgPlanta = loadImage("pixilart-drawing (8).png");

  btnIndo = loadImage("indo.png");
  btnVoltando = loadImage("voltando.png");
  btnVender = loadImage("VENDER.png");

  imgFazendeiro = loadImage("FAZENDEIRO.png");
  imgFazendeiroPreco = loadImage("FAZENDEIRO PREÇO.png");
  imgTrator = loadImage("fazendeiro-pixilart.png");
  imgTratorPreco = loadImage("TRATORPREÇO.png");
}

function setup() {
  createCanvas(700, 500); // Reduzido de 800 para 700
  noSmooth();
  tempoUltimo = millis();
}

function draw() {
  background(220);

  if (estado === "fazenda") {
    image(mapaFazenda, 0, 0, width, height);
    drawFazenda();
  } else {
    image(mapaCidade, 0, 0, width, height);
    drawCidade();
  }

  updateClones();

  let taxa = fazendeiroNivel + (tratorNivel * 2);
  if (taxa > 0 && millis() - tempoUltimo >= 1000) {
    planta += taxa;
    tempoUltimo = millis();
  }
}

function drawFazenda() {
  fill(0);
  textSize(30);
  textAlign(RIGHT);
  text(dinheiro, width / 2 + 40, 64);
  text(planta, width / 2 + 40, 126);

  // Planta mais à esquerda
  push();
  translate(width / 3, height / 2 + 20);
  plantaAngle = lerp(plantaAngle, plantaAngle + plantaAngleDir, 0.05);
  if (abs(plantaAngle) > 0.1) plantaAngleDir *= -1;
  rotate(plantaAngle);
  imageMode(CENTER);
  image(imgPlanta, 0, 0, plantaSize, plantaSize);
  pop();
  imageMode(CORNER);

  const botaoX = width - 140;
  const fazY = 180;
  const precoFazY = fazY + 60;
  const tratY = precoFazY + 110;
  const precoTratY = tratY + 60;

  imageMode(CENTER);
  image(imgFazendeiro, botaoX, fazY, 75, 75);
  image(imgTrator, botaoX, tratY, 75, 75);
  imageMode(CORNER);

  image(imgFazendeiroPreco, botaoX - 60, precoFazY, 120, 60);
  image(imgTratorPreco, botaoX - 60, precoTratY, 120, 60);

  image(btnIndo, -10, height - 477, 150, 160); // Restaurado
}

function drawCidade() {
  fill(0);
  textSize(30);
  textAlign(CENTER);
  text(planta, width / 1.13, 133);
  text(dinheiro, width / 1.13, 70.5);

  image(btnVender, 500, height / 2.45 - 40, 160, 80); // Ajustado: 550 → 500
  image(btnVoltando, -10, height - 477, 150, 160); // Restaurado
}

function mousePressed() {
  if (estado === "fazenda") {
    if (dist(mouseX, mouseY, width / 3, height / 2 + 20) < plantaSize / 2) {
      planta += ganhoClique;
      plantaSize = plantaBaseSize * 1.1;
      for (let i = 0; i < min(fazendeiroNivel, 15); i++) spawnClone();
    }

    if (mouseX >= width - 200 && mouseX <= width - 80) {
      if (mouseY >= 240 && mouseY <= 300 && dinheiro >= 50) {
        dinheiro -= 50;
        fazendeiroNivel++;
        ganhoClique++;
      } else if (mouseY >= 430 && mouseY <= 490 && dinheiro >= 100) {
        dinheiro -= 100;
        tratorNivel++;
        tempoUltimo = millis();
      }
    }

    if (mouseX > -10 && mouseX < 140 &&
        mouseY > height - 477 && mouseY < height - 317) {
      estado = "cidade";
    }
  } else {
    if (mouseX > 500 && mouseX < 660 && // Atualizado para refletir nova posição
        mouseY > height / 2.45 - 40 && mouseY < height / 2.45 + 40) {
      dinheiro += planta;
      planta = 0;
    }

    if (mouseX > -10 && mouseX < 140 &&
        mouseY > height - 477 && mouseY < height - 317) {
      estado = "fazenda";
    }
  }
}

function keyPressed() {
  if (key === ' ') planta += ganhoClique;
}

function spawnClone() {
  miniClones.push({
    x: width / 3 + random(-plantaSize / 3, plantaSize / 3),
    y: height / 2 + 20 + random(-plantaSize / 3, plantaSize / 3),
    size: 40,
    vx: random(-1.5, 1.5),
    vy: random(1, 3),
    alpha: 255,
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vy += 0.05;
      this.alpha -= 3;
    },
    show() {
      push();
      tint(255, this.alpha);
      imageMode(CENTER);
      image(imgPlanta, this.x, this.y, this.size, this.size);
      pop();
    }
  });
}

function updateClones() {
  for (let i = miniClones.length - 1; i >= 0; i--) {
    miniClones[i].update();
    miniClones[i].show();
    if (miniClones[i].alpha <= 0 || miniClones[i].y > height + miniClones[i].size) {
      miniClones.splice(i, 1);
    }
  }

  plantaSize = lerp(plantaSize, plantaBaseSize, 0.1);
}
