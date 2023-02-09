const cards = document.querySelector("#cards");
const app = document.querySelector("#app");
const productCategoriesBtn = document.querySelector("#productCategories");
const search = document.querySelector("#search");
const cart = document.querySelector("#cart");
const addModal = document.querySelector("#addModal");
const offcanvasBtn = document.querySelector("#offcanvasBtn");
const offcanvasBody = document.querySelector("#offcanvasBody");
const total = document.querySelector("#total");
const productDetailModal = new bootstrap.Modal("#productDetailModal");

// functions
const rating = (rate) => {
  let stars = "";
  for (let i = 1; i <= 5; i++) {
    stars += `${
      Math.floor(rate) >= i
        ? '<i class=" bi bi-star-fill text-warning"></i>'
        : '<i class=" bi bi-star"></i>'
    }`;
  }
  return stars;
};

const excerpt = (str, maxLength = 70) => {
  if (str.length >= maxLength) {
    return str.substr(0, maxLength) + "...";
  }
  return str;
};

const createCard = (products) => {
  const card = document.createElement("div");
  card.setAttribute("card-id", products.id);
  card.className = "col-12 col-md-6 col-lg-4 product-card";
  card.innerHTML = `
  <div class=" card p-3">
  <img src="${products.thumbnail}" class=" w-100 img rounded" alt="">
  <div class=" card-body p-0">
      <h4 class=" text-truncate fw-bold mt-3">${products.title}</h4>
      <div class=" d-flex justify-content-between align-items-center">
          <div class=" badge info-gradient text-capitalize">
              ${slugToText(products.category)}
          </div>
          <div class=" small">
              ${rating(products.rating)}
          </div>
      </div>
      <p class=" mt-3 mb-4 small description text-black-50">${excerpt(
        products.description
      )}</p>
      <div class=" d-flex justify-content-between align-items-center">
          <div class=" h5 text-info">$ <span class="price">${
            products.price
          }</span></div>
          <button class=" btn btn-outline-info add">Add to Cart</button>
      </div>
  </div>
</div>
  `;

  return card;
};

const createCategoriesBtn = (name) => {
  const btn = document.createElement("button");
  btn.setAttribute("cat", name);
  btn.className = " btn btn-outline-info text-capitalize cat";
  btn.innerText = slugToText(name);

  return btn;
};

const slugToText = (str) => {
  return str.replaceAll("-", " ");
};

const renderProductModal = () => {
  const currentCard = event.target.closest(".product-card");
  const currentProduct = products.find(
    (product) => product.id == currentCard.getAttribute("card-id")
  );
  // console.log(currentCard, currentProduct, currentProduct.images);

  productDetailModal._element.querySelector(".modal-title").innerText =
    currentProduct.title;
  productDetailModal._element.querySelector(".modal-body").innerHTML = `
    <div id="productDetailsIndicators" class="carousel slide">
    <div class="carousel-indicators">
      ${productDetailCarousel(currentProduct.images).indicators}
    </div>
    <div class="carousel-inner">
      ${productDetailCarousel(currentProduct.images).slides}
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#productDetailsIndicators" data-bs-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#productDetailsIndicators" data-bs-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
  <div class=" d-flex justify-content-between align-items-center mt-3">
    <div class=" badge info-gradient text-capitalize">
        ${slugToText(currentProduct.category)}
    </div>
    <div class=" small">
        ${rating(currentProduct.rating)}
    </div>
  </div>
  <p class=" mt-2 small description">${currentProduct.description}</p>
  <div class=" h5 text-info">$ <span class="price">${
    currentProduct.price
  }</span></div>
    `;
  productDetailModal.show();
  // console.log(productDetailModal)
};

const productDetailCarousel = (arr) => {
  let slides = "";
  let indicators = "";

  arr.forEach((el, index) => {
    slides += `
        <div class="carousel-item ${index === 0 && "active"}">
        <img src="${el}" class="d-block w-100 carouselImage" alt="...">
      </div>
        `;

    indicators += `
        <button type="button" data-bs-target="#productDetailsIndicators" 
        data-bs-slide-to="${index}" class="${index === 0 && "active"}" 
        aria-current="true" aria-label="Slide 1"></button>
        `;
  });

  return { slides, indicators };
};

const renderProductCard = (products) => {
  cards.innerHTML = null;
  products.forEach((product) => {
    cards.append(createCard(product));
  });
};

const renderProductCardByCategory = () => {
  const selectedCategory = event.target.getAttribute("cat");
  if (selectedCategory === "all") {
    renderProductCard(products);
  } else {
    renderProductCard(
      products.filter((product) => product.category === selectedCategory)
    );
  }

  productCategoriesBtn.querySelector(".active").classList.remove("active");
  event.target.classList.add("active");
};

const renderBySearch = (key) => {
  renderProductCard(
    products.filter((product) => {
      return (
        product.title.toLocaleLowerCase().search(key.toLocaleLowerCase()) !=
          -1 ||
        product.description
          .toLocaleLowerCase()
          .search(key.toLocaleLowerCase()) != -1 ||
        product.category.toLocaleLowerCase().search(key.toLocaleLowerCase()) !=
          -1
      );
    })
  );
};

const fly_img = () => {
  const orgImg = event.target.closest(".product-card").querySelector(".img");

  // const addBtn = event.target.closest(".product-card").querySelector(".img");
  const flyImg = new Image();
  flyImg.src = orgImg.src;
  flyImg.style.position = "fixed";
  flyImg.style.transform = "scaleX(0.4)";
  flyImg.style.transition = "0.5s";
  flyImg.style.width = orgImg.getBoundingClientRect().width + "px";
  flyImg.style.height = orgImg.getBoundingClientRect().height + "px";
  flyImg.style.left = orgImg.getBoundingClientRect().left + "px";
  flyImg.style.top = orgImg.getBoundingClientRect().top + "px";

  // console.log(orgImg.getBoundingClientRect().width,flyImg.style.width)

  document.body.append(flyImg);

  setTimeout(() => {
    flyImg.style.zIndex = "200";
    flyImg.style.transform += "rotate(360deg)";
    flyImg.style.width = "0px";
    flyImg.style.height = "0px";
    flyImg.style.left = cart.getBoundingClientRect().left + "px";
    flyImg.style.top = cart.getBoundingClientRect().top + 25 + "px";
  }, 100);
};

const createOffcanvasBox = () => {
  const currentImage = event.target
    .closest(".product-card")
    .querySelector(".img");
  const currentDescription = event.target
    .closest(".product-card")
    .querySelector(".description");
  const currentPrice = event.target
    .closest(".product-card")
    .querySelector(".price");
  const currentId = event.target
    .closest(".product-card")
    .getAttribute("card-id");
  const unitPrice = event.target
    .closest(".product-card")
    .querySelector(".price").innerText;

  const box = document.createElement("div");
  box.setAttribute("box-id", currentId);
  box.setAttribute("unit-price", unitPrice);
  box.className = "border shadow p-3";
  box.innerHTML = ` 
            <img src="${currentImage.src}" class="w-100" alt="">
            <h5 class=" fw-bold mt-2">${currentDescription.innerText}</h5>
            <div class=" d-flex justify-content-between">
              <div class="d-flex align-items-center">
                <a class=" text-decoration-none text-dark border px-2 text-center info-transparent minusBtn">-</a>
                <span class=" border px-2 info-transparent qty">1</span>
                <a class="text-decoration-none text-dark border px-2 text-center info-transparent plusBtn">+</a>
              </div>
              <h5 class=" text-info fw-bold">$ <span class="price">${currentPrice.innerText}</span></h5>
            </div>`;

  return box;
};

//processes

renderProductCard(products);
// console.log(products)

categories.forEach((category) =>
  productCategoriesBtn.append(createCategoriesBtn(category))
);

// const productDetailCarouselIndicators = (arr) => {
//   let indicators = "";
//   arr.forEach((el, index) => {
//     indicators += `
//         <button type="button" data-bs-target="#carouselExampleIndicators"
//         data-bs-slide-to="${index}" class="${
//       index === 0 && "active"
//     }" aria-current="true" aria-label="Slide 1"></button>
//         `;
//   });

//   return indicators;
// };

search.addEventListener("keyup", (event) => {
  renderBySearch(event.target.value);
});

// addModal.addEventListener("click", () => {
//   console.log("lksdf");
// });

cart.addEventListener("click", () => {
  offcanvasBtn.click();
});

app.addEventListener("click", (event) => {
  if (
    event.target.closest(".product-card") &&
    !event.target.classList.contains("add")
  ) {
    renderProductModal();
  }

  if (event.target.classList.contains("cat")) {
    // console.log(event.target.getAttribute("cat"));
    renderProductCardByCategory();
    // renderProductCardByCategory()
    // renderProductCard(products.filter((product) => product.category === event.target.getAttribute("cat")))
  }
  if (event.target.classList.contains("add")) {
    const add = event.target.closest(".product-card").querySelector(".add");
    add.classList.add("active");
    add.innerText = "Add more";
    fly_img();

    if (event.target.classList.contains("plusBtn")) {
      console.log("add");
    }

    const existedCard = [...offcanvasBody.children].find(
      (el) =>
        el.getAttribute("box-id") ==
        event.target.closest(".product-card").getAttribute("card-id")
    );
    // console.log(existedCard);
    if (existedCard) {
      // console.log(existedCard);
      const plusBtn = existedCard.querySelector(".plusBtn");
      const qty = existedCard.querySelector(".qty");
      const minusBtn = existedCard.querySelector(".minusBtn");
      const price = existedCard.querySelector(".price");
      const unitPrice = existedCard.getAttribute("unit-price");

      // console.log(plusBtn);
      plusBtn.addEventListener("click", () => {
        qty.innerText = parseFloat(qty.innerText) + 1;
        price.innerText = parseFloat(qty.innerText) * parseFloat(unitPrice);
      });
      minusBtn.addEventListener("click", () => {
        qty.innerText = parseFloat(qty.innerText) - 1;
        price.innerText = parseFloat(qty.innerText) * parseFloat(unitPrice);
      });
      // console.log(existedCard)
      // console.log(qty,qty.innerText,typeof qty.innerText,typeof parseFloat(qty.innerText));
      console.log(qty.innerHTML, typeof qty.innerHTML);
      qty.innerText = parseInt(qty.innerText, 10) + 1;
    } else {
      offcanvasBody.append(createOffcanvasBox());
    }
  }
});
