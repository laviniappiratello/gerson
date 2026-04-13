export function calcularArcanoPessoal(data: Date): string {
  const dia = data.getDate();
  const mes = data.getMonth() + 1;
  const ano = data.getFullYear();

  const dataString = `${dia}${mes}${ano}`;
  let soma = dataString.split('').reduce((acc, curr) => acc + parseInt(curr), 0);

  while (soma > 22) {
    soma = soma.toString().split('').reduce((acc, curr) => acc + parseInt(curr), 0);
  }

  const arcanos: { [key: number]: string } = {
    1: "O Mago", 2: "A Sacerdotisa", 3: "A Imperatriz", 4: "O Imperador",
    5: "O Hierofante", 6: "Os Enamorados", 7: "O Carro", 8: "A Justiça",
    9: "O Eremita", 10: "A Roda da Fortuna", 11: "A Força", 12: "O Pendurado",
    13: "A Morte", 14: "A Temperança", 15: "O Diabo", 16: "A Torre",
    17: "A Estrela", 18: "A Lua", 19: "O Sol", 20: "O Julgamento",
    21: "O Mundo", 22: "O Louco"
  };

  return arcanos[soma] || "O Louco";
}