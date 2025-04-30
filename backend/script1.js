const images = [
    'img3.jpg',
    'img4.jpg',
    'img5.jpg',
    'img6.jpg'
  ];
  
  let current = 0;
  
  function changeBackground() {
    document.body.style.backgroundImage = `url(${images[current]})`;
    current = (current + 1) % images.length;
  }
  
  setInterval(changeBackground, 5000);
  changeBackground();
  