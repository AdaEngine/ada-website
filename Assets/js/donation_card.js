//
//  donation_card.js
//  AdaEngineWebsite
//
//  Created by Vladislav Prusakov on 05.05.2025.
//

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
