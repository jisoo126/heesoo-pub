// checkout.js

// 1) localStorage에서 주문 정보를 불러옵니다.
const peopleCount = parseInt(localStorage.getItem("peopleCount"), 10);
const orderList = JSON.parse(localStorage.getItem("orderList")) || [];

// 2) 사람별 선택을 저장할 배열을 초기화 (각 인덱스: p1, p2, …)
let selections = Array.from({ length: peopleCount }, () => []);

// 3) 현재 어떤 손님을 처리 중인지 저장할 인덱스 (0부터 시작 → p1=0, p2=1, …)
let currentPersonIndex = 0;

// 4) 문서가 로드되면 첫 번째 사람(p1) 선택 화면을 렌더링합니다.
window.addEventListener("DOMContentLoaded", () => {
  renderPersonSelection();
});

/**
 * 개별 선택 화면을 렌더링하는 함수
 * - 각 메뉴당 체크박스 1개만 생성
 * - 주문된 수량(qty)에 관계없이, 원하면 여러 사람이 체크할 수 있도록 함
 */
function renderPersonSelection() {
  const container = document.getElementById("selection-container");
  container.innerHTML = ""; // 이전 내용을 지웁니다.

  // “현재 몇 번째 손님인지” 안내
  const heading = document.createElement("h2");
  heading.innerText = `👤 ${currentPersonIndex + 1}번째 손님, 드실 음식을 골라주세요!`;
  heading.className = "person-heading";
  container.appendChild(heading);

  // 주문된 메뉴(orderList)를 순회하며, 각 메뉴당 체크박스 1개씩 생성
  orderList.forEach((item) => {
    // item: { id, name, qty, price }
    const itemDiv = document.createElement("div");
    itemDiv.className = "selection-item";

    // 메뉴명 + (주문 수량) 표시: qty를 그대로 보여주어 "주문된 개수"를 알 수 있게 함
    const nameSpan = document.createElement("span");
    nameSpan.innerText = `${item.name} (주문: ${item.qty}개)`;
    nameSpan.className = "sel-item-name";
    itemDiv.appendChild(nameSpan);

    // 체크박스 생성: 메뉴당 하나
    const chk = document.createElement("input");
    chk.type = "checkbox";
    chk.className = "sel-checkbox";
    chk.id = `sel-${item.id}`;    // 예: sel-item-1
    chk.name = item.id;           // 체크박스를 item.id로 그룹화
    chk.value = "1";              // 값은 체크 여부만 확인할 것이므로 상관 없습니다.

    // 만약 이전에 이 사람이 이미 체크해둔 내역이 있으면, 미리 체크 상태로 표시
    const prevSelection = selections[currentPersonIndex].find(
      (sel) => sel.id === item.id
    );
    if (prevSelection) {
      chk.checked = true;
    }

    // 라벨(label)은 체크박스 클릭할 때 포커스를 돕기 위해 붙임
    // 텍스트는 빈 문자열로 두거나, 필요시 아이콘/간단한 표시를 넣어도 됩니다.
    const lbl = document.createElement("label");
    lbl.htmlFor = chk.id;
    lbl.innerText = ""; // 텍스트가 불필요하다면 빈 문자열

    // 체크박스 + 라벨을 묶어서 itemDiv에 추가
    const boxContainer = document.createElement("div");
    boxContainer.className = "checkbox-single";
    boxContainer.appendChild(chk);
    boxContainer.appendChild(lbl);

    itemDiv.appendChild(boxContainer);
    container.appendChild(itemDiv);
  });
}

// “다음” 버튼 클릭 시 처리 로직
document.getElementById("next-person").addEventListener("click", () => {
  // 1) 현재 사람이 몇 개 메뉴를 선택했는지 체크박스 상태로 확인
  const currentSelections = [];

  orderList.forEach((item) => {
    // 각 메뉴의 체크박스(input id="sel-item-1" 등)를 가져와 checked 여부 확인
    const chk = document.getElementById(`sel-${item.id}`);
    if (chk && chk.checked) {
      // 체크된 경우 qty:1로 저장 (메뉴당 1개만 선택 가능)
      currentSelections.push({
        id: item.id,
        name: item.name,
        qty: 1,
        price: item.price
      });
    }
  });

  // 2) 이 사람이 선택한 메뉴 객체 배열을 저장
  selections[currentPersonIndex] = currentSelections;

  // 3) 다음 사람으로 넘어가기 위해 인덱스 증가
  currentPersonIndex++;

  // 4) 다음 사람이 남아 있는지 확인
  if (currentPersonIndex < peopleCount) {
    // 남아 있으면 다음 손님 화면을 다시 그립니다.
    renderPersonSelection();
  } else {
    // 마지막 사람이 선택을 마쳤으면, localStorage에 최종 selections 저장 후 결과 페이지로 이동
    localStorage.setItem("selections", JSON.stringify(selections));
    window.location.href = "result.html";
  }
});
