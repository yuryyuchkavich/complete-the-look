import isPassiveSupport from './isPassiveSupport.js'
class DragableCard{

    constructor(settings){

        this.isActive = false;

        this.trackableElement  = settings.trackableElement;
        this.closeCardCallback = settings.closeCardCallback;
        this.pcontent          = settings.pcontent;
        this.dragable          = settings.dragable;
        this.close             = settings.closeButton;
        this.basePopup         = settings.basePopup;
        this.popupTopPadding   = settings.popupTopPadding || 32;


        this.touchingElement   = false;
        this.isMoved           = false;
        this.isMoving          = false;
        this.dragDirection     = '';

        this.startTime         = new Date().getTime();
        this.cardHeight        = 0;
        this.lastOffsetHeight  = 0;

        this.startX = 0;
        this.startY = 0;

        this.lastY = 0;
        this.lastX = 0;

        this.currentX = 0;
        this.currentY = 0;

        this.moveY = 0;
        


        this.bindEventListeners();

    }


    bindEventListeners(){
        if(isPassiveSupport()){
            this.trackableElement.addEventListener("touchstart", this.onTouchStart.bind(this), {passive: true});
            this.trackableElement.addEventListener("touchmove",  this.onTouchMove.bind(this), {passive: true});
            this.trackableElement.addEventListener("touchend",   this.onTouchEnd.bind(this), {passive: true});
            window.addEventListener("resize", this.setHeight.bind(this));
        }
        else{
            this.trackableElement.addEventListener("touchstart", this.onTouchStart.bind(this), false);
            this.trackableElement.addEventListener("touchmove",  this.onTouchMove.bind(this),  false);
            this.trackableElement.addEventListener("touchend",   this.onTouchEnd.bind(this),   false);
            window.addEventListener("resize", this.setHeight.bind(this));
        }

    }


    onActive(){
        this.isActive = true;
        this.resetPosition();
        this.setHeight(false);
    }


    onHide(){
        this.isActive = false;
        //this.setHeight(true);
    }


    onTouchStart(evt){
        this.startTime  = new Date().getTime();

        this.startY     = evt.touches[0].pageY;
        this.startX     = evt.touches[0].pageX;
        this.touchingElement = true;
        this.touchStart(this.startY, this.startX);
    }

    touchStart(startY, startX) {
        this.isMoving   = true;
        this.cardHeight     = this.pcontent.offsetHeight;
        this.dragDirection  = "";
    
        this.lastY = startY;
        this.lastX = startX;
    }

    onTouchMove(evt) {
        if (!this.touchingElement)
            return;
            
        this.currentY = evt.touches[0].pageY;
        this.currentX = evt.touches[0].pageX;
        this.isMoved = true;
    
        const translateY = this.currentY - this.startY; // distance moved in the x axis
        const translateX = this.currentX - this.startX; // distance moved in the y axis
        
        this.touchMove(evt, this.currentY, this.currentX, translateY, translateX);
    }

    touchMove(evt, currentY, currentX, translateY, translateX) {

        if (!this.dragDirection) {
            if (Math.abs(translateY) >= Math.abs(translateX)) {
                this.dragDirection = "vertical";
            } else {
                this.dragDirection = "horizontal";
            }
            
            requestAnimationFrame(this.updateUi.bind(this)); // this is what effectively does the animation (ﾉ◕ヮ◕)ﾉ*:・ﾟ✧
        }


        if (this.dragDirection === "horizontal") {
            this.lastY = currentY;
            this.lastX = currentX;
        } 
        else{  
            if (this.moveY + (currentY - this.lastY) > 0 && this.moveY + (currentY - this.lastY) > - this.cardHeight) {
                this.moveY = this.moveY + (currentY - this.lastY);
            }
            else if (this.moveY + (currentY - this.lastY) < 0 && this.moveY + (currentY - this.lastY) > - this.cardHeight){
                evt.stopPropagation();
            }

            this.lastY = currentY;
            this.lastX = currentX;
        }

    }

    onTouchEnd(evt) {
        if (!this.touchingElement)
            return;
    
        this.touchingElement = false;
        const translateY = this.currentY - this.startY; // distance moved in the x axis
        const translateX = this.currentX - this.startX; // distance moved in the y axis
    
        const timeTaken = (new Date().getTime() - this.startTime);
    
        this.touchEnd(evt, this.currentY, this.currentX, translateY, translateX, timeTaken)
    }
    
    touchEnd(evt, currentY, currentX, translateY, translateX, timeTaken) {
        this.isMoving = false;
        const velocity = 0.3;
    
        if ((translateY < (- this.cardHeight) / 2) || (Math.abs(translateY) / timeTaken > velocity)) {
            if(this.isMoved) this.closeCardCallback(evt);
            this.resetPosition();
        } else {
            this.resetPosition();
        }
    }

    resetPosition(){
        this.setTransform(this.pcontent, 0);
        //this.setTransform(this.dragable, 0);
        //this.setTransform(this.close, 0);
        
        this.startY = 0,
        this.startX = 0;

        this.currentY = 0,
        this.currentX = 0;
        this.isMoved = false;

        this.cardHeight = 0;
        this.lastY = 0;
        this.lastX = 0;

        this.moveY = 0;
    }

    setTransform(el, moveY){
        el.style.transform = "translateY(" + moveY + "px)";
        el.style.webkitTransform = "translateY(" + moveY + "px)";
    }

    updateUi() {
        if (this.isMoving) {
    
            this.setTransform(this.pcontent, this.moveY);
            //this.setTransform(this.dragable, this.moveY);
            //this.setTransform(this.close, this.moveY);
    
            requestAnimationFrame(this.updateUi.bind(this));
        }
    }

    setLastHeight(){
        this.lastOffsetHeight = 0 + this.pcontent.offsetHeight;
    }

    setHeight(active = false){
        if(!this.isActive){
            return;
        }

        if(active === true){
            document.querySelector("body").style.height = '';
            document.querySelector("html").style.height = '';
            return;
        }

        let offsetHeight = window.innerHeight - this.popupTopPadding;

        
        this.basePopup.style.height = window.innerHeight + 'px';
        this.pcontent.style.height  = offsetHeight + 'px';
        document.querySelector("body").style.height = window.innerHeight + 'px';
        document.querySelector("html").style.height = window.innerHeight + 'px';


        if(this.lastOffsetHeight && this.lastOffsetHeight != offsetHeight){
            this.pcontent.scrollTop = this.pcontent.scrollTop + this.lastOffsetHeight - offsetHeight;
            this.lastOffsetHeight = offsetHeight;
        }
    }

}

export default DragableCard;