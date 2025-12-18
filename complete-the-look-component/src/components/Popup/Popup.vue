<script>
import DragableCard from './helper/dragableCard.js';
import { isMDL } from './helper/isMobileScreen.js';
import SvgIcon from '../SvgIcon.vue';

export default {
    data(){
      return {
        isActive: false,
        dragableCard: false,
        isClickOutsideActive: false,
      }  
    },
    props:{
        title: {type: String, default: ''},
        closeClass: {type: String, default: ''},
        baseClass: {type: String, default: ''},
        isCentered: {type: Boolean, default: false},
        noHeader: {type: Boolean, default: false},
        showCloseButton: {type: Boolean, default: true},
        autoHeight: {type: Boolean, default: false},
        verticalAlign: {type: String, default: 'center'}
    },
    mounted(){
        if(isMDL() && !this.dragableCard){
            this.dragableCard = new DragableCard({
                trackableElement: this.$el.querySelector(".basepopup-dragable"),
                closeCardCallback: this.hide.bind(this),
                pcontent: this.$el.querySelector('.basepopup-content'),
                dragable: this.$el.querySelector('.basepopup-dragable'),
                closeButton: this.$el.querySelector('.basepopup-dragable'),
                basePopup: this.$el
            });
        }

        this.$emit('mounted', this);
    },
    updated() {
        if(isMDL())
            this.$nextTick(() => {
                this.dragableCard.setLastHeight();
            });

        this.$nextTick(() => {
            if(this.isActive)
                    this.$el.classList.add('active');
                else
                    this.$el.classList.remove('active');
        })
    },
    methods:{
        active(){
            if(isMDL()){
                this.dragableCard.onActive();   
            } 

            this.overflowHidden();
            this.isActive = true;
            setTimeout(() => {
                if(!this.isActive) return;
                this.isClickOutsideActive = true;
            }, 500);
        },
        hide(event){
            if(!this.isActive) return;
            if(isMDL()){
                this.dragableCard.onHide(); 
            }

            this.overflowVisible();
            this.isActive = false;
            this.$emit('hide');
            this.isClickOutsideActive = false;
        },
        clickOutsite(event){
            if(this.isClickOutsideActive){
                this.hide(event);
            }
        },
        overflowHidden(){
            document.body.style.overflow = 'hidden';
        },
        overflowVisible(){
            document.body.style.overflow = '';
        }
    },
    computed: {
        vAlign(){
            if(this.verticalAlign == 'top') return 'flex-start';
            if(this.verticalAlign == 'bottom') return 'flex-end';
            return 'center';
        }
    },
    components:{
        SvgIcon
    }
}
</script>
<template>
    <div class="basepopup" v-show="isActive" :class="{[baseClass]: true, 'popup--center': isCentered, 'popup--noheader': noHeader, 'popup--autoheight': autoHeight}">
        <div class="basepopup-wrapper">
            <p class="direction"></p>
            <div class="basepopup-overlay" :style="{alignItems: vAlign}">
                <div class="basepopup-content" v-click-outside="event => clickOutsite(event)">
                    <div class="basepopup-dragable"></div>
                    <div class="basepopup-header">
                        <h2 v-if="title">{{ title }}</h2>
                        <div v-if="showCloseButton" class="delete-icon">
                            <svg-icon @click="hide" :name="'delete'" size="1.75rem"></svg-icon>
                        </div>
                    </div>
                    <slot class="basepopup-content-wrapper" name="basepopup-content-wrapper"></slot>
                    <div class="basepopup-footer">
                        <slot name="basepopup-footer"></slot>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="postcss">
    .direction{
        position: absolute;
        top: 0;
        font-size: 1rem;
        z-index: 1000;
        left: 10px;
    }

    .basepopup{
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        z-index: 1000;
        font-size: 0;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    /* .basepopup-overlay{
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background:  rgba(0,0,0,0.5);
    } */

    .basepopup-overlay {
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        opacity: 0;
        background-color: hsla(0,0%,7%,.36);
        backdrop-filter: blur(4px);
        transition: opacity .25s,visibility 0s linear .25s;
    }

    .basepopup .basepopup  .basepopup-overlay{
        background-color: transparent;
        backdrop-filter: none;
    }

    .basepopup-overlay {
        visibility: visible;
        opacity: 1;
        transition: opacity .8s ease,visibility 0s;
    }

    .basepopup-content{
        position: relative;
        z-index: 2;
        background: var(--bg-primary);
        border-radius: 1rem;
        width: 36.25rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .popup--center .basepopup-wrapper,
    .popup--center .basepopup-overlay{
        width: 100%;
        display: inline-flex;
        justify-content: center;
    }

    .popup--center .basepopup-content{
        height: auto;
        max-height: 100vh;
        overflow-y: scroll;
    }

    .basepopup .delete-icon{
        display: flex !important;
        align-items: center;
        justify-content: center;
        flex-shrink: 1 0 auto;
        color: var(--text-primary);
        cursor: pointer;
        background: var(--main-secondary-default);
        text-align: center;
        padding: .375rem;
        border-radius: 100px;
        margin-left: auto;
        height: 2.5rem;
        width: 2.5rem;
        z-index: 2;
    }

    .basepopup-image{
        position: relative;
        background: url('/karedesign.ru/image/banners/PopupBanner.jpg');
        background-size: cover;
        height: 32rem;
        border-top-left-radius: 1rem;
        border-bottom-left-radius: 1rem;
    }

    .basepopup-content{
        font-size: 0;
    }

    .basepopup-image, .basepopup-text{
        display: inline-block;
        vertical-align: top;
        width: 50%;
        font-size: 1rem;
    }

    .basepopup-text b{
        white-space: nowrap;
    }

    .basepopup-image-content h6{
        color: var(--text-button);
        font-size: 3rem;
        font-weight: 700;
        z-index: 1;
        position: relative;
    }

    .basepopup-image-content:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.3);
        top: 0;
        z-index: 0;
        left: 0;
        border-top-left-radius: 1rem;
        border-bottom-left-radius: 1rem;
    }

    .basepopup-text{
        height: 32rem; 
        padding: 2rem;
        box-sizing: border-box;
        text-align: left;  
    }

    .basepopup-text h4{
        font-size: 2rem;
        color: var(--text-primary);
        margin-bottom: 2rem;
    }

    .basepopup-text ul {
        list-style: none;
    }

    .basepopup-text li{
        padding: .5rem 0;
    }

    .basepopup-text li:before {
        content: "+";
        margin-right: 4px;
    }

    .basepopup-text-s{
        margin-top: 1.5rem;
        color: var(--main-default);
    }

    .basepopup-form-input{
        margin-top: 2rem;
        font-size: 0;
    }

    .basepopup-form-input .form-group input{
        font-size: 1rem;
        line-height: 1.5;
        color: 999;
        padding: .8rem 0;
        font-weight: 500;
        border: 0;
        outline: none;
        width: 100%;
        background: transparent;
        vertical-align: top;
    }

    .basepopup-form-input .btn-basepopup-apply{
        color: 999;
        padding: .8rem 0; 
        width: 35%;
        text-align: right;
        vertical-align: top;
    }

    .basepopup-form-input{
        border-bottom: 1px solid var(--main-secondary-hover);
        font-size: 0;
    }

    .basepopup-agree{
        font-size: .6rem;
        line-height: 1.5;
        margin-top: 1rem;
    }

    .basepopup-agree a{
        padding: 0;
    }

    .basepopup .delete-icon.close-black{
        color: var(--text-primary);
    }

    .basepopup-header{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .basepopup-content-wrapper{
        flex: 1;
        overflow-y: auto;
    }

    .basepopup-header{
        position: relative;
        padding: 2.75rem 2.75rem 1.5rem 2.75rem;
        border-bottom: 1px solid var(--main-secondary-default);
    }

    .popup--noheader .basepopup-header{
        position: absolute;
        top: 1rem;
        right: 1rem;
        padding: 0;
        border-bottom: 0;
    }

    .popup--autoheight .basepopup-content{
        height: initial !important;
    }

    @media only screen and (max-width: 1024px){
        .basepopup-content-wrapper{
            padding:  0 .875rem 1rem .875rem;
        }

        .basepopup-header{
            padding: 2rem .875rem 1rem .875rem;
            border-bottom: 0;
        }
    }

    @media only screen and (min-width: 1025px){
        .basepopup.desktop-panel{
            display: block;
            height: 100vh;
            bottom: inherit;
        }

        .desktop-panel:before{
            display: none;
        }

        .desktop-panel .basepopup-wrapper{
            position: relative;
            display: block;
        }

        .desktop-panel .basepopup-content{
            max-height: inherit;
            min-height: 100vh;
            height: inherit;
            border-radius: 0;
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            margin-right: -27rem;
            transition: margin ease .5s;
            overflow: hidden;
        }

        .desktop-panel.active .basepopup-content{
            margin-right: 0;
        }

        .desktop-panel .basepopup-content-wrapper{
            padding: 1.5rem 2.75rem 2.75rem 2.75rem;
        }
    }

    #heart {
        position: relative;
        top: 22px;
        width: 100px;
        height: 90px;
        transform: scale( .75);
        margin: 0 auto;
    }

    #heart:before,
    #heart:after {
    position: absolute;
    content: "";
    left: 50px;
    top: 0;
    width: 50px;
    height: 80px;
    background: var(--bg-primary);
    -moz-border-radius: 50px 50px 0 0;
    border-radius: 50px 50px 0 0;
    -webkit-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -o-transform: rotate(-45deg);
    transform: rotate(-45deg);
    -webkit-transform-origin: 0 100%;
    -moz-transform-origin: 0 100%;
    -ms-transform-origin: 0 100%;
    -o-transform-origin: 0 100%;
    transform-origin: 0 100%;
    }

    #heart:after {
    left: 0;
    -webkit-transform: rotate(45deg);
    -moz-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    -o-transform: rotate(45deg);
    transform: rotate(45deg);
    -webkit-transform-origin: 100% 100%;
    -moz-transform-origin: 100% 100%;
    -ms-transform-origin: 100% 100%;
    -o-transform-origin: 100% 100%;
    transform-origin: 100% 100%;
    }



    #heart-circle{
        height: 120px;
        width: 120px;
        background: var(--main-default);
        border-radius: 100px;
        position: relative;
        margin: 0 auto;
    }

  #heart-circle:before, #heart-circle:after {
    content: "";
    position: absolute;
    
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    
    background-color: var(--main-default);
    opacity: 0.4;
    border-radius: inherit;
  }
  
  #heart-circle:before {
    z-index: -2;
    animation: beat-before 1.5s ease 100ms infinite;
  }
  
  #heart-circle:after {
    z-index: -1;
    animation: beat-after 1.5s ease 200ms infinite;
  }




    @keyframes beat {
    0% {
        transform: scale(1);
    }
    
    50% {
        transform: scale(1.1);
    }
    }

    @keyframes beat-before {
    0% {
        transform: scale(1);
    }
    
    50% {
        transform: scale(1.15);
    }
    }

    @keyframes beat-after {
    0% {
        transform: scale(1);
    }
    
    50% {
        transform: scale(1.3);
    }
    }

    .basepopup-text-complete{
        width: 100%;
        text-align: center;
    }

    .basepopup-thanks{
        width: 100%;
        margin-top: 2.5rem;    
    }

    .close-hidden{
        display: none !important;
    }

    
    @media only screen and (max-width: 1024px){
        .basepopup{
            bottom: initial;
        }

        .basepopup .basepopup{
            margin-top: 3rem;
        }

        .basepopup .basepopup-content{
            width: 100%;
            box-sizing: border-box;
            margin-top: 2rem;
            max-height: initial;
            height: auto;
            border-bottom-left-radius: 0;
            border-bottom-right-radius: 0;
            overflow-y: scroll;
            position: relative;
        }

        .basepopup .basepopup-content .basepopup .basepopup-content{
            box-shadow: 8px 8px 32px 0 #2e304175;
        }

        .basepopup-wrapper{
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .basepopup-overlay{
            width: 100%;
            height: 100%;
        }

        .basepopup-content{
            width: 100% !important;
            max-width: 100% !important;
            height: 100%;
            max-height: 100vh;
            border-radius: 0 !important;
        }

        .basepopup-content > .delete-icon{
            display: none !important;
        }

        .basepopup-dragable{
            position: absolute;
            z-index: 3;
            top: 0;
            width: 100%;
            height:4rem;
        }

        .basepopup-dragable:before{
            content: '';
            display: block;
            margin: 0 auto;
            height: .4rem;
            width: 4rem;
            background: var(--other-default);
            border-radius: .4rem;
            margin-top: .5rem;
        }

        .basepopup-content-wrapper{
            padding-bottom: 1.5rem;
        }

        .basepopup-image, .basepopup-text{
            display: block;
            width: 100%;
        }

        .basepopup-image{
            height: 15rem;
            border-top-right-radius: 1rem;
            border-bottom-right-radius: 1rem;
        }

        .basepopup-image-content:before{
            border-top-right-radius: 1rem;
            border-bottom-right-radius: 1rem;
        }

        .basepopup-image-content h6{
            font-size: 1.5rem;
        }

        .basepopup .delete-icon{
            position: relative;
            z-index: 6;
        }
    }
    </style>