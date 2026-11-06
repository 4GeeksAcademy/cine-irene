const FILAS = 8;
const COLUMNAS = 10;

// 0 = libre, 1 = ocupado
function inicializarSala(): number[][] {
  const matriz: number[][] = [];
  for (let f = 0; f < FILAS; f++) {
    const fila: number[] = [];
    for (let c = 0; c < COLUMNAS; c++) {
      fila.push(0);
    }
    matriz.push(fila);
  }
  return matriz;
}

function mostrarSala(): void {
  for (let f = 0; f < FILAS; f++) {
    let linea = "Fila " + f + ": ";
    for (let c = 0; c < COLUMNAS; c++) {
      if (sala[f][c] === 1) {
        linea = linea + "X ";
      } else {
        linea = linea + "L ";
      }
    }
    console.log(linea);
  }
}

function reservarAsiento(fila: number, columna: number): string {
  if (fila < 0 || fila >= FILAS || columna < 0 || columna >= COLUMNAS) {
    return "Error: el asiento (" + fila + ", " + columna + ") no existe";
  }
  if (sala[fila][columna] === 1) {
    return "Error: el asiento (" + fila + ", " + columna + ") ya está ocupado";
  } else {
    sala[fila][columna] = 1;
    return "Reserva realizada: asiento (" + fila + ", " + columna + ")";
  }
}

function contarAsientos(): { ocupados: number; libres: number } {
  let ocupados = 0;
  let libres = 0;
  for (let f = 0; f < FILAS; f++) {
    for (let c = 0; c < COLUMNAS; c++) {
      if (sala[f][c] === 1) {
        ocupados++;
      } else {
        libres++;
      }
    }
  }
  return { ocupados: ocupados, libres: libres };
}

// Devuelve [fila, columna1, columna2] o null si no hay pareja libre
function buscarDosContiguos(): number[] | null {
  for (let f = 0; f < FILAS; f++) {
    for (let c = 0; c < COLUMNAS - 1; c++) {
      if (sala[f][c] === 0 && sala[f][c + 1] === 0) {
        return [f, c, c + 1];
      }
    }
  }
  return null;
}

let sala = inicializarSala();

// Asientos ocupados de la imagen: [fila, columna]
const ocupadosIniciales: number[][] = [
  [0, 1], [0, 4], [0, 5], [0, 8],
  [1, 0], [1, 3], [1, 6], [1, 7], [1, 9],
  [2, 2], [2, 4], [2, 8],
  [3, 1], [3, 5], [3, 6], [3, 9],
  [4, 0], [4, 3], [4, 4], [4, 7],
  [5, 2], [5, 5], [5, 8], [5, 9],
  [6, 1], [6, 4], [6, 6],
  [7, 0], [7, 3], [7, 7], [7, 8],
];

for (let i = 0; i < ocupadosIniciales.length; i++) {
  reservarAsiento(ocupadosIniciales[i][0], ocupadosIniciales[i][1]);
}

mostrarSala();

const conteo = contarAsientos();
console.log("Ocupados: " + conteo.ocupados + " | Libres: " + conteo.libres);

const pareja = buscarDosContiguos();
if (pareja !== null) {
  console.log("Asientos contiguos libres: fila " + pareja[0] + ", columnas " + pareja[1] + " y " + pareja[2]);
} else {
  console.log("No hay dos asientos contiguos libres");
}

function pintarWeb(): void {
  const contenedor = document.getElementById("sala");
  const textoConteo = document.getElementById("conteo");
  const textoPareja = document.getElementById("pareja");
  if (contenedor === null || textoConteo === null || textoPareja === null) {
    return;
  }

  const parejaLibre = buscarDosContiguos();
  contenedor.innerHTML = "";

  for (let f = 0; f < FILAS; f++) {
    const filaHtml = document.createElement("div");
    filaHtml.className = "flex items-center gap-2";

    const etiqueta = document.createElement("span");
    etiqueta.className = "w-6 text-right text-sm text-slate-500";
    etiqueta.textContent = String(f);
    filaHtml.appendChild(etiqueta);

    for (let c = 0; c < COLUMNAS; c++) {
      const boton = document.createElement("button");
      let esPareja = false;
      if (parejaLibre !== null && parejaLibre[0] === f && (parejaLibre[1] === c || parejaLibre[2] === c)) {
        esPareja = true;
      }

      if (sala[f][c] === 1) {
        boton.textContent = "X";
        boton.className = "h-10 w-10 rounded-lg border border-red-400 bg-red-50 font-bold text-red-800 cursor-not-allowed";
      } else if (esPareja) {
        boton.textContent = "L";
        boton.className = "h-10 w-10 rounded-lg border-2 border-dashed border-amber-600 bg-amber-300 font-bold text-amber-900 hover:bg-amber-400";
      } else {
        boton.textContent = "L";
        boton.className = "h-10 w-10 rounded-lg border border-emerald-500 bg-emerald-50 font-bold text-emerald-800 hover:bg-emerald-200";
      }

      boton.addEventListener("click", function () {
        const resultado = reservarAsiento(f, c);
        const mensaje = document.getElementById("mensaje");
        if (mensaje !== null) {
          mensaje.textContent = resultado;
          if (resultado.indexOf("Error") === 0) {
            mensaje.className = "h-6 text-sm font-medium text-red-600";
          } else {
            mensaje.className = "h-6 text-sm font-medium text-emerald-700";
          }
        }
        pintarWeb();
      });

      filaHtml.appendChild(boton);
    }
    contenedor.appendChild(filaHtml);
  }

  const totales = contarAsientos();
  textoConteo.textContent = "Ocupados: " + totales.ocupados + " | Libres: " + totales.libres;

  if (parejaLibre !== null) {
    textoPareja.textContent = "Pareja libre: fila " + parejaLibre[0] + ", columnas " + parejaLibre[1] + " y " + parejaLibre[2];
  } else {
    textoPareja.textContent = "No hay dos asientos contiguos libres";
  }
}

// Solo en el navegador; con tsx (consola) no existe document
if (typeof document !== "undefined") {
  import("./style.css").then(function () {
    pintarWeb();
  });
}

export {};
