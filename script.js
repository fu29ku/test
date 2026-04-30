// 仮データ（後で職場のデータに差し替え）
const data = [
  { maker: "トヨタ", car: "プリウス", model: "DAA-ZVW30", filter: "ABC-123" },
  { maker: "ホンダ", car: "N-BOX", model: "DBA-JF1", filter: "XYZ-999" }
];

function searchFilter() {
  const maker = document.getElementById("maker").value.trim();
  const car = document.getElementById("carName").value.trim();
  const model = document.getElementById("model").value.trim();

  const hit = data.find(item =>
    item.maker === maker &&
    item.car === car &&
    item.model === model
  );

  const result = document.getElementById("result");

  if (hit) {
    result.innerHTML = `
      <p>適合フィルター品番：<strong>${hit.filter}</strong></p>
      <p><a href="#">楽天で見る</a></p>
      <p><a href="#">Yahooで見る</a></p>
      <p><a href="#">Amazonで見る</a></p>
    `;
  } else {
    result.innerHTML = "該当データがありません。";
  }
}
