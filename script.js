(() => {
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const money = n => new Intl.NumberFormat('ru-RU',{maximumFractionDigits:0}).format(n)+' ₽';
  const products = [
    {id:1,name:'Princeton — кресло',category:'Кресла',material:'Ткань',color:'Молочный',price:49500,oldPrice:null,badge:'Бестселлер',image:'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=800&q=80',swatches:['#e9e1d2','#594238','#555653'],stock:true},
    {id:2,name:'Indivi 2.5 — диван',category:'Диваны',material:'Ткань',color:'Зелёный',price:99500,oldPrice:109500,badge:'Скидка',image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',swatches:['#33472c','#bdb3a1','#4d3028'],stock:true},
    {id:3,name:'Paddle — подвесной светильник',category:'Освещение',material:'Металл',color:'Бежевый',price:29500,oldPrice:null,badge:'',image:'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',swatches:['#c7b69a'],stock:true},
    {id:4,name:'Sideboard — комод из дуба',category:'Декор',material:'Дуб',color:'Коричневый',price:74500,oldPrice:null,badge:'Новинка',image:'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80',swatches:['#b28d64','#594238'],stock:true},
    {id:5,name:'Element — кровать',category:'Декор',material:'Дерево',color:'Серый',price:159500,oldPrice:null,badge:'',image:'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',swatches:['#999b98','#594238','#142d4d'],stock:true},
    {id:6,name:'Float — керамическая ваза',category:'Декор',material:'Керамика',color:'Молочный',price:19500,oldPrice:null,badge:'Новинка',image:'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=800&q=80',swatches:['#e9e1d2'],stock:true},
    {id:7,name:'Arc — журнальный стол',category:'Столы',material:'Дуб',color:'Бежевый',price:58900,oldPrice:64900,badge:'Скидка',image:'https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=800&q=80',swatches:['#c7b69a','#594238'],stock:true},
    {id:8,name:'Luma — кресло',category:'Кресла',material:'Металл',color:'Зелёный',price:42500,oldPrice:null,badge:'',image:'https://images.unsplash.com/photo-1598300056393-4aac492f4344?auto=format&fit=crop&w=800&q=80',swatches:['#243e32','#e9e1d2'],stock:false},
    {id:9,name:'Hollis — диван на двоих',category:'Диваны',material:'Ткань',color:'Молочный',price:124900,oldPrice:149900,badge:'Бестселлер',image:'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',swatches:['#ded3c0','#666764','#37432a'],stock:true},
    {id:10,name:'Halo — настольная лампа',category:'Освещение',material:'Металл',color:'Коричневый',price:18900,oldPrice:null,badge:'',image:'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80',swatches:['#c7b69a','#222'],stock:true},
    {id:11,name:'Forma — обеденный стол',category:'Столы',material:'Дерево',color:'Коричневый',price:89900,oldPrice:null,badge:'Новинка',image:'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',swatches:['#594238','#c7b69a'],stock:true},
    {id:12,name:'Pebble — декоративная ваза',category:'Декор',material:'Керамика',color:'Молочный',price:8900,oldPrice:null,badge:'',image:'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',swatches:['#e9e1d2','#999b98'],stock:true}
  ];
  let cart = JSON.parse(localStorage.getItem('forma-cart') || '[]');
  let favorites = JSON.parse(localStorage.getItem('forma-favorites') || '[]');
  let visibleCount = 9;
  let toastTimer;
  const toast = message => { const el=$('#toast'); if(!el)return; el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2400); };
  const persist = () => { localStorage.setItem('forma-cart',JSON.stringify(cart));localStorage.setItem('forma-favorites',JSON.stringify(favorites));updateCartCount();renderCart(); };
  const card = p => `<article class="product-card"><a class="product-image" href="product.html" aria-label="Открыть ${p.name}"><img loading="lazy" src="${p.image}" alt="${p.name}">${p.badge?`<span class="product-badge">${p.badge}</span>`:''}</a><button class="favorite-btn ${favorites.includes(p.id)?'is-favorite':''}" data-favorite="${p.id}" aria-label="Добавить в избранное">${favorites.includes(p.id)?'♥':'♡'}</button><div class="product-meta"><p class="product-category">${p.material}</p><h3 class="product-name"><a href="product.html">${p.name}</a></h3><div class="product-price">${money(p.price)} ${p.oldPrice?`<del>${money(p.oldPrice)}</del>`:''}</div><div class="product-swatches">${p.swatches.map(c=>`<i style="--swatch:${c}"></i>`).join('')}</div><button class="quick-add" data-add="${p.id}">Добавить в корзину +</button></div></article>`;
  function updateCartCount(){const count=cart.reduce((sum,x)=>sum+x.qty,0);$$('#cartCount').forEach(el=>el.textContent=count);}
  function addToCart(id,qty=1,variant=''){const p=products.find(x=>x.id===Number(id));if(!p)return;const key=String(p.id)+variant;const existing=cart.find(x=>x.key===key);if(existing)existing.qty+=qty;else cart.push({key,id:p.id,qty,variant});persist();toast('Добавлено в корзину');}
  function renderCart(){const list=$('#cartItems');if(!list)return;if(!cart.length){list.innerHTML='<p class="cart-empty">Корзина пока пуста. Самое время выбрать что-то для дома.</p>';$('#cartTotal').textContent=money(0);return;}list.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `<article class="cart-line"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><p>${item.variant||p.color}</p><strong>${money(p.price*item.qty)}</strong><div class="mini-qty"><button data-cart-minus="${item.key}">−</button><span>${item.qty}</span><button data-cart-plus="${item.key}">+</button></div></div><button class="remove-line" data-remove="${item.key}" aria-label="Удалить">×</button></article>`}).join('');$('#cartTotal').textContent=money(cart.reduce((s,item)=>s+products.find(p=>p.id===item.id).price*item.qty,0));}
  function openCart(){renderCart();$('#overlay')?.classList.add('open');$('#cartDrawer')?.classList.add('open');document.body.style.overflow='hidden';}
  function closeCart(){ $('#overlay')?.classList.remove('open');$('#cartDrawer')?.classList.remove('open');document.body.style.overflow=''; }
  function toggleFavorite(id){id=Number(id);favorites=favorites.includes(id)?favorites.filter(x=>x!==id):[...favorites,id];persist();$$(`[data-favorite="${id}"]`).forEach(b=>{b.classList.toggle('is-favorite',favorites.includes(id));b.textContent=favorites.includes(id)?'♥':'♡';});if($('#detailFavorite'))$('#detailFavorite').classList.toggle('is-favorite',favorites.includes(9));toast(favorites.includes(id)?'Добавлено в избранное':'Удалено из избранного');}
  function renderGrid(target,items){if(target)target.innerHTML=items.map(card).join('');}
  renderGrid($('#homeProducts'),products.slice(0,4));renderGrid($('#relatedProducts'),products.filter(p=>[1,3,7,6].includes(p.id)));
  updateCartCount();renderCart();
  // Catalog filtering and sorting
  const catalogGrid=$('#catalogProducts');
  if(catalogGrid){
    const params=new URLSearchParams(location.search);const requested=params.get('category');if(requested)$$('input[name="category"]').forEach(i=>i.checked=i.value===requested);
    const state={search:'',view:'grid'};
    const checked=name=>$$(`input[name="${name}"]:checked`).map(i=>i.value);
    function applyFilters(){
      const cats=checked('category'),mats=checked('material'),colors=checked('color');const min=Number($('#minPrice').value||0),max=Number($('#maxPrice').value||300000),stock=$('#inStock').checked;
      let items=products.filter(p=>(!cats.length||cats.includes(p.category))&&(!mats.length||mats.includes(p.material))&&(!colors.length||colors.includes(p.color))&&p.price>=min&&p.price<=max&&(!stock||p.stock)&&p.name.toLowerCase().includes(state.search.toLowerCase()));
      const sort=$('#sortSelect').value;if(sort==='price-asc')items.sort((a,b)=>a.price-b.price);if(sort==='price-desc')items.sort((a,b)=>b.price-a.price);if(sort==='name')items.sort((a,b)=>a.name.localeCompare(b.name,'ru'));
      const activeCount=cats.length+mats.length+colors.length+(stock?1:0)+(min>0||max<300000?1:0);
      $('#filterCount').textContent=activeCount?`(${activeCount})`:'';$('#resultsCount').textContent=items.length;
      const chips=[...cats,...mats,...colors];$('#activeChips').innerHTML=chips.map(v=>`<button class="chip" data-chip="${v}">${v} ×</button>`).join('');
      catalogGrid.classList.toggle('list-view',state.view==='list');renderGrid(catalogGrid,items.slice(0,visibleCount));$('#emptyState').hidden=items.length>0;$('#loadMore').hidden=items.length<=visibleCount;
      $$('.view-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===state.view));
    }
    $$('input[name="category"],input[name="material"],input[name="color"],#inStock').forEach(el=>el.addEventListener('change',()=>{visibleCount=9;applyFilters();}));
    $('#minPrice').addEventListener('change',()=>{visibleCount=9;applyFilters();});$('#maxPrice').addEventListener('change',()=>{visibleCount=9;$('#priceRange').value=$('#maxPrice').value;applyFilters();});$('#priceRange').addEventListener('input',e=>{$('#maxPrice').value=e.target.value;applyFilters();});
    $('#sortSelect').addEventListener('change',applyFilters);
    $('#clearFilters').addEventListener('click',()=>{$$('input[type=checkbox]',$('#filters')).forEach(i=>i.checked=false);$('#minPrice').value=0;$('#maxPrice').value=300000;$('#priceRange').value=300000;state.search='';applyFilters();});
    $('#activeChips').addEventListener('click',e=>{const b=e.target.closest('[data-chip]');if(!b)return;$$('input[type=checkbox]',$('#filters')).forEach(i=>{if(i.value===b.dataset.chip)i.checked=false;});applyFilters();});
    $('#loadMore').addEventListener('click',()=>{visibleCount+=6;applyFilters();});
    $$('.view-btn').forEach(b=>b.addEventListener('click',()=>{state.view=b.dataset.view;applyFilters();}));
    $('#showFilters')?.addEventListener('click',()=>{$('#filters').classList.add('filters-open');$('#overlay').classList.add('open');});
    window.addEventListener('forma-search',e=>{state.search=e.detail||'';visibleCount=9;applyFilters();});
    applyFilters();
  }
  // Product detail interactions
  if($('#mainProductImage')){
    $$('.thumb').forEach(b=>b.addEventListener('click',()=>{$('#mainProductImage').src=b.dataset.image;$$('.thumb').forEach(x=>x.classList.toggle('active',x===b));}));
    $$('.swatch').forEach(b=>b.addEventListener('click',()=>{$$('.swatch').forEach(x=>x.classList.toggle('selected',x===b));$('#selectedColor').textContent=b.dataset.color;}));
    $$('.option-pill').forEach(b=>b.addEventListener('click',()=>{$$(`.option-pill[data-${b.dataset.size?'size':b.dataset.material?'material':'none'}]`).forEach(x=>x.classList.remove('selected'));b.classList.add('selected');}));
    let qty=1;$('#qtyMinus').addEventListener('click',()=>{qty=Math.max(1,qty-1);$('#productQty').textContent=qty;});$('#qtyPlus').addEventListener('click',()=>{qty=Math.min(20,qty+1);$('#productQty').textContent=qty;});
    $('#addDetail').addEventListener('click',()=>{const color=$('#selectedColor').textContent;const size=$('.option-pill[data-size].selected')?.dataset.size||'3 места';const material=$('.option-pill[data-material].selected')?.dataset.material||'Рогожка';addToCart(9,qty,`${color} · ${size} · ${material}`);openCart();});
    $('#detailFavorite').addEventListener('click',()=>toggleFavorite(9));
    const tabs={description:'<p>Hollis создан для спокойных вечеров и долгих разговоров. Чёткий силуэт, глубокое сиденье и упругая подушка обеспечивают комфорт, а ножки из массива дуба добавляют лёгкости и тепла.</p><p>Каркас изготовлен из сертифицированной древесины, а съёмные чехлы помогают сохранить аккуратный вид на долгие годы.</p>',specs:'<p><b>Каркас:</b> массив дуба и берёзовая фанера.</p><p><b>Обивка:</b> рогожка, букле или велюр.</p><p><b>Размер:</b> 208 × 92 × 82 см для версии на три места.</p><p><b>Наполнение:</b> высокоэластичная пена и пружинный блок.</p><p><b>Производство:</b> Россия.</p>',care:'<p>Регулярно очищайте поверхность мягкой щёткой или насадкой пылесоса. Пятна промокайте чистой сухой тканью, не растирая.</p><p>Для глубокой чистки используйте средства, подходящие выбранному типу обивки. Ножки протирайте слегка влажной тканью.</p><p>Сборка занимает около 15 минут; инструмент и инструкция входят в комплект.</p>'};
    $$('.tab').forEach(b=>b.addEventListener('click',()=>{$$('.tab').forEach(x=>x.classList.toggle('active',x===b));$('#tabContent').innerHTML=tabs[b.dataset.tab];}));
    if(favorites.includes(9))$('#detailFavorite').classList.add('is-favorite');
  }
  // Shared actions
  $('#cartBtn')?.addEventListener('click',openCart);$('#closeCart')?.addEventListener('click',closeCart);$('#overlay')?.addEventListener('click',()=>{closeCart();$('#filters')?.classList.remove('filters-open');});
  document.addEventListener('click',e=>{
    const add=e.target.closest('[data-add]');if(add)addToCart(add.dataset.add);
    const fav=e.target.closest('[data-favorite]');if(fav)toggleFavorite(fav.dataset.favorite);
    const plus=e.target.closest('[data-cart-plus]');if(plus){const item=cart.find(x=>x.key===plus.dataset.cartPlus);if(item)item.qty++;persist();}
    const minus=e.target.closest('[data-cart-minus]');if(minus){const item=cart.find(x=>x.key===minus.dataset.cartMinus);if(item)item.qty=Math.max(1,item.qty-1);persist();}
    const remove=e.target.closest('[data-remove]');if(remove){cart=cart.filter(x=>x.key!==remove.dataset.remove);persist();}
  });
  $('#checkoutBtn')?.addEventListener('click',()=>toast(cart.length?'Демо-режим: подключите платёжную систему для заказа':'Сначала добавьте товары в корзину'));
  $('#mobileMenu')?.addEventListener('click',()=>$('#mainNav')?.classList.toggle('open'));
  $('#accountBtn')?.addEventListener('click',()=>toast('Личный кабинет будет доступен после подключения backend'));
  $('#searchBtn')?.addEventListener('click',()=>$('#searchDialog')?.showModal());
  $('#runSearch')?.addEventListener('click',()=>{const q=$('#globalSearch').value.trim();if(location.pathname.endsWith('catalog.html'))window.dispatchEvent(new CustomEvent('forma-search',{detail:q}));else location.href='catalog.html'+(q?'?q='+encodeURIComponent(q):'');});
  const searchParam=new URLSearchParams(location.search).get('q');if(searchParam&&catalogGrid){const ev=new CustomEvent('forma-search',{detail:searchParam});setTimeout(()=>window.dispatchEvent(ev),0);}
  $('#newsletterForm')?.addEventListener('submit',e=>{e.preventDefault();toast('Спасибо за подписку! Это демонстрационная форма.');e.target.reset();});
  $('#nextSlide')?.addEventListener('click',()=>toast('Скоро здесь появятся новые коллекции.'));
})();