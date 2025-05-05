//
//  donation_card.js
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 05.05.2025.
//

// Code taken from https://codepen.io/simeydotme/pen/PrQKgo

const wrapper = document.querySelectorAll(".donation_card");

wrapper.forEach(element => {
    element.addEventListener("mousemove", e => {
        const rect = element.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        
        const shineElement = element.querySelector(".shineLayer");
        const card = element.querySelector(".card");
        const cardBg = card.querySelector(".cardBg");
        
        const mouseX = e.pageX - element.offsetLeft - width / 2;
        const mouseY = e.pageY - element.offsetTop - height / 2;
        
        // parallax angle in card
        const angleX = (mouseX / width) * -30;
        const angleY = (mouseY / height) * 30;
        card.style.transform = `rotateY(${angleX}deg) rotateX(${angleY}deg) `;
        
        console.log(card.id, card.style.transform);
        
        // parallax position of background in card
        const posX = (mouseX / width) * -20;
        const posY = (mouseY / height) * -20;
        cardBg.style.transform = `translateX(${posX}px) translateY(${posY}px)`;
        
        var backgroundShineLayerOpacity = ((mouseY / height) * 0.3) + 0.1;
        //bottom=0deg; left=90deg; top=180deg; right=270deg;
        var backgroundShineLayerDegree = (Math.atan2(mouseY - (height/2), mouseX - (width/2)) * 180/Math.PI) - 90;
        backgroundShineLayerDegree = backgroundShineLayerDegree < 0 ? backgroundShineLayerDegree += 360 : backgroundShineLayerDegree
        var backgroundShineLayer = "linear-gradient(" + backgroundShineLayerDegree + "deg, rgba(255,255,255," + backgroundShineLayerOpacity + ") 0%, rgba(255,255,255,0) 90%)";
        shineElement.style.background = backgroundShineLayer;
    });
    
    element.addEventListener("mouseout", e => {
        const shineElement = element.querySelector(".shineLayer");
        const card = element.querySelector(".card");
        const cardBg = card.querySelector(".cardBg");
        card.style.transform = `rotateY(0deg) rotateX(0deg) `;
        cardBg.style.transform = `translateX(0px) translateY(0px)`;
        shineElement.style.background = "";
    });
});

//
//const cards = document.querySelectorAll(".donation_card");
//let styleElement = document.querySelector(".hover");
//
//// Create style element if it doesn't exist
//if (!styleElement) {
//    styleElement = document.createElement("style");
//    styleElement.className = "hover";
//    document.head.appendChild(styleElement);
//}
//
//cards.forEach(card => {
//    card.addEventListener("mousemove", handleMove);
//    card.addEventListener("touchmove", handleMove);
//    card.addEventListener("mouseout", handleEnd);
//    card.addEventListener("touchend", handleEnd);
//    card.addEventListener("touchcancel", handleEnd);
//});
//
//function handleMove(e) {
//    e.preventDefault();
//
//    // Get card position and dimensions
//    const rect = this.getBoundingClientRect();
//    let pos = [0, 0];
//
//    if (e.type === "touchmove") {
//        pos = [
//            e.touches[0].clientX - rect.left,
//            e.touches[0].clientY - rect.top
//        ];
//    } else {
//        pos = [e.offsetX, e.offsetY];
//    }
//
//    // math for mouse position
//    const l = pos[0];
//    const t = pos[1];
//    const h = rect.height;
//    const w = rect.width;
//    const px = Math.abs(Math.floor(100 / w * l) - 100);
//    const py = Math.abs(Math.floor(100 / h * t) - 100);
//    const pa = (50 - px) + (50 - py);
//
//    // math for gradient / background positions
//    const lp = (50 + (px - 50) / 1.5);
//    const tp = (50 + (py - 50) / 1.5);
//    const px_spark = (50 + (px - 50) / 7);
//    const py_spark = (50 + (py - 50) / 7);
//    const p_opc = 20 + (Math.abs(pa) * 1.5);
//    const ty = ((tp - 50) / 2) * -1;
//    const tx = ((lp - 50) / 1.5) * .5;
//
//    // css to apply for active card
//    const grad_pos = `background-position: ${lp}% ${tp}%;`;
//    const sprk_pos = `background-position: ${px_spark}% ${py_spark}%;`;
//    const opc = `opacity: ${p_opc / 100};`;
//    const tf = `rotateX(${ty}deg) rotateY(${tx}deg)`;
//
//    console.log(this, this.style.transform);
//
//    // need to use a <style> tag for psuedo elements
//    const styleCode = `
//    .donation_card:hover:before { ${grad_pos} }
//    .donation_card:hover:after { ${sprk_pos} ${opc} }
//  `;
//
//    // set / apply css class and style
//    cards.forEach(c => c.classList.remove("active"));
//    this.classList.remove("animated");
//    this.style.transform = tf;
//    styleElement.innerHTML = styleCode;
//
//    if (e.type === "touchmove") {
//        return false;
//    }
//}
//
//function handleEnd() {
//    // remove css, apply custom animation on end
//    styleElement.innerHTML = "";
//    this.style.transform = "";
//}
