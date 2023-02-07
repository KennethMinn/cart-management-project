const cards = document.querySelector("#cards");
const app = document.querySelector("#app");
const productDetailModal = new bootstrap.Modal("#productDetailModal");

// productDetailModal.show()
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
              ${products.category.replaceAll("-", " ")}
          </div>
          <div class=" small">
              ${rating(products.rating)}
          </div>
      </div>
      <p class=" mt-3 mb-4 small description text-black-50">${excerpt(
        products.description
      )}</p>
      <div class=" d-flex justify-content-between align-items-center">
          <div class=" h5 text-info">$ ${products.price}</div>
          <button class=" btn btn-outline-info">Add to Cart</button>
      </div>
  </div>
</div>
  `;

  return card;
};

products.forEach((product) => {
  cards.append(createCard(product));
});

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

app.addEventListener("click", (event) => {
  if (event.target.closest(".product-card")) {
    const currentCard = event.target.closest(".product-card");
    const currentProduct = products.find(
      (product) => product.id == currentCard.getAttribute("card-id")
    );
    console.log(currentCard, currentProduct, currentProduct.images);

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
        ${currentProduct.category.replaceAll("-", " ")}
    </div>
    <div class=" small">
        ${rating(currentProduct.rating)}
    </div>
  </div>
  <p class=" mt-2 small description">${currentProduct.description}</p>
  <div class=" h5 text-info">$ ${currentProduct.price}</div>
    `;
    productDetailModal.show();
    // console.log(productDetailModal)
  }
});
