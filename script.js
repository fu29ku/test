// ▼ 仮データ（明日差し替えOK）
const data = [
  { maker: "トヨタ", car: "プリウス", model: "ZVW30", year: "2010", grade: "S", engine: "2ZR", drive: "2WD", filter: "ABC-123", rakuten: "#", yahoo: "#" },
  { maker: "ホンダ", car: "N-BOX", model: "JF1", year: "2015", grade: "G", engine: "S07A", drive: "4WD", filter: "XYZ-999", rakuten: "#", yahoo: "#" }
];

// ▼ 車種ごとの必要項目（仮）
const carRules = {
  "プリウス": { required: ["model", "year"] },
  "N-BOX": { required: ["model", "year", "grade"] }
};

// ▼ メーカー一覧
window.onload = function() {
  const makerSelect = document.getElementById("maker");
  const makers = [...new Set(data.map(item => item.maker))];

  makers.forEach(m => {
    const option = document.createElement("option");
    option.value = m;
    option.textContent = m;
    makerSelect.appendChild(option);
  });
};

// ▼ メーカー → 車名
function updateCarNames() {
  const maker = maker.value;
  carName.innerHTML = '<option value="">選択してください</option>';

  const cars = [...new Set(data.filter(i => i.maker === maker).map(i => i.car))];

  cars.forEach(c => {
    const op = document.createElement("option");
    op.value = c;
    op.textContent = c;
    carName.appendChild(op);
  });

  model.innerHTML = '<option value="">選択してください</option>';
  hideAllDynamicFields();
}

// ▼ 車名 → 型式
function updateModels() {
  const makerVal = maker.value;
  const carVal = carName.value;

  model.innerHTML = '<option value="">選択してください</option>';

  const models = [...new Set(data.filter(i =>
    i.maker === makerVal && i.car === carVal
  ).map(i => i.model))];

  models.forEach(m => {
    const op = document.createElement("option");
    op.value = m;
    op.textContent = m;
    model.appendChild(op);
  });

  hideAllDynamicFields();
}

// ▼ 型式 → 必要項目だけ表示
function updateDynamicQuestions() {
  hideAllDynamicFields();

  const carVal = carName.value;
  const rule = carRules[carVal] || { required: [] };

  rule.required.forEach(key => {
    const field = document.getElementById(key + "Field");
    if (field) field.style.display = "block";

    const select = document.getElementById(key);
    const makerVal = maker.value;
    const modelVal = model.value;

    const values = [...new Set(
      data.filter(i =>
        i.maker === makerVal &&
        i.car === carVal &&
        i.model === modelVal
      ).map(i => i[key])
    )];

    select.innerHTML = "";
    values.forEach(v => {
      const op = document.createElement("option");
      op.value = v;
      op.textContent = v;
      select.appendChild(op);
    });
  });
}

// ▼ 全項目非表示
function hideAllDynamicFields() {
  ["yearField", "gradeField", "engineField", "driveField"].forEach(id => {
    document.getElementById(id).style.display = "none";
  });
}

// ▼ 入力チェック
function validateForm() {
  const carVal = carName.value;
  const rule = carRules[carVal] || { required: [] };

  if (!maker.value || !carName.value || !model.value) {
    disableSearch("すべて選択してください");
    return;
  }

  for (const key of rule.required) {
    if (!document.getElementById(key).value) {
      disableSearch("すべて選択してください");
      return;
    }
  }

  enableSearch();
}

function disableSearch(msg) {
  searchBtn.disabled = true;
  errorMsg.textContent = msg;
}

function enableSearch() {
  searchBtn.disabled = false;
  errorMsg.textContent = "";
}

// ▼ 検索
function searchFilter() {
  validateForm();
  if (searchBtn.disabled) return;

  const makerVal = maker.value;
  const carVal = carName.value;
  const modelVal = model.value;

  let filtered = data.filter(i =>
    i.maker === makerVal &&
    i.car === carVal &&
    i.model === modelVal
  );

  const rule = carRules[carVal] || { required: [] };
  rule.required.forEach(key => {
    const val = document.getElementById(key).value;
    filtered = filtered.filter(i => i[key] === val);
  });

  if (filtered.length === 0) {
    result.textContent = "該当データがありません。";
    return;
  }

  const hit = filtered[0];
  result.innerHTML = `
    <p>適合フィルター品番：<strong>${hit.filter}</strong></p>
    <a href="${hit.rakuten}">楽天で見る</a>
    <a href="${hit.yahoo}">Yahooで見る</a>
  `;
}
